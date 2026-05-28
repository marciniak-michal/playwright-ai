import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

export interface PageObjectSource {
  filePath: string;
  source: string;
}

export interface HealingContext {
  testTitle: string;
  /** Workspace-relative path to the test file (forward slashes). */
  testFile: string;
  testLine: number;
  errorMessage: string;
  errorLine: number;
  tags: string[];
  /** Simplified DOM tree of the page captured at the moment of failure. */
  domTree?: Record<string, unknown>;
  testSource: string;
  pageObjects: PageObjectSource[];
}

function extractPageObjectPaths(source: string, fromFile: string): string[] {
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  const dir = path.dirname(fromFile);
  const found = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(source)) !== null) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) continue;

    const candidates = [
      path.resolve(dir, specifier + '.ts'),
      path.resolve(dir, specifier, 'index.ts'),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && candidate.split(path.sep).includes('pages')) {
        found.add(candidate);
        break;
      }
    }
  }

  return [...found];
}

type FailureEntry = Omit<HealingContext, 'testSource' | 'pageObjects'>;

class FailureReporter implements Reporter {
  private failures: FailureEntry[] = [];
  private readonly outputFile: string;

  constructor(options?: { outputFile?: string }) {
    this.outputFile = options?.outputFile ?? 'test-results/failures.json';
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'failed' && result.status !== 'timedOut') return;

    const error = result.errors[0];
    const domTreeAttachment = result.attachments.find((a) => a.name === 'dom-tree');

    let domTree: Record<string, unknown> | undefined;
    if (domTreeAttachment) {
      try {
        const raw = domTreeAttachment.body
          ? domTreeAttachment.body.toString('utf-8')
          : domTreeAttachment.path
            ? fs.readFileSync(domTreeAttachment.path, 'utf-8')
            : undefined;
        if (raw) domTree = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        // Malformed attachment — skip
      }
    }

    this.failures.push({
      testTitle: test.title,
      testFile: path.relative(process.cwd(), test.location.file).replace(/\\/g, '/'),
      testLine: test.location.line,
      errorMessage: error?.message ?? '',
      errorLine: error?.location?.line ?? 0,
      tags: test.tags,
      domTree,
    });
  }

  onEnd(): void {
    if (this.failures.length === 0) return;

    const dir = path.dirname(this.outputFile);
    fs.mkdirSync(dir, { recursive: true });

    const contexts: HealingContext[] = this.failures.map((failure) => {
      const testFilePath = path.resolve(process.cwd(), failure.testFile);
      const testSource = fs.readFileSync(testFilePath, 'utf-8');

      const pageObjectPaths = extractPageObjectPaths(testSource, testFilePath);
      const pageObjects: PageObjectSource[] = pageObjectPaths.map((absPath) => ({
        filePath: path.relative(process.cwd(), absPath).replace(/\\/g, '/'),
        source: fs.readFileSync(absPath, 'utf-8'),
      }));

      return { ...failure, testSource, pageObjects } as HealingContext;
    });

    fs.writeFileSync(this.outputFile, JSON.stringify(contexts, null, 2));
  }
}

export default FailureReporter;
