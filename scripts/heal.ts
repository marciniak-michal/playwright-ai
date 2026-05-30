/**
 * Self-healing script.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/heal.ts
 */
import { execSync } from 'child_process';
import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import type { HealingContext } from '../src/reporters/failure-reporter';

const FAILURES_PATH = 'test-results/failures.json';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-5.4-mini';
const BASE_BRANCH = process.env.BASE_BRANCH ?? 'master';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AiFix {
  filePath: string;
  newContent: string;
}

interface AiResponse {
  analysis: string;
  fixes: AiFix[];
}

// ─── AI ───────────────────────────────────────────────────────────────────────

async function callAi(context: HealingContext): Promise<AiResponse> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const pageObjectsSection =
    context.pageObjects.length > 0
      ? context.pageObjects
          .map((po) => `### Page Object: ${po.filePath}\n\`\`\`typescript\n${po.source}\n\`\`\``)
          .join('\n\n')
      : '_No page objects found._';

  const domTreeSection = context.domTree
    ? `## Page DOM Tree at Failure\n\`\`\`json\n${JSON.stringify(context.domTree, null, 2)}\n\`\`\``
    : '';

  const prompt = `You are a Playwright test repair agent.
A test has failed, most likely because the UI changed (e.g. a locator selector, test-id, or visible text is now different).

Your task: identify what changed and return the corrected TypeScript source for the affected file(s).

## Failing Test: ${context.testFile} (line ${context.testLine})
\`\`\`typescript
${context.testSource}
\`\`\`

${pageObjectsSection}

## Error
\`\`\`
${context.errorMessage}
${context.errorLine}
\`\`\`

${domTreeSection}

## Rules
- Only fix locators, text values, or selectors directly related to the reported error.
- Do NOT change test logic, add comments, or refactor anything unrelated to the failure.
- Follow the Page Object Pattern: locators belong in page object files; assertions stay in test files.
- If the DOM tree is provided, use it to identify the correct selector, text, or structure that replaced what the test was looking for.
- Return ONLY valid JSON matching this exact schema — no markdown, no explanation outside JSON:

{
  "analysis": "<one sentence: what changed in the UI>",
  "fixes": [
    { "filePath": "<relative path>", "newContent": "<full corrected file content as a string>" }
  ]
}`;

  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('AI returned an empty response');

  return JSON.parse(content) as AiResponse;
}

/**
 * Applies AI-suggested fixes to disk.
 * Returns the list of relative file paths that were actually changed.
 * When multiple AI calls suggest fixes for the same file the last one wins
 * (they all target the same root cause, so they should be identical).
 */
function applyFixes(fixes: AiFix[]): string[] {
  // Deduplicate by filePath — last entry wins.
  const deduped = new Map<string, AiFix>();
  for (const fix of fixes) {
    deduped.set(fix.filePath, fix);
  }

  const changed: string[] = [];
  for (const [relativePath, fix] of deduped) {
    const absPath = path.resolve(process.cwd(), relativePath);
    if (!fs.existsSync(absPath)) {
      console.warn(`[heal] Skipping unknown file: ${relativePath}`);
      continue;
    }
    fs.writeFileSync(absPath, fix.newContent, 'utf-8');
    console.log(`[heal] Fixed: ${relativePath}`);
    changed.push(relativePath);
  }
  return changed;
}

// ─── Verification ───────────────────────────────────────────────────────────

/**
 * Re-runs only the previously-failing test files to confirm the fixes work.
 * Returns true when all targeted tests pass, false otherwise.
 */
function verifyFixes(testFiles: string[]): boolean {
  const unique = [...new Set(testFiles)];
  const fileArgs = unique.map((f) => `"${f}"`).join(' ');
  console.log(`\n[heal] Verifying fixes — running: ${unique.join(', ')}`);
  try {
    execSync(`npx playwright test ${fileArgs} --reporter=line`, { stdio: 'inherit' });
    console.log('[heal] Verification passed — all fixed tests are green.');
    return true;
  } catch {
    console.log('[heal] Verification failed — tests still failing, skipping commit.');
    return false;
  }
}

