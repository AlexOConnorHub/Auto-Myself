export class VinFromFragments {
  public static readonly FRAGMENT_LENGTH_MINIMUM = 3;
  public static readonly OVERLAP_MINIMUM = 2;
  public static readonly COLLECTION_WINDOW_MAX = 10000;
  public static readonly FUZZY_MATCH_RATIO = 0.5;
  public readonly fragments: { collectedAt: number; fragment: string }[] = [];

  /**
   * Removes non-VIN characters, converts to upper case
   * and replaces unused letters with visually similar digits.
   * @param vin
   * @returns
   */
  public static normalizeForVin(vin: string): string {
    return vin.toUpperCase().replaceAll(/[^A-Z0-9]/g, '')
      .replaceAll('I', '1').replaceAll('O', '0').replaceAll('Q', '0');
  }

  /**
   * Returns true if the string provided validates as a VIN according to ISO 3779.
   * @param vin string to check
   */
  public static isValidVin(vin: string): boolean {
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

  /**
   * Adds fragment to collection.
   * @param newFragment string
   */
  public addFragment(newFragment: string) {
    newFragment = VinFromFragments.normalizeForVin(newFragment);
    if (newFragment.length < VinFromFragments.FRAGMENT_LENGTH_MINIMUM) {
      return;
    }

    if (newFragment.length > 17) {
      for (let i = 0; i <= newFragment.length - 17; i++) {
        const potentialVin = newFragment.substring(i, i + 17);
        if (VinFromFragments.isValidVin(potentialVin)) {
          this.fragments.push({
            collectedAt: Date.now(),
            fragment: potentialVin,
          });
        }
      }
    } else {
      this.fragments.push({
        collectedAt: Date.now(),
        fragment: newFragment,
      });
    }

    // Remove old fragments
    while (this.fragments.length > 0 && this.fragments[0].collectedAt < Date.now() - VinFromFragments.COLLECTION_WINDOW_MAX) {
      this.fragments.shift();
    }
  }

  /**
   * Attempts to reconstruct VIN from collected fragments.
   * @returns
   */
  public getVin(): string | null {
    const strings = this.fragments.map(f => f.fragment).sort((a, b) => b.length - a.length);

    const graph = this.buildOverlapGraph(strings);
    const allPaths = this.findAllMaximalPaths(graph);
    const filteredPaths = this.filterMaximalPaths(allPaths);
    const merged = filteredPaths.map(path => this.mergePath(strings, path));
    const split = this.splitLongFragments(merged);

    const forMatrix: string[] = [];
    for (const candidate of split) {
      if (candidate.length === 17) {
        if (VinFromFragments.isValidVin(candidate)) {
          return candidate;
        }
      } else {
        forMatrix.push(candidate);
      }
    }

    if (forMatrix.length > 0) {
      const offsets = this.computeOffsets(forMatrix);
      const matrix = this.buildMatrix(forMatrix, offsets);
      const consensus = this.columnConsensus(matrix);
      const combined = this.allCombinations(consensus).map(chars => chars.join(''));

      for (const candidate of combined) {
        if (candidate.length === 17 && VinFromFragments.isValidVin(candidate)) {
          return candidate;
        }
      }
    }

    return null;
  }

  /**
   * **AI** Take array of strings and returns an object/graph where each key is the index of a string,
   * and the value is an array of indices of strings that can follow it based on character overlap.
   * @param strings
   * @returns
   */
  protected buildOverlapGraph(strings: string[]): Record<number, number[]> {
    const graph = {} as Record<number, number[]>;

    for (let i = 0; i < strings.length; i++) {
      graph[i] = [];
    }

    for (let i = 0; i < strings.length; i++) {
      for (let j = 0; j < strings.length; j++) {
        if (i === j) continue;

        const a = strings[i];
        const b = strings[j];

        const maxOverlap = Math.min(a.length, b.length);

        for (let k = VinFromFragments.OVERLAP_MINIMUM; k <= maxOverlap; k++) {
          if (a.slice(-k) === b.slice(0, k)) {
            graph[i].push(j);
            break;
          }
        }
      }
    }

    return graph;
  }

  /**
   * **AI** Given the output of buildOverlapGraph, finds all maximal paths through the graph
   * starting at each node.
   * @param graph
   * @returns
   */
  protected findAllMaximalPaths(graph: Record<number, number[]>): number[][] {
    const results: number[][] = [];

    const dfs = (node: number, path: number[], visited: Set<number>) => {
      const neighbors = graph[node];
      let extended = false;

      for (const next of neighbors) {
        if (visited.has(next)) continue;

        extended = true;
        visited.add(next);
        dfs(next, [...path, next], visited);
        visited.delete(next);
      }

      if (!extended) {
        results.push(path);
      }
    };

    for (const start of Object.keys(graph).map(Number)) {
      dfs(start, [start], new Set([start]));
    }

    return results;
  }

  /**
   * **AI** Removes paths that are sub-paths of other paths.
   * @param paths
   * @returns
   */
  protected filterMaximalPaths(paths: number[][]): number[][] {
    return paths.filter((path, i) => {
      return !paths.some((other, j) => {
        if (i === j) return false;
        if (other.length <= path.length) return false;

        // check if path is a suffix of other
        const offset = other.length - path.length;
        for (let k = 0; k < path.length; k++) {
          if (other[offset + k] !== path[k]) {
            return false;
          }
        }
        return true;
      });
    });
  }

  /**
   * **AI** Takes an array of strings and a path (array of indices), and
   * returns the string, merging along overlapping sections of the strings.
   * @param strings
   * @param path
   */
  protected mergePath(strings: string[], path: number[]): string {
    let result = strings[path[0]];

    for (let i = 1; i < path.length; i++) {
      const next = strings[path[i]];
      const maxOverlap = Math.min(result.length, next.length);

      let overlapLen = 0;

      for (let k = VinFromFragments.OVERLAP_MINIMUM; k <= maxOverlap; k++) {
        if (result.slice(-k) === next.slice(0, k)) {
          overlapLen = k;
        }
      }

      result += next.slice(overlapLen);
    }

    return result;
  }

  /**
   * If (merged?) fragments are longer than 17 characters, splits them into all possible 17-character substrings.
   * @param fragments
   * @returns
   */
  protected splitLongFragments(fragments: string[]): string[] {
    const result: string[] = [];
    for (const fragment of fragments) {
      if (fragment.length > 17) {
        for (let i = 0; i <= fragment.length - 17; i++) {
          result.push(fragment.substring(i, i + 17));
        }
      } else {
        result.push(fragment);
      }
    }
    return result;
  }

  /**
   * **AI** Finds the best overlap offset between two strings.
   * @param a
   * @param b
   * @returns
   */
  protected bestOverlapOffset(a: string, b: string): number | null {
    let bestOffset: number | null = null;
    let bestScore = 0;

    for (let offset = -b.length; offset <= a.length; offset++) {
      let matches = 0;
      let compared = 0;

      for (let i = 0; i < b.length; i++) {
        const ai = i + offset;
        if (ai < 0 || ai >= a.length) continue;

        compared++;
        if (a[ai] === b[i]) matches++;
      }

      if (matches >= VinFromFragments.OVERLAP_MINIMUM && matches / compared >= VinFromFragments.FUZZY_MATCH_RATIO) {
        if (matches > bestScore) {
          bestScore = matches;
          bestOffset = offset;
        }
      }
    }

    return bestOffset;
  }

  /**
   * **AI** Computes offsets for an array of strings based on their overlaps
   * to create a matrix where columns represent character positions.
   * @param strings
   * @returns
   */
  protected computeOffsets(strings: string[]): number[] {
    const offsets = new Array(strings.length).fill(null);
    offsets[0] = 0;

    let changed = true;
    while (changed) {
      changed = false;

      for (let i = 0; i < strings.length; i++) {
        for (let j = 0; j < strings.length; j++) {
          if (offsets[i] === null || offsets[j] !== null || i === j) continue;

          const rel = this.bestOverlapOffset(strings[i], strings[j]);
          if (rel !== null) {
            offsets[j] = offsets[i] + rel;
            changed = true;
          }
        }
      }
    }

    return offsets.map(o => o ?? 0);
  }

  /**
   * **AI** Builds a matrix of characters from strings and their offsets.
   * @param strings
   * @param offsets
   * @returns
   */
  protected buildMatrix(strings: string[], offsets: number[]): string[][] {
    const min = Math.min(...offsets);
    const max = Math.max(
      ...strings.map((s, i) => offsets[i] + s.length),
    );

    const width = max - min;
    const matrix: string[][] = [];
    for (let i = 0; i < strings.length; i++) {
      const row = new Array(width).fill(' ');
      const start = offsets[i] - min;

      for (let j = 0; j < strings[i].length; j++) {
        row[start + j] = strings[i][j];
      }

      matrix.push(row);
    }

    return matrix;
  }

  /**
   * **AI** Returns strings comprised of the most common
   * characters in each column of the matrix.
   * @param matrix
   * @returns
   */
  protected columnConsensus(matrix: string[][]): string[][] {
    const cols = matrix[0].length;
    const result: string[][] = [];

    for (let c = 0; c < cols; c++) {
      const counts: Record<string, number> = {};

      for (const element of matrix) {
        const ch = element[c];
        counts[ch] = (counts[ch] ?? 0) + 1;
      }
      delete counts[' '];

      let max = 0;
      for (const v of Object.values(counts)) {
        if (v > max) max = v;
      }

      const winners: string[] = [];
      for (const [ch, count] of Object.entries(counts)) {
        if (count === max) {
          winners.push(ch);
        }
      }

      result.push(winners);
    }

    return result;
  }

  /**
   * Given an array of arrays, returns all combinations (cartesian product).
   * https://stackoverflow.com/a/43053803
   * @param arrays
   * @returns
   */
  protected allCombinations<T>(arrays: T[][]): T[][] {
    return arrays.reduce(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]],
    );
  }
}
