import { describe, expect, it } from 'vitest';
import { buildSuggestion, fuzzyScore, styleCodeScore } from '../fuzzy';

describe('fuzzyScore', () => {
  it('matches exact keywords case-insensitively', () => {
    expect(fuzzyScore('China Jacquard', 'China Jacquard Tee')).toBe(1);
    expect(fuzzyScore('POLO', 'Classic Polo Tee')).toBeGreaterThanOrEqual(0.9);
  });

  it('matches phrase substrings and multi-token queries', () => {
    expect(fuzzyScore('jacquard', 'China Jacquard Tee')).toBe(1);
    expect(fuzzyScore('red polo', 'Polo Round Neck in Red')).toBeGreaterThan(0);
  });

  it('tolerates single-letter typos', () => {
    expect(fuzzyScore('wafle', 'Waffle Weave Tee')).toBeGreaterThan(0);
    expect(fuzzyScore('jacquardred', 'Jacquard Red')).toBeGreaterThan(0);
  });

  it('tolerates transposed letters in longer words', () => {
    expect(fuzzyScore('jaqcuard', 'China Jacquard Tee')).toBeGreaterThan(0);
  });

  it('matches partial prefixes while typing', () => {
    expect(fuzzyScore('wa', 'Waffle Henley')).toBeGreaterThan(0);
    expect(fuzzyScore('poloshirt', 'Classic Polo')).toBeGreaterThan(0);
  });

  it('requires every keyword to match something', () => {
    expect(fuzzyScore('waffle polo', 'Waffle Weave Tee')).toBe(0);
  });

  it('rejects unrelated words and 1-2 char nonsense tokens', () => {
    expect(fuzzyScore('sneakers', 'Waffle Weave Tee')).toBe(0);
    expect(fuzzyScore('xg', 'Regular Fit XL')).toBe(0);
    expect(fuzzyScore('xxl', 'Oversized XXL Tee')).toBeGreaterThan(0);
  });

  it('always returns a score between 0 and 1', () => {
    expect(fuzzyScore('', 'anything')).toBe(0);
    expect(fuzzyScore('jacquard', '')).toBe(0);
    const score = fuzzyScore('jaqcuard redx', 'Jacquard Red');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

describe('styleCodeScore', () => {
  it('matches exact style codes ignoring case and punctuation', () => {
    expect(styleCodeScore('PNO-1401', 'pno-1401')).toBe(1);
    expect(styleCodeScore('pno 1401', 'PNO-1401')).toBe(1);
  });

  it('matches partial style codes while typing', () => {
    expect(styleCodeScore('pno14', 'PNO-1401')).toBeGreaterThan(0);
    expect(styleCodeScore('1401', 'pno-1401')).toBeGreaterThan(0);
  });

  it('tolerates a single-digit slip in the style code', () => {
    expect(styleCodeScore('pno-1240', 'pno-1401')).toBeGreaterThan(0);
  });

  it('rejects style codes that are too far away', () => {
    expect(styleCodeScore('pno-9999', 'pno-1401')).toBe(0);
    expect(styleCodeScore('nothing', 'pno-1401')).toBe(0);
  });
});

describe('buildSuggestion', () => {
  it('suggests the closest candidate for a badly misspelt query', () => {
    const candidates = ['China Jacquard Tee', 'Waffle Henley', 'Mattie Polo'];
    expect(buildSuggestion('chiina jaqubard', candidates)).toBe('China Jacquard Tee');
    expect(buildSuggestion('matty polo', candidates)).toBe('Mattie Polo');
  });

  it('returns undefined for empty queries or hopeless candidates', () => {
    expect(buildSuggestion('', ['Jacquard Tee'])).toBeUndefined();
    expect(buildSuggestion('sneakers', ['Jacquard Tee', 'Waffle Henley'])).toBeUndefined();
  });
});
