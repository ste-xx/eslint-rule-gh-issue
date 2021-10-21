async function cacheFetch({reqFn, event}) {
  const cache = caches.default
  const cacheResponse = await cache.match(reqFn())
  if(cacheResponse){
    return cacheResponse;
  }
  const fetchResponse = await fetch(reqFn())
  if (fetchResponse.ok) {
    event.waitUntil(cache.put(reqFn(), fetchResponse.clone()))
  }
  return fetchResponse;
}

const createGHApiRequest = (issue) => new Request(`https://api.github.com/repos/${issue}`, {
  cf: {
    cacheTtl: 86400,
    cacheEverything: true,
  },
  method: 'GET',
  headers: {
    'user-agent': 'eslint-open-gh-issue-rule-agent',
    "content-type": "application/json;charset=UTF-8"
  }
});

async function handleRequest(event) {
  const issueUrls = await event.request.json();
  const stateFromGithub = async (issue) => cacheFetch({
    reqFn: () => createGHApiRequest(issue),
    event
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

addEventListener("fetch", event => event.respondWith(handleRequest(event)))