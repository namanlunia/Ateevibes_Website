/**
 * Dependency-free typo-tolerant matching for the search bar and shop filters.
 *
 * Rules:
 * - Every keyword in the query must match at least one token in the target text.
 * - Short tokens (1-2 chars) only match exactly or as a prefix, so "xl" never fuzzily matches "xxl benches".
 * - Longer tokens tolerate typos: 1 edit at 3-4 chars, 2 edits at 5-8, 3 edits at 9+.
 * - Style codes (PNO numbers) are compared squashed (case/punctuation insensitive) so
 *   "pno1401", "PNO-1401" and "pno 1401" all match, and single-digit slips ("1404" -> "1401") still hit.
 */

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  let prev: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr: number[] = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
}

function maxEditDistance(length: number): number {
  if (length <= 2) return 0;
  if (length <= 4) return 1;
  if (length <= 8) return 2;
  return 3;
}

function tokenScore(queryToken: string, targetToken: string): number {
  if (queryToken === targetToken) return 1;
  if (queryToken.length >= 2 && targetToken.startsWith(queryToken)) return 0.9;
  if (targetToken.length >= 3 && queryToken.startsWith(targetToken)) return 0.85;

  const distance = levenshtein(queryToken, targetToken);
  if (distance === 0) return 1;
  if (distance > maxEditDistance(Math.min(queryToken.length, targetToken.length))) return 0;
  return Math.max(0.35, 0.8 * (1 - distance / Math.max(queryToken.length, targetToken.length)));
}

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Similarity of `query` inside `target` in [0,1]; 0 means "no match". */
export function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const normTarget = normalizeText(target);
  if (!normTarget) return 0;
  const normQuery = normalizeText(query);
  if (!normQuery) return 0;

  if (normTarget.includes(normQuery)) return 1;

  const queryTokens = normQuery.split(' ');
  const targetTokens = normTarget.split(' ');
  let weakestToken = 1;
  for (const queryToken of queryTokens) {
    let best = 0;
    for (const targetToken of targetTokens) {
      best = Math.max(best, tokenScore(queryToken, targetToken));
      if (best === 1) break;
    }
    if (best === 0) return 0;
    weakestToken = Math.min(weakestToken, best);
  }
  return weakestToken;
}

const squashCode = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Similarity of `query` against a style code like "PNO-1401" in [0,1]; 0 means "no match". */
export function styleCodeScore(query: string, styleCode: string): number {
  const q = squashCode(query);
  const code = squashCode(styleCode);
  if (!q || !code) return 0;

  if (q === code) return 1;
  if (code.length >= 3 && (code.startsWith(q) || q.startsWith(code))) return 0.9;
  if (q.length >= 3 && code.includes(q)) return 0.85;

  if (q.length >= 5 && code.length >= 5) {
    const distance = levenshtein(q, code);
    const allowed = Math.max(1, Math.floor(q.length / 3));
    if (distance <= allowed) return 0.75;
  }
  return 0;
}

function relaxedTokenScore(queryToken: string, targetToken: string): number {
  const direct = tokenScore(queryToken, targetToken);
  if (direct > 0) return direct;
  const distance = levenshtein(queryToken, targetToken);
  const cap = maxEditDistance(Math.min(queryToken.length, targetToken.length)) + 1;
  if (distance > cap) return 0;
  return Math.max(0.25, 0.7 * (1 - distance / Math.max(queryToken.length, targetToken.length)));
}

function suggestScore(queryText: string, candidateText: string): number {
  const normCandidate = normalizeText(candidateText);
  if (!normCandidate) return 0;
  const normQuery = normalizeText(queryText);
  if (!normQuery) return 0;

  let weakest = 1;
  for (const queryToken of normQuery.split(' ')) {
    let best = 0;
    for (const candidateToken of normCandidate.split(' ')) {
      best = Math.max(best, relaxedTokenScore(queryToken, candidateToken));
      if (best === 1) break;
    }
    if (best === 0) return 0;
    weakest = Math.min(weakest, best);
  }
  return weakest;
}

/** Closest readable suggestion for an empty result state, or undefined when nothing is close. */
export function buildSuggestion(query: string, candidates: string[]): string | undefined {
  if (!normalizeText(query)) return undefined;

  let bestScore = 0;
  let best: string | undefined;
  for (const candidate of candidates) {
    const score = suggestScore(query, candidate);
    if (score > bestScore && score >= 0.25) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}
