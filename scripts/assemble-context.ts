/**
 * Reads test-results/failures.json and assembles a rich healing context for
 * each failure: the test source, all imported page-object sources, and the
 * raw error information. The result is consumed by heal.ts to build AI prompts.
 */
import fs from 'fs';
import path from 'path';
import type { FailureRecord } from '../src/reporters/failure-reporter';

export interface PageObjectSource {
  filePath: string;
  source: string;
}

export interface HealingContext {
  failure: FailureRecord;
  testSource: string;
  pageObjects: PageObjectSource[];
}

/**
 * Parses a TypeScript/JavaScript source file and returns the resolved absolute
 * paths of any local imports that live under a `pages` directory.
 */
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

/**
 * Reads failures.json from `failuresPath` and returns one HealingContext per
 * failure, each bundled with the relevant source files.
 */
export function assembleContexts(failuresPath: string): HealingContext[] {
  if (!fs.existsSync(failuresPath)) {
    throw new Error(`No failures file found at: ${failuresPath}`);
  }

  const failures: FailureRecord[] = JSON.parse(fs.readFileSync(failuresPath, 'utf-8'));

  return failures.map((failure) => {
    const testFilePath = path.resolve(process.cwd(), failure.testFile);
    const testSource = fs.readFileSync(testFilePath, 'utf-8');

    const pageObjectPaths = extractPageObjectPaths(testSource, testFilePath);
    const pageObjects: PageObjectSource[] = pageObjectPaths.map((absPath) => ({
      filePath: path.relative(process.cwd(), absPath).replace(/\\/g, '/'),
      source: fs.readFileSync(absPath, 'utf-8'),
    }));

    return { failure, testSource, pageObjects } as HealingContext;
  });
}
