type Orders = Order[];
type Order = Track[];
type Track = WeightedIssue[];

module.exports = function proposeOrderFor ({ issues, timeframe, tracks }: {
  issues: WeightedIssues,
  timeframe: number, // Quantity of "story point" time to try to optimize within.
  tracks: number, // Number of parallel work streams
}): Orders {

  const unblocked = {};

  for(const key in issues) {
    const issue = issues[key];
    if (issue.blockers.length === 0) {
      unblocked[issue.number] = issue;
    }
  }

  return [];
}
