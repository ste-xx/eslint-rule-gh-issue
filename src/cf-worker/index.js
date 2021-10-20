async function handleRequest() {
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  }
  return new Response({ 'gh-issue': '4711'}, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest())
})