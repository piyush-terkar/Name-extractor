const goBtn = document.querySelector("button");
const startpg = document.querySelector("#Start");
const endpg = document.querySelector("#End");
let all_results = [];
let all_profiles = [];

function updateUrl(tab, url) {
  chrome.tabs.update(tab.id, { url });
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
      if (info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        resolve();
      }
    });
  });
}

function traverseProfiles(tabId, msg) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, msg, async (response) => {
      all_results.push(response.res);
      let links = response.links;
      for (let i = 0; i < 10; i++) {
        await updateUrl(tabId, links[i]);
        extractProfiles(tabId, { Action: "ExtractProfile" });
      }
      resolve();
    });
  });
}

function extractProfiles(tabId, msg) {
  chrome.tabs.sendMessage(tabId, msg, (response) => {
    all_profiles.push(response);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  goBtn.addEventListener("click", (event) => {
    event.preventDefault();
    input = {
      Action: "Extract",
      Start: Number(startpg.value),
      End: Number(endpg.value),
      count: Number(endpg.value) - Number(startpg.value),
    };
    if (input.Start > input.End) {
      alert("Start page cannot be greater than end page");
      return;
    }
    let oStart = input.Start;
    chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
      let activeTab = tabs[0];
      await updateUrl(
        activeTab.id,
        `https://www.linkedin.com/search/results/people/?keywords=data%20science&origin=SWITCH_SEARCH_VERTICAL&page=${input.Start}&sid=_PO`
      );
      for (input.count; input.count >= 0; input.count--) {
        await traverseProfiles(activeTab.id, { Action: "Extract" });
        await updateUrl(
          activeTab.id,
          `https://www.linkedin.com/search/results/people/?keywords=data%20science&origin=SWITCH_SEARCH_VERTICAL&page=${++input.Start}&sid=_PO`
        );
      }
      chrome.tabs.sendMessage(activeTab.id, {
        Action: "Output",
        res: all_results,
        profiles: all_profiles,
        Start: oStart,
      });
    });
  });
});
