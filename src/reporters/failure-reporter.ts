import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

export interface PageObjectSource {
  filePath: string;
  source: string;
}

export interface HealingContext {
  testTitle: string;
  testFile: string;
  testLine: number;
  errorMessage: string;
  errorLine: number;
  tags: string[];
  domTree?: Record<string, unknown>;
  testSource: string;
  pageObjects: PageObjectSource[];
}

function extractPageObjectPaths(source: string, fromFile: string): string[] {
  // Step 1: Detect which `pages.xxx` properties are used in the test
  const usedProps = new Set<string>();
  const propUsageRegex = /\bpages\.(\w+)/g;
  let m: RegExpExecArray | null;
  while ((m = propUsageRegex.exec(source)) !== null) {
    usedProps.add(m[1]);
  }

  // Step 2: Traverse imports transitively to locate pageFactory.ts
  let pageFactoryPath: string | undefined;
  const visited = new Set<string>();

  function walkImports(src: string, file: string): void {
    if (visited.has(file)) return;
    visited.add(file);

    const dir = path.dirname(file);
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(src)) !== null) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) continue;

      for (const candidate of [
        path.resolve(dir, specifier + '.ts'),
        path.resolve(dir, specifier, 'index.ts'),
      ]) {
        if (!fs.existsSync(candidate)) continue;

        if (path.basename(candidate, '.ts') === 'pageFactory') {
          pageFactoryPath ??= candidate;
        } else {
          walkImports(fs.readFileSync(candidate, 'utf-8'), candidate);
        }
        break;
      }
    }
  }

  walkImports(source, fromFile);

  // Step 3: If pageFactory found and pages.xxx usages detected, resolve only used PO files
  if (pageFactoryPath && usedProps.size > 0) {
    const factorySource = fs.readFileSync(pageFactoryPath, 'utf-8');
    const factoryDir = path.dirname(pageFactoryPath);

    // Map class name -> absolute file path from factory imports
    const classToFile = new Map<string, string>();
    const factoryImportRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
    while ((m = factoryImportRegex.exec(factorySource)) !== null) {
      const specifier = m[2];
      if (!specifier.startsWith('.')) continue;
      for (const candidate of [
        path.resolve(factoryDir, specifier + '.ts'),
        path.resolve(factoryDir, specifier, 'index.ts'),
      ]) {
        if (fs.existsSync(candidate)) {
          for (const cls of m[1].split(',').map((s) => s.trim())) {
            classToFile.set(cls, candidate);
          }
          break;
        }
      }
    }

    // Map getter name -> return type class name
    const getterToClass = new Map<string, string>();
    const getterRegex = /get\s+(\w+)\s*\(\s*\)\s*:\s*(\w+)/g;
    while ((m = getterRegex.exec(factorySource)) !== null) {
      getterToClass.set(m[1], m[2]);
    }

    // Return only file paths for actually used props
    const found: string[] = [];
    for (const prop of usedProps) {
      const cls = getterToClass.get(prop);
      if (!cls) continue;
      const filePath = classToFile.get(cls);
      if (filePath) found.push(filePath);
    }
    return found;
  }

  // Fallback: return page object files directly imported by the test
  const directFound = new Set<string>();
  const dir = path.dirname(fromFile);
  const directImportRegex = /from\s+['"]([^'"]+)['"]/g;
  while ((m = directImportRegex.exec(source)) !== null) {
    const specifier = m[1];
    if (!specifier.startsWith('.')) continue;
    for (const candidate of [
      path.resolve(dir, specifier + '.ts'),
      path.resolve(dir, specifier, 'index.ts'),
    ]) {
      if (fs.existsSync(candidate) && candidate.split(path.sep).includes('pages')) {
        directFound.add(candidate);
        break;
      }
    }
  }
  return [...directFound];
}

type FailureEntry = Omit<HealingContext, 'testSource' | 'pageObjects'>;

class FailureReporter implements Reporter {
  private failures = new Map<string, FailureEntry>();
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

    this.failures.set(test.id, {
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
    if (this.failures.size === 0) return;

    const dir = path.dirname(this.outputFile);
    fs.mkdirSync(dir, { recursive: true });

    const contexts: HealingContext[] = [...this.failures.values()].map((failure) => {
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
