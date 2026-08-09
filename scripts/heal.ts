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
import logger from '../src/helpers/logger';
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
A test has failed. There are four possible root causes — identify which applies and fix it:

1. **UI changed**: A locator, test-id, or visible text no longer matches because the app was updated.
2. **Test typo**: A wrong or garbled string in the test file (e.g. \`'UserwqefTEs Login'\`) that doesn't match what the DOM actually shows.
3. **Wrong assertion logic**: The \`expect()\` matcher or \`.not\` negation is incorrect given what the page actually shows.
4. **PageObject locator typo**: A locator in a page object is wrong (bad selector, wrong \`data-testid\`, etc.) even though the element exists in the DOM. Fix the locator in the page object only — do NOT touch the test file.

Your task: identify the root cause and return the corrected TypeScript source for the affected file(s).

${domTreeSection}

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

## Rules
- CRITICAL: When fixing a file (especially POM file e.g. login.page.ts), preserve its ENTIRE existing structure! — all imports, class inheritance (e.g. \`extends BasePage\`), constructor parameters, class properties, methods, and any unrelated locators or logic. ONLY change the single broken locator string or value. Do NOT rewrite, simplify, or restructure the file in any way. The \`newContent\` must be a minimally-diffed version of the original source with only the failing locator or value corrected.
- Do not recommend to run tests again. Only provide code fixes.
- Fix locators, text values, or selectors directly related to the reported error — whether the mismatch is caused by a UI change, a typo in the test, or a bad locator in a page object.
- If the DOM tree is provided, treat the text/structure found in the DOM as the ground truth and update the test or page object to match it.
- If expected text in the test looks garbled or nonsensical (e.g. random characters mixed in), treat it as a test typo and replace it with the actual value from the DOM.
- If the assertion logic is incorrect (e.g. \`.not.toBeVisible()\` when the element is actually visible, or a wrong matcher like \`.toBeHidden()\` instead of \`.toBeVisible()\`), correct the matcher or remove/add the \`.not\` negation to reflect what the page actually shows.
- If a locator in a page object file does not match any element in the DOM tree but the element clearly exists (e.g. the error is "locator not found" or "strict mode violation" and the DOM shows the element), treat it as a PageObject locator typo. Fix only the locator string in the page object file; do NOT touch the test file.
- When fixing a locator, prefer the most stable selector available in the DOM: \`data-testid\` > ARIA role > visible label/text > CSS class. Do not invent selectors that are not present in the DOM tree.
- Do NOT change test logic, add comments, or refactor anything unrelated to the failure.
- Follow the Page Object Pattern: locators belong in page object files; assertions stay in test files.
- Return ONLY valid JSON matching this exact schema — no markdown, no explanation outside JSON:

{
  "analysis": "<one sentence: what the root cause was — UI change, test typo, or wrong assertion logic — and what was corrected>",
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

function applyFixes(fixes: AiFix[]): string[] {
  // Deduplicate by filePath - last entry wins.
  const deduped = new Map<string, AiFix>();
  for (const fix of fixes) {
    deduped.set(fix.filePath, fix);
  }

  const changed: string[] = [];
  for (const [relativePath, fix] of deduped) {
    const absPath = path.resolve(process.cwd(), relativePath);
    if (!fs.existsSync(absPath)) {
      logger.warn({ file: relativePath }, 'Skipping unknown file');
      continue;
    }
    fs.writeFileSync(absPath, fix.newContent, 'utf-8');
    logger.info({ file: relativePath }, 'Fixed');
    changed.push(relativePath);
  }
  return changed;
}

function lintFixes(changedFiles: string[]): boolean {
  const tsFiles = changedFiles.filter((f) => f.endsWith('.ts'));
  if (tsFiles.length === 0) return true;

  const fileArgs = tsFiles.map((f) => `"${f}"`).join(' ');
  logger.info({ files: tsFiles }, 'Linting fixed files');
  try {
    execSync(`npx eslint --fix ${fileArgs}`, { stdio: 'inherit' });
    logger.info('Lint passed');
    return true;
  } catch {
    logger.warn('Lint failed on fixed files - skipping commit');
    return false;
  }
}

function verifyFixes(testFiles: string[]): boolean {
  const unique = [...new Set(testFiles)];
  const fileArgs = unique.map((f) => `"${f}"`).join(' ');
  logger.info({ files: unique }, 'Verifying fixes');
  try {
    execSync(`npx playwright test ${fileArgs} --reporter=line`, { stdio: 'inherit' });
    logger.info('────────────────────────────────────────────────────────────');
    logger.info('Verification passed - all fixed tests are green!');
    logger.info('────────────────────────────────────────────────────────────');
    return true;
  } catch {
    logger.warn('Verification failed - tests still failing, skipping commit');
    return false;
  }
}

function exec(cmd: string): void {
  execSync(cmd, { stdio: 'inherit' });
}

function createHealBranch(): string {
  logger.info('Creating heal branch');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const branch = `fix/self-heal-${timestamp}`;
  exec(`git checkout -b ${branch}`);
  logger.info({ branch }, 'Heal branch created');
  return branch;
}

function commitAndPush(changedFiles: string[], branch: string): boolean {
  logger.info({ branch, files: changedFiles }, 'Committing and pushing changes');
  const quoted = changedFiles.map((f) => `"${f}"`).join(' ');
  logger.info({ files: changedFiles }, 'Staging files for commit');
  exec(`git add ${quoted}`);

  // git diff --cached --quiet exits 0 when nothing is staged, 1 when there are staged changes.
  try {
    execSync('git diff --cached --quiet', { stdio: 'pipe' });
    logger.info('No staged changes - files already match the committed state');
    return false;
  } catch {
    // staged changes exist - proceed
  }

  exec(`git commit -m "fix(self-heal): auto-fix failing tests"`);
  exec(`git push origin ${branch}`);
  return true;
}

async function createPullRequest(branch: string, analyses: string[]): Promise<void> {
  logger.info({ branch }, 'Changes pushed - creating pull request');
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;

  if (!token || !repo) {
    logger.warn('Skipping PR creation - GITHUB_TOKEN or GITHUB_REPOSITORY not set');
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
  logger.info({ prNumber: pr.number, url: pr.html_url }, 'PR created');
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!fs.existsSync(FAILURES_PATH)) {
    logger.info('No failures.json found - nothing to heal');
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required.');
  }

  const contexts = JSON.parse(fs.readFileSync(FAILURES_PATH, 'utf-8')) as HealingContext[];

  if (contexts.length === 0) {
    logger.info('failures.json is empty - nothing to heal');
    return;
  }

  const allFixes: AiFix[] = [];
  const analyses: string[] = [];
  const failingTestFiles = contexts.map((ctx) => ctx.testFile);
  let allAnalysesSucceeded = true;

  // In-memory cache tracking the latest patched content per file path.
  // Seeded from the snapshots in failures.json so the first AI call for each
  // file sees the same source that existed during the failing test run.
  const fileCache = new Map<string, string>();
  for (const ctx of contexts) {
    if (!fileCache.has(ctx.testFile)) fileCache.set(ctx.testFile, ctx.testSource);
    for (const po of ctx.pageObjects) {
      if (!fileCache.has(po.filePath)) fileCache.set(po.filePath, po.source);
    }
  }

  logger.info({ count: contexts.length }, 'Processing failures');
  for (const ctx of contexts) {
    logger.info({ test: ctx.testTitle }, 'Analyzing test');
    try {
      // Build a context that reflects any fixes already applied to this file
      // (or its page objects) by earlier iterations of this loop, so that
      // multiple failing tests in the same file are all repaired rather than
      // only the last one.
      const patchedCtx: HealingContext = {
        ...ctx,
        testSource: fileCache.get(ctx.testFile) ?? ctx.testSource,
        pageObjects: ctx.pageObjects.map((po) => ({
          ...po,
          source: fileCache.get(po.filePath) ?? po.source,
        })),
      };
      const result = await callAi(patchedCtx);
      logger.info({ analysis: result.analysis }, 'AI analysis complete');
      // Update the cache immediately so subsequent failures in the same file
      // receive the already-patched content as their context.
      for (const fix of result.fixes) {
        fileCache.set(fix.filePath, fix.newContent);
      }
      allFixes.push(...result.fixes);
      analyses.push(result.analysis);
    } catch (err) {
      logger.error({ test: ctx.testTitle, err }, 'AI call failed');
      allAnalysesSucceeded = false;
    }
  }

  if (!allAnalysesSucceeded) {
    logger.warn('Some AI analyses failed - skipping verification and commit');
    return;
  }

  if (allFixes.length === 0) {
    logger.warn('AI returned no fixes - no changes applied');
    return;
  }
  logger.info({ count: allFixes.length }, 'AI returned fixes - applying changes');

  const changedFiles = applyFixes(allFixes);
  if (changedFiles.length === 0) {
    logger.warn('No files were updated');
    return;
  }
  logger.info({ count: changedFiles.length, files: changedFiles }, 'Files updated successfully');
  for (const filePath of changedFiles) {
    const absPath = path.resolve(process.cwd(), filePath);
    const source = fs.readFileSync(absPath, 'utf-8');
    logger.info({ file: filePath }, 'Changed file source');
    process.stdout.write(source + '\n');
  }

  if (!lintFixes(changedFiles)) {
    return;
  }

  if (!verifyFixes(failingTestFiles)) {
    return;
  }

  const branch = createHealBranch();

  const committed = commitAndPush(changedFiles, branch);
  if (!committed) {
    logger.warn('Nothing committed - skipping PR creation');
    return;
  }

  await createPullRequest(branch, analyses);

  logger.info('────────────────────────────────────────────────────────────');
  logger.info('Self-healing process complete!');
  logger.info('────────────────────────────────────────────────────────────');
}

main().catch((err) => {
  logger.fatal({ err }, 'Fatal error');
  process.exit(1);
});
