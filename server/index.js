const { Octokit } = require("@octokit/rest");
const config = require('./config.json');
const { auth, owner, repo } = config;

const octokit = new Octokit({
  auth: auth,
});

/** interface Issue {
  number:number;
  title:string;
  blockers:number[];
}
**/

// console.log(getBlockersFor('Blocked by #1'))
loadIssues()
.catch(console.error)
.then(console.log);

async function loadIssues () {
  const issues = {};

  let finalPage = false;
  let page = 1;

  while (!finalPage) {
    console.log('requesting page ', page)
    const { data: nextPage } = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      page,
    })

    console.log(nextPage);
    console.log(`checking if ${nextPage.length} is less than 100`);
    if (nextPage.length < 100) {
      finalPage = true;
    }

    for (let i = 0; i < nextPage.length; i++) {
      const issue = nextPage[i];

      let size = 1;
      issue.labels.forEach((label) => {
        if (label.name.indexOf('size:') === 0) {
          size = parseInt(label.name.substr(5))
        }
      })

      console.dir(issue.labels[0])
      issues[issue.number] = {
        title: issue.title,
        number: issue.number,
        blockers: getBlockersFor(nextPage[i].body),
        size,
      }
    }
  }
  return issues;
}

function getBlockersFor (body) {
  console.log('get blockers for\n', body)
  console.log(body);
  let blockers = [];
  const lines = body.split('\n');
  lines.forEach((line) => {
    console.log(line.trim().toLowerCase().indexOf('blocked by '))
    if (line.trim().toLowerCase().indexOf('blocked by ') === 0) {
      console.log('detected!')
      const body = line.substr(11);
      const issues = body.split(',').map(i => i.trim().substr(1));
      console.dir(issues)
      blockers = issues;
    }
  })
  return blockers
}
