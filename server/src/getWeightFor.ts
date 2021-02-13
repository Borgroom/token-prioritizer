type WeightedIssues = { [id:number]: WeightedIssue };
interface WeightedIssue extends Issue {
  weight:number; // from 0 to 100
}
type timeframe = number; // quantity of "story points"

module.exports = async function (issues: Issues): Promise<WeightedIssues> {
  const weighted: WeightedIssues = {};

  //TODO: Actually retrieve weight from a meaningful source.
  for(const key in issues) {
    const issue = issues[key];
    const { number, title, blockers } = issue;
    weighted[issue.number] = {
      number, title, blockers,
      weight: 2,
    }
  }

  return weighted;
}