// ─── Git ──────────────────────────────────────────────────────────────────────

function exec(cmd: string): void {
  execSync(cmd, { stdio: 'inherit' });
}

function createHealBranch(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const branch = `fix/self-heal-${timestamp}`;
  exec(`git checkout -b ${branch}`);
  return branch;
}

function commitAndPush(changedFiles: string[], branch: string): boolean {
  const quoted = changedFiles.map((f) => `"${f}"`).join(' ');
  console.log(`[git] ${quoted} staged for commit`);
  exec(`git add ${quoted}`);

  // git diff --cached --quiet exits 0 when nothing is staged, 1 when there are staged changes.
  try {
    execSync('git diff --cached --quiet', { stdio: 'pipe' });
    console.log('[heal] No staged changes — files already match the committed state.');
    return false;
  } catch {
    // staged changes exist — proceed
  }

  exec(`git commit -m "fix(self-heal): auto-fix failing tests"`);
  exec(`git push origin ${branch}`);
  return true;
}

// ─── GitHub PR ────────────────────────────────────────────────────────────────

async function createPullRequest(branch: string, analyses: string[]): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;

  if (!token || !repo) {
    console.log('[heal] Skipping PR creation — GITHUB_TOKEN or GITHUB_REPOSITORY not set.');
    return;
  }

  const [owner, repoName] = repo.split('/');
  const body = [
    '## Self-Healing Fixes',
    '',
    'The following UI changes were detected and automatically fixed:',
    '',
    ...analyses.map((a, i) => `- **Fix ${i + 1}:** ${a}`),
    '',
    '_This PR was automatically generated by the self-healing layer. Please review the changes before merging._',
  ].join('\n');

  const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title: 'fix(self-heal): auto-fix failing tests',
      head: branch,
      base: BASE_BRANCH,
      body,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create PR (HTTP ${response.status}): ${errText}`);
  }

  const pr = (await response.json()) as { html_url: string; number: number };
  console.log(`[heal] PR #${pr.number} created: ${pr.html_url}`);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!fs.existsSync(FAILURES_PATH)) {
    console.log('[heal] No failures.json found — nothing to heal.');
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required.');
  }

  const contexts = JSON.parse(fs.readFileSync(FAILURES_PATH, 'utf-8')) as HealingContext[];

  if (contexts.length === 0) {
    console.log('[heal] failures.json is empty — nothing to heal.');
    return;
  }

  console.log(`[heal] Processing ${contexts.length} failure(s)…`);

  const allFixes: AiFix[] = [];
  const analyses: string[] = [];
  const failingTestFiles = contexts.map((ctx) => ctx.testFile);

  for (const ctx of contexts) {
    console.log(`\n[heal] Analysing: "${ctx.testTitle}"`);
    try {
      const result = await callAi(ctx);
      console.log(`[heal] AI analysis: ${result.analysis}`);
      allFixes.push(...result.fixes);
      analyses.push(result.analysis);
    } catch (err) {
      console.error(`[heal] AI call failed for "${ctx.testTitle}":`, err);
    }
  }

  if (allFixes.length === 0) {
    console.log('[heal] AI returned no fixes — no changes applied.');
    return;
  }

  const changedFiles = applyFixes(allFixes);
  if (changedFiles.length === 0) {
    console.log('[heal] No files were updated.');
    return;
  }

  if (!verifyFixes(failingTestFiles)) {
    return;
  }

  const branch = createHealBranch();
  const committed = commitAndPush(changedFiles, branch);
  if (!committed) {
    console.log('[heal] Nothing committed — skipping PR creation.');
    return;
  }
  await createPullRequest(branch, analyses);

  console.log('\n[heal] Done.');
}

main().catch((err) => {
  console.error('[heal] Fatal:', err);
  process.exit(1);
});
