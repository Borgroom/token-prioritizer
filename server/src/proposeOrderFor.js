/**
type Issues = { [id:number]: Issue };
interface Issue {
  number:number;
  title:string;
  blockers:number[];
}
type WeightedIssues = { [id:number]: WeightedIssue };
interface WeightedIssue extends Issue {
  weight:number; // from 0 to 100
}
type timeframe = number; // quantity of "story points"
**/

module.exports = function proposeOrderFor ({ issues, timeframe }) {

  const unblocked = {};

  for(const key in issues) {
    const issue = issues[key];
    if (issue.length === 0) {
      unblocked[issue.number] = issue;
    }
  }

  return 'got this far'
}
