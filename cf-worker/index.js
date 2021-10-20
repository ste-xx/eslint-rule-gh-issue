async function handleRequest(request) {
  const issueUrls = await request.json();

  const stateFromGithub = async (issue) => fetch(`https://api.github.com/repos/${issue}`, {
      cf: {
        cacheTtl: 86400,
        cacheEverything: true,
      },
      method: 'GET',
      headers: {
        'user-agent': 'eslint-open-gh-issue-rule-agent',
        "content-type": "application/json;charset=UTF-8"
      }
    })
    .then(r => r.json())
    .then(({state}) => state)

  const result = await Promise.all(issueUrls.map(async (issue) => ({[issue]: {state: await stateFromGithub(issue)}})));
  const response = result.reduce((acc, cur) => ({...acc, ...cur}), {});

  return new Response(JSON.stringify(response, null, 2), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})