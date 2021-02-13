type Issues = { [id:number]: Issue };
interface Issue {
  number:number;
  title:string;
  blockers:number[];
  size:number;
}

module.exports = async function getIssues ({ octokit, owner, repo }): Promise<Issues> {
  const issues = {};

  let finalPage = false;
  let page = 1;

  while (!finalPage) {
    const { data: nextPage } = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      page,
    })

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
  let blockers = [];
  const lines = body.split('\n');
  lines.forEach((line) => {
    if (line.trim().toLowerCase().indexOf('blocked by ') === 0) {
      const body = line.substr(11);
      const issues = body.split(',').map(i => i.trim().substr(1));
      blockers = issues;
    }
  })
  return blockers
}
