import { VinFromFragments } from './vin';

// All vins are randomly generated from https://www.randomvinbarcode.com
describe('vin helpers', () => {
  class TestVinFromFragments extends VinFromFragments {
    public testBuildOverlapGraph(strings: string[]): Record<number, number[]> {
      return this.buildOverlapGraph(strings);
    }
    public testFindAllMaximalPaths(graph: Record<number, number[]>): number[][] {
      return this.findAllMaximalPaths(graph);
    }
    public testFilterMaximalPaths(paths: number[][]): number[][] {
      return this.filterMaximalPaths(paths);
    }
    public testMergePath(strings: string[], path: number[]): string {
      return this.mergePath(strings, path);
    }
    public testSplitLongFragments(strings: string[]): string[] {
      return this.splitLongFragments(strings);
    }
    public testBestOverlapOffset(a: string, b: string): number | null {
      return this.bestOverlapOffset(a, b);
    }
    public testComputeOffsets(strings: string[]): number[] {
      return this.computeOffsets(strings);
    }
    public testBuildMatrix(strings: string[], offsets: number[]): string[][] {
      return this.buildMatrix(strings, offsets);
    }
    public testColumnConsensus(matrix: string[][]): string[][] {
      return this.columnConsensus(matrix);
    }
    public testAllCombinations<T>(arrays: T[][]): T[][] {
      return this.allCombinations(arrays);
    }
    public getFragments(): { collectedAt: number; fragment: string }[] {
      return this.fragments;
    }
    public resetFragments(): void {
      while (this.fragments.length > 0) {
        this.fragments.shift();
      }
    }
  }

  test('normalizeForVin', () => {
    expect(VinFromFragments.normalizeForVin('abcdef')).toBe('ABCDEF');
    expect(VinFromFragments.normalizeForVin('012345')).toBe('012345');
    expect(VinFromFragments.normalizeForVin('ABCDEF')).toBe('ABCDEF');
    expect(VinFromFragments.normalizeForVin('!@#$%^&')).toBe('');
    expect(VinFromFragments.normalizeForVin('OQI')).toBe('001');
    expect(VinFromFragments.normalizeForVin('oqi')).toBe('001');
    expect(VinFromFragments.normalizeForVin('A1B2C3-O-4-Q-5-I-6')).toBe('A1B2C3040516');
  });

  test('isValidVin', () => {
    expect(VinFromFragments.isValidVin('1G6DV5EP6C0604780')).toBe(true);
    expect(VinFromFragments.isValidVin('WAUHF78P36A749631')).toBe(true);
    expect(VinFromFragments.isValidVin('1C4AJWAG1FL808591')).toBe(true);
    expect(VinFromFragments.isValidVin('WBANU5C50AC432843')).toBe(true);
    expect(VinFromFragments.isValidVin('JM1CW2BLXF0624377')).toBe(true);

    expect(VinFromFragments.isValidVin('1HGCM82633A12345')).toBe(false); // Too short
    expect(VinFromFragments.isValidVin('JH4KA9650MC0123456')).toBe(false); // Too long
    expect(VinFromFragments.isValidVin('1FTFW1EF1EKE1234I')).toBe(false); // Invalid character 'I'
    expect(VinFromFragments.isValidVin('2C3KA53G76H12345O')).toBe(false); // Invalid character 'O'
    expect(VinFromFragments.isValidVin('1HGCM82633A123457')).toBe(false); // Invalid check digit
  });

  test('addFragment', () => {
    const tester = new TestVinFromFragments();

    let mockDate = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    tester.addFragment('ABCDEF');
    tester.addFragment('GHIJKL');

    expect(tester.getFragments().length).toBe(2);
    expect(tester.getFragments()[0]).toEqual({ collectedAt: mockDate, fragment: 'ABCDEF' });
    expect(tester.getFragments()[1]).toEqual({ collectedAt: mockDate, fragment: 'GH1JKL' });

    // Adding a short fragment should be ignored
    tester.addFragment('AB');
    expect(tester.getFragments().length).toBe(2);

    mockDate = Date.now() + VinFromFragments.COLLECTION_WINDOW_MAX + 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    tester.addFragment('MNOPQR');
    // The old fragments should be purged due to time window
    expect(tester.getFragments().length).toBe(1);
    expect(tester.getFragments()[0]).toEqual({ collectedAt: mockDate, fragment: 'MN0P0R' });
  });

  test('buildOverlapGraph', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testBuildOverlapGraph([])).toEqual({});
    expect(tester.testBuildOverlapGraph(['ABC'])).toEqual({ 0: [] });
    expect(tester.testBuildOverlapGraph(['123456', '56789'])).toEqual({ 0: [1], 1: [] });
    expect(tester.testBuildOverlapGraph(['ABC', 'DEF', 'GHI'])).toEqual({ 0: [], 1: [], 2: [] });
    expect(tester.testBuildOverlapGraph(['ABCDE', 'CDEFG', 'EFGHI', '123456'])).toEqual({ 0: [1], 1: [2], 2: [], 3: [] });
    expect(tester.testBuildOverlapGraph(['ABCDEF', 'EF123', 'EFGHI'])).toEqual({ 0: [1, 2], 1: [], 2: [] });
  });

  test('findAllMaximalPaths', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testFindAllMaximalPaths({})).toEqual([]);
    expect(tester.testFindAllMaximalPaths({ 0: [] })).toEqual([[0]]);
    expect(tester.testFindAllMaximalPaths({ 0: [1], 1: [] })).toEqual([[0, 1], [1]]);
    expect(tester.testFindAllMaximalPaths({ 0: [1], 1: [2], 2: [] })).toEqual([[0, 1, 2], [1, 2], [2]]);
    expect(tester.testFindAllMaximalPaths({ 0: [1, 2], 1: [], 2: [] })).toEqual([[0, 1], [0, 2], [1], [2]]);
    expect(tester.testFindAllMaximalPaths({ 0: [1], 1: [2], 2: [], 3: [] })).toEqual([[0, 1, 2], [1, 2], [2], [3]]);
    expect(tester.testFindAllMaximalPaths({ 0: [1], 1: [0] })).toEqual([[0, 1], [1, 0]]);
  });

  test('filterMaximalPaths', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testFilterMaximalPaths([[0]])).toEqual([[0]]);
    expect(tester.testFilterMaximalPaths([[0, 1], [1]])).toEqual([[0, 1]]);
    expect(tester.testFilterMaximalPaths([[0, 1, 2], [1, 2], [2]])).toEqual([[0, 1, 2]]);
    expect(tester.testFilterMaximalPaths([[0, 1], [0, 2], [1], [2]])).toEqual([[0, 1], [0, 2]]);
    expect(tester.testFilterMaximalPaths([[0, 1, 2], [1, 2], [2], [3]])).toEqual([[0, 1, 2], [3]]);
  });

  test('mergePath', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testMergePath(['ABCDEFG', 'EFGHIJ', 'HIJKLMN'], [0, 1, 2])).toBe('ABCDEFGHIJKLMN');
    expect(tester.testMergePath(['123456', '456789', '7890'], [0, 1, 2])).toBe('1234567890');
    expect(tester.testMergePath(['AAAAAA', 'AAABBB', 'BBCCCC'], [0, 1, 2])).toBe('AAAAAABBBCCCC');
    expect(tester.testMergePath(['XYZ', 'YZA', 'ZAB'], [0, 1, 2])).toBe('XYZAB');
    expect(tester.testMergePath(['12345', '34567', '56789'], [1, 2])).toBe('3456789');
  });

  test('splitLongFragments', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testSplitLongFragments([''])).toEqual(['']);
    expect(tester.testSplitLongFragments(['12345678901234567'])).toEqual(['12345678901234567']);
    expect(tester.testSplitLongFragments(['', '12345678901234567'])).toEqual(['', '12345678901234567']);
    expect(tester.testSplitLongFragments(['123456789012345678'])).toEqual(['12345678901234567', '23456789012345678']);
  });

  test('bestOverlapOffset', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testBestOverlapOffset('ABCDEFG', 'EFGHIJ')).toBe(4);
    expect(tester.testBestOverlapOffset('EFGHIJ', 'ABCDEFG')).toBe(-4);
    expect(tester.testBestOverlapOffset('1234567', '456789')).toBe(3);
    expect(tester.testBestOverlapOffset('AAAAAA', 'AAABBB')).toBe(0);
    expect(tester.testBestOverlapOffset('XYZ', 'YZA')).toBe(1);
    expect(tester.testBestOverlapOffset('12345', '54321')).toBeNull();
  });

  test('computeOffsets', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testComputeOffsets(['ABCDEFG', 'EFGHIJ', 'HIJKLMN'])).toEqual([0, 4, 7]);
    expect(tester.testComputeOffsets(['ABCDEFG', 'EFGHIJ', 'HIJKLMN'])).toEqual([0, 4, 7]);
    expect(tester.testComputeOffsets(['123456', '456789', '7890'])).toEqual([0, 3, 6]);
    expect(tester.testComputeOffsets(['AAAAAA', 'AAABBB', 'BBCCCC'])).toEqual([0, 0, 3]);
    expect(tester.testComputeOffsets(['XYZ', 'YZA', 'ZAB'])).toEqual([0, 1, 2]);
    expect(tester.testComputeOffsets(['12345', '34567', '56789'])).toEqual([0, 2, 4]);
    expect(tester.testComputeOffsets(['ABCDEF', '1DEFGHI', 'CDEFGH'])).toEqual([0, 2, 2]);
  });

  test('buildMatrix', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testBuildMatrix(['ABC', 'CDE', 'EFG'], [0, 2, 4])).toEqual([
      ['A', 'B', 'C', ' ', ' ', ' ', ' '],
      [' ', ' ', 'C', 'D', 'E', ' ', ' '],
      [' ', ' ', ' ', ' ', 'E', 'F', 'G'],
    ]);
    expect(tester.testBuildMatrix(['12345', '34567', '56789'], [0, 2, 4])).toEqual([
      ['1', '2', '3', '4', '5', ' ', ' ', ' ', ' '],
      [' ', ' ', '3', '4', '5', '6', '7', ' ', ' '],
      [' ', ' ', ' ', ' ', '5', '6', '7', '8', '9'],
    ]);
  });

  test('columnConsensus', () => {
    const tester = new TestVinFromFragments();

    expect(tester.testColumnConsensus([
      ['A', 'B', 'C', ' ', ' ', ' ', ' '],
      [' ', ' ', 'C', 'D', 'E', ' ', ' '],
      [' ', ' ', ' ', ' ', 'E', 'F', 'G'],
    ])).toEqual([
      ['A'], ['B'], ['C'], ['D'], ['E'], ['F'], ['G'],
    ]);
    expect(tester.testColumnConsensus([
      ['1', '2', '3', '4', '5', ' ', ' ', ' ', ' '],
      [' ', ' ', '3', '4', '5', '6', '7', ' ', ' '],
      [' ', ' ', ' ', ' ', '5', '6', '7', '8', '9'],
    ])).toEqual([
      ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'],
    ]);
    expect(tester.testColumnConsensus([
      ['A', 'B', ' ', 'D'],
      ['A', 'A', 'C', 'D'],
    ])).toEqual([
      ['A'], ['B', 'A'], ['C'], ['D'],
    ]);
  });

  test('allCombinations', () => {
    const tester = new TestVinFromFragments();
    const tests = [
      { test: [['X'], ['Y'], ['Z']], res: [['X', 'Y', 'Z']] },
      {
        test: [['A', 'B'], ['C']],
        res: [
          ['A', 'C'],
          ['B', 'C'],
        ],
      },
      {
        test: [
          ['A', 'B', 'C'],
          ['1', '2'],
        ],
        res: [
          ['A', '1'],
          ['A', '2'],
          ['B', '1'],
          ['B', '2'],
          ['C', '1'],
          ['C', '2'],
        ],
      },
      {
        test: [
          ['1', '2'],
          ['A', 'B'],
          ['X', 'Y'],
        ],
        res: [
          ['1', 'A', 'X'],
          ['1', 'A', 'Y'],
          ['1', 'B', 'X'],
          ['1', 'B', 'Y'],
          ['2', 'A', 'X'],
          ['2', 'A', 'Y'],
          ['2', 'B', 'X'],
          ['2', 'B', 'Y'],
        ],
      },
    ];

    for (const { test, res } of tests) {
      expect(tester.testAllCombinations(test)).toEqual(res);
    }
  });

  test('getVin and addFragment', () => {
    const tester = new TestVinFromFragments();

    expect(tester.getVin()).toBeNull();

    tester.addFragment('DZZZ5D');
    tester.addFragment('1C3CDZ');
    tester.addFragment('1C3CDZAB5D');
    tester.addFragment('AB5DN662');
    tester.addFragment('662224');
    tester.addFragment('224');

    expect(tester.getVin()).toBe('1C3CDZAB5DN662224');
    tester.resetFragments();

    tester.addFragment('1WBAYP9C58FD027942');
    expect(tester.getVin()).toBe('WBAYP9C58FD027942');
    tester.resetFragments();

    tester.addFragment('WAUUFAFH2');
    tester.addFragment('WAUUFAFH2');
    tester.addFragment('2AN344157');
    tester.addFragment('2AN344157');
    expect(tester.getVin()).toBeNull();
    tester.addFragment('FAFH21');
    tester.addFragment('FAFH2A1');
    expect(tester.getVin()).toBe('WAUUFAFH2AN344157');
    tester.resetFragments();

    tester.addFragment('1GD022CG3CZ');
    tester.addFragment('CG3CZ819353');
    expect(tester.getVin()).toBe('1GD022CG3CZ819353');
    tester.resetFragments();

    tester.addFragment('01234567X90123456');
    expect(tester.getVin()).toBeNull();
    tester.resetFragments();

    tester.addFragment('FAKEWAUAH74F88');
    tester.addFragment('F88N699121');
    expect(tester.getVin()).toBe('WAUAH74F88N699121');
    tester.resetFragments();
  });
});
