import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

export interface FailureRecord {
  testTitle: string;
  /** Workspace-relative path to the test file (forward slashes). */
  testFile: string;
  testLine: number;
  errorMessage: string;
  errorStack: string;
  screenshotPath?: string;
  tracePath?: string;
  tags: string[];
}

class FailureReporter implements Reporter {
  private failures: FailureRecord[] = [];
  private readonly outputFile: string;

  constructor(options?: { outputFile?: string }) {
    this.outputFile = options?.outputFile ?? 'test-results/failures.json';
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'failed') return;

    const error = result.errors[0];
    const screenshot = result.attachments.find((a) => a.name === 'screenshot');
    const trace = result.attachments.find((a) => a.name === 'trace');

    this.failures.push({
      testTitle: test.title,
      testFile: path.relative(process.cwd(), test.location.file).replace(/\\/g, '/'),
      testLine: test.location.line,
      errorMessage: error?.message ?? '',
      errorStack: error?.stack ?? '',
      screenshotPath: screenshot?.path,
      tracePath: trace?.path,
      tags: test.tags,
    });
  }

  onEnd(): void {
    if (this.failures.length === 0) return;

    const dir = path.dirname(this.outputFile);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.outputFile, JSON.stringify(this.failures, null, 2));
    console.log(
      `\n[FailureReporter] ${this.failures.length} failure(s) written to ${this.outputFile}`
    );
  }
}

export default FailureReporter;
