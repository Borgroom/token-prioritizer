const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();

const owner = 'Borgroom';
const repo = 'token-prioritizer';

octokit.request('GET /repos/{owner}/{repo}/issues', {
  owner,
  repo
});

// Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
/*
octokit.repos
  .listForOrg({
    org: "Borgroom",
    type: "token-prioritizer",
  })
*/
  .then(({ data }) => {
    console.log(data);
  })
  .catch((reason) => {
    console.error(reason);
  })


  /*
octokit.issues.get({
  owner,
  repo,
  issue_number,
});
*/
