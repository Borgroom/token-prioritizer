import proposeOrderFor, { Order, Track } from './proposeOrderFor';

describe('Test', () => {
  it('makes a basic choice', () => {

    /**
     *          2
     *    1 <
     *          3
     */

    const issues: WeightedIssues = {
      1: {
        number: 1,
        title: 'foo',
        weight: 0,
        size: 5,
        blockers: [],
      },
      2: {
        number: 2,
        title: 'bar',
        weight: 5,
        size: 5,
        blockers: [1]
      },
      3: {
        number: 3,
        title: 'baz',
        weight: 10,
        size: 5,
        blockers: [1]
      },
    }

    const result = proposeOrderFor({
      issues,
      timeframe: 10,
      tracks: 1,
    });

    // Only one solution
    expect(result.length).toEqual(1);

    // The one solution has one track
    expect(result[0].length).toEqual(1);

    const track = result[0];
    // The one track has two steps
    expect(track[0].length).toEqual(2);

    const order = track[0];
    // Those two steps are 1 and then 3, since 3 is the highest weight.
    expect(order[0].number).toEqual(1);
    expect(order[1].number).toEqual(3);
  });
});

describe('Test', () => {
  it('proposes ties', () => {

    /**
     *          2
     *    1 <
     *          3
     */

    const issues: WeightedIssues = {
      1: {
        number: 1,
        title: 'foo',
        weight: 0,
        size: 5,
        blockers: [],
      },
      2: {
        number: 2,
        title: 'bar',
        weight: 5,
        size: 5,
        blockers: [1]
      },
      3: {
        number: 3,
        title: 'baz',
        weight: 5,
        size: 5,
        blockers: [1]
      },
    }

    const result = proposeOrderFor({
      issues,
      timeframe: 10,
      tracks: 1,
    });

    // Has two valid solutions
    expect(result.length).toEqual(2);

    // Each solution has one track
    expect(result[0].length).toEqual(1);
    expect(result[1].length).toEqual(1);

    // Both solutions start with issue 1
    expect(result[0][0][0].number).toEqual(1);
    expect(result[1][0][0].number).toEqual(1);

    // One solution should end with 2, the other with 3.
    const solution1 = result[0][0][1].number;
    const solution2 = result[1][0][1].number;

    if (solution1 === 2) {
      expect(solution2).toEqual(3);
    } else {
      expect(solution2).toEqual(2);
      expect(solution1).toEqual(3);
    }

  });
});

describe('Test', () => {
  it('manages multiple work tracks', () => {

    /**
     *             5
     *    4 ---- <
     *             2
     *    1 - <
     *           3
     */

    const issues: WeightedIssues = {
      1: {
        number: 1,
        title: 'foo',
        weight: 0,
        size: 1,
        blockers: [],
      },
      2: {
        number: 2,
        title: 'bar',
        weight: 10,
        size: 5,
        blockers: [1, 4]
      },
      3: {
        number: 3,
        title: 'baz',
        weight: 5,
        size: 5,
        blockers: [1]
      },
      4: {
        number: 4,
        title: 'bam',
        weight: 0,
        size: 5,
        blockers: []
      },
      5: {
        number: 5,
        title: 'boo',
        weight: 10,
        size: 5,
        blockers: [4]
      }
    }

    const result = proposeOrderFor({
      issues,
      timeframe: 10,
      tracks: 2,
    });

    // Two valid solutions
    expect(result.length).toEqual(2);

    // The solution has two tracks
    expect(result[0].length).toEqual(2);

    const solution = new Set([
      [4, 5],
      [1,2],
    ]);

    expect(checkSolution(result[0], solution)).toEqual(true);
  });
});

function checkSolution(proposed: Order, solution: Set<number[]>): boolean {

  // Check if this order matches this proposed solution, order independent:
  const matches: { [proposedKey:number]: number } = {};

  const proposalSet = convertProposalToSet(proposed);

  for (const track in proposalSet) {
    let foundMatch = false;

    for (const solutionTrack in solution) {
      for (let i = 0; i < track.length; i++) {
        if (track[i] !== solutionTrack[i]) {
          break
        }
        if (i === track.length + 1) {
          foundMatch = true;
          break
        }
      }
    }

    if (!foundMatch) {
      return false;
    }
  }

  return true;
}

function convertProposalToSet(proposed: Order): Set<Track> {
  const result: Set<Track> = new Set();
  proposed.forEach((track) => {
    result.add(track);
  })
  return result;
}
