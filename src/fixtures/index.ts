import { test as base } from '@playwright/test';

const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'path', 'defs']);
const CAPTURED_ATTRS = ['id', 'class', 'data-testid', 'role', 'name', 'type', 'href'];
const MAX_DEPTH = 4;
const MAX_CHILDREN = 5;
const MAX_TEXT_LENGTH = 60;

/** Playwright auto-fixture that attaches a simplified DOM tree to every failing test. */
export const test = base.extend<{ _domCapture: void }>({
  _domCapture: [
    async ({ page }, use, testInfo) => {
      await use();

      if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
        try {
          const domTree = await page.evaluate(
            ({ skipTags, capturedAttrs, maxDepth, maxChildren, maxTextLength }) => {
              const skipTagSet = new Set(skipTags);

              interface DomNode {
                tag: string;
                [attr: string]: unknown;
                children?: DomNode[];
                text?: string;
              }

              function buildNode(el: Element, depth: number): DomNode | null {
                if (depth > maxDepth || skipTagSet.has(el.tagName.toLowerCase())) return null;

                const node: DomNode = { tag: el.tagName.toLowerCase() };

                for (const attr of capturedAttrs) {
                  const val = el.getAttribute(attr);
                  if (val?.trim()) node[attr] = val.trim();
                }

                const childNodes = Array.from(el.children)
                  .slice(0, maxChildren)
                  .map((child) => buildNode(child, depth + 1))
                  .filter((c): c is DomNode => c !== null);

                if (childNodes.length > 0) {
                  node.children = childNodes;
                } else {
                  const text = el.textContent?.trim();
                  if (text) node.text = text.slice(0, maxTextLength);
                }

                return node;
              }

              return document.body ? buildNode(document.body, 0) : null;
            },
            {
              skipTags: [...SKIP_TAGS],
              capturedAttrs: CAPTURED_ATTRS,
              maxDepth: MAX_DEPTH,
              maxChildren: MAX_CHILDREN,
              maxTextLength: MAX_TEXT_LENGTH,
            }
          );

          if (domTree) {
            await testInfo.attach('dom-tree', {
              body: JSON.stringify(domTree, null, 2),
              contentType: 'application/json',
            });
          }
        } catch {
          // Page may be closed or unreachable after a hard failure — skip silently.
        }
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
