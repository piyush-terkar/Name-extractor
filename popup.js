let goBtn = document.querySelector("button");
let startpg = document.querySelector("#Start");
let endpg = document.querySelector("#End");
let all_results = [];

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
        chrome.tabs.sendMessage(activeTab.id, input, (response) => {
          all_results.push(response.res);
        });
        await updateUrl(
          activeTab.id,
          `https://www.linkedin.com/search/results/people/?keywords=data%20science&origin=SWITCH_SEARCH_VERTICAL&page=${++input.Start}&sid=_PO`
        );
      }
      chrome.tabs.sendMessage(activeTab.id, {
        Action: "Output",
        res: all_results,
        Start: oStart,
      });
    });
  });
});
