import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

// Every date on the sites is written one way: "5 December 2026", "12–25 November 2026",
// "29 October – 11 November 2026" (Swedish "5 december 2026"). The dictionaries are left out: their English keys
// have to match whatever text is saved in the Site CMS.
const SRC = join(__dirname, '..');
const MONTH = 'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';
const SHORT = 'jan|feb|mar|apr|jun|jul|aug|sept?|oct|okt|nov|dec';
const WRONG: [string, RegExp][] = [
  ['month before the day', new RegExp(`\\b(?:${MONTH})\\.? \\d{1,2}(?:\\s*[–-]\\s*\\d{1,2})?\\b(?!\\d)`, 'i')],
  ['short month name', new RegExp(`\\b\\d{1,2}(?:\\s*[–-]\\s*\\d{1,2})? (?:${SHORT})\\b\\.?|\\b(?:${SHORT})\\s*[–-]\\s*(?:${SHORT})\\b`, 'i')],
  ['leading zero', new RegExp(`\\b0\\d (?:${MONTH})\\b`, 'i')],
];

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === 'translations' ? [] : files(path);
    return /\.(tsx?|json)$/.test(name) && !name.endsWith('.test.ts') ? [path] : [];
  });

describe('dates', () => {
  it('are written "5 December 2026" everywhere in the code', () => {
    const found: string[] = [];
    for (const file of files(SRC)) {
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        // Image file names ("WhatsApp Image 2026-09-09 …") and ISO dates are not shown as dates.
        const text = line.replace(/\d{4}-\d{2}-\d{2}/g, '');
        for (const [why, re] of WRONG) {
          const m = re.exec(text);
          if (m) found.push(`${relative(SRC, file)}:${i + 1} ${why}: "${m[0]}"`);
        }
      });
    }
    expect(found).toEqual([]);
  });
});
