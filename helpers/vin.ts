export const COLLECTION_WINDOW_MIN = 500;
export const COLLECTION_WINDOW_MAX = 3000;
export const PARTIAL_MATCH_MATRIX_THRESHOLD = 3;
export const PARTIAL_MATCH_POTENTIAL_THRESHOLD = 5;
export const CHARACTER_SET = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';

export const isValidVin = (vin: string): boolean => {
  if (vin.length !== 17) {
    return false;
  }

  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinRegex.test(vin.toUpperCase())) {
    return false;
  }

  const transliteration: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
  };
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < vin.length; i++) {
    sum += transliteration[vin[i].toUpperCase()] * weights[i];
  }

  const remainder = sum % 11 === 10 ? 'X' : (sum % 11).toString();
  if (vin[8].toUpperCase() !== remainder) {
    return false;
  }

  return true;
};

const vinFragments: {
  collectedAt: number;
  fragment: string;
}[] = [];

export const processScannedTextForVin = (newFragment: string) => {
  if (isValidVin(newFragment)) {
    return newFragment;
  }
  return '';


  let final = '';
  if (PARTIAL_MATCH_MATRIX_THRESHOLD <= newFragment.length) {
    if (newFragment.length < 17) {
      vinFragments.push({
        collectedAt: Date.now(),
        fragment: newFragment,
      });
    } else {
      for (let i = 0; i <= newFragment.length - 17; i++) {
        const potentialVin = newFragment.substring(i, i + 17);
        if (isValidVin(potentialVin)) {
          final = potentialVin;
          break;
        }
      }
    }
  }

  if (final.length !== 0) {
    return final;
  }

  while (vinFragments.length > 0 && (Date.now() - vinFragments[0].collectedAt) > COLLECTION_WINDOW_MAX) {
    vinFragments.shift();
  }

  final = assessVinFragment();
  return final;
};

export const assessVinFragment = (): string => {
  if (vinFragments.length === 0) {
    return;
  }

  if (Date.now() - vinFragments[0].collectedAt < COLLECTION_WINDOW_MIN) {
    return;
  }

  const fragments = vinFragments.map((frag) => frag.fragment).sort((a, b) => b.length - a.length);
  const longestString = fragments.shift();
  const padding = 17 - longestString.length;
  const matrix: number[][] = new Array<number[]>((padding * 2) + longestString.length).map(() => new Array<number>(CHARACTER_SET.length).fill(0));
  const cache: Record<string, number[]> = {
    [longestString]: [padding],
  };

  const longestPotentialVin = new Array<string>((padding * 2) + longestString.length);
  for (let i = 0; i < longestString.length; i++) {
    matrix[padding + i][CHARACTER_SET.indexOf(longestString[i])]++;
    longestPotentialVin[padding + i] = longestString[i];
  }

  for (const fragment of fragments) {
    const offsets: number[] = cache[fragment] || [];

    if (offsets.length === 0) {
      for (let i = 0; i < (longestPotentialVin.length - (fragment.length + 1)); i++) {
        let matchLength = 0;
        for (let j = 0; j < fragment.length; j++) {
          if (longestPotentialVin[i + j] === fragment[j]) {
            matchLength++;
          }
        }
        if (matchLength >= PARTIAL_MATCH_MATRIX_THRESHOLD) {
          offsets.push(i);
        }
        if (matchLength >= PARTIAL_MATCH_POTENTIAL_THRESHOLD) {
          for (let j = 0; j < fragment.length; j++) {
            longestPotentialVin[i + j] = fragment[j];
          }
        }
      }
    }

    for (const row of cache[fragment]) {
      for (let i = 0; i < fragment.length; i++) {
        matrix[row + i][CHARACTER_SET.indexOf(fragment[i])]++;
      }
    }
  }

  for (let i = 0; i < (longestPotentialVin.length - 17); i++) {
    const testVin = longestPotentialVin.slice(i, i + 17).map((char, index) => {
      if (char !== undefined) {
        return char;
      }
      const row = matrix[i + index];
      const maxCount = Math.max(...row);
      if (maxCount === 0) {
        return undefined;
      }
      const charIndex = row.indexOf(maxCount);
      return CHARACTER_SET[charIndex];
    }).join('');
    if (isValidVin(testVin)) {
      return testVin;
    }
  }
};
