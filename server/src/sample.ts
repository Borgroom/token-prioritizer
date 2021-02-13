const { Octokit } = require("@octokit/rest");
const getIssues = require('./getIssues');
const getWeightFor = require('./getWeightFor');
const proposeOrderFor = require('./proposeOrderFor');
const config = require('./config.json');
const { auth, owner, repo } = config;

const octokit = new Octokit({
  auth: auth,
});

/**
type Issues = { [id:number]: Issue };
interface Issue {
  number:number;
  title:string;
  blockers:number[];
}
interface WeightedIssue extends Issue {
  weight:number; // from 0 to 100
}
**/

getIssues({ octokit, owner, repo })
.catch(console.error)
.then((issues) => {
  console.log('issues got', issues);
  return getWeightFor(issues);
})
.then((weightedIssues) => {
  console.log('got weights', weightedIssues);
  const order = proposeOrderFor({ issues: weightedIssues, timeframe: 5 });
  console.log('proposed order', order);
});

