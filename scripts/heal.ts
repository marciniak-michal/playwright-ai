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
import type { HealingContext } from './assemble-context';
import { assembleContexts } from './assemble-context';

const FAILURES_PATH = 'test-results/failures.json';
const BACKUP_DIR = '.heal-backup';
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

  const domTreeSection = context.failure.domTree
    ? `## Page DOM Tree at Failure\n\`\`\`json\n${JSON.stringify(context.failure.domTree, null, 2)}\n\`\`\``
    : '';

  const prompt = `You are a Playwright test repair agent.
A test has failed, most likely because the UI changed (e.g. a locator selector, test-id, or visible text is now different).

Your task: identify what changed and return the corrected TypeScript source for the affected file(s).

## Failing Test: ${context.failure.testFile} (line ${context.failure.testLine})
\`\`\`typescript
${context.testSource}
\`\`\`

${pageObjectsSection}

## Error
\`\`\`
${context.failure.errorMessage}
${context.failure.errorStack}
${context.failure.errorLine}
\`\`\`

## DOM Tree at Failure
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

// ─── File patching ────────────────────────────────────────────────────────────

function backupFile(relativePath: string): void {
  const src = path.resolve(process.cwd(), relativePath);
  const dest = path.join(BACKUP_DIR, relativePath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
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
    backupFile(relativePath);
    fs.writeFileSync(absPath, fix.newContent, 'utf-8');
    console.log(`[heal] Fixed: ${relativePath}`);
    changed.push(relativePath);
  }
  return changed;
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

function commitAndPush(changedFiles: string[], branch: string): void {
  const quoted = changedFiles.map((f) => `"${f}"`).join(' ');
  exec(`git add ${quoted}`);
  exec(`git commit -m "fix(self-heal): auto-fix failing tests"`);
  exec(`git push origin ${branch}`);
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

  const contexts = assembleContexts(FAILURES_PATH);
  if (contexts.length === 0) {
    console.log('[heal] failures.json is empty — nothing to heal.');
    return;
  }

  console.log(`[heal] Processing ${contexts.length} failure(s)…`);

  const allFixes: AiFix[] = [];
  const analyses: string[] = [];

  for (const ctx of contexts) {
    console.log(`\n[heal] Analysing: "${ctx.failure.testTitle}"`);
    try {
      const result = await callAi(ctx);
      console.log(`[heal] AI analysis: ${result.analysis}`);
      allFixes.push(...result.fixes);
      analyses.push(result.analysis);
    } catch (err) {
      console.error(`[heal] AI call failed for "${ctx.failure.testTitle}":`, err);
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

  const branch = createHealBranch();
  commitAndPush(changedFiles, branch);
  await createPullRequest(branch, analyses);

  console.log('\n[heal] Done.');
}

main().catch((err) => {
  console.error('[heal] Fatal:', err);
  process.exit(1);
});
