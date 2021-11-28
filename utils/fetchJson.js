const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchJson(url) {
  try {
    const response = await fetch(`${url}`, {
      method: "GET",
      credentials: "same-origin",
    });
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
}

exports.fetchJson = fetchJson;
