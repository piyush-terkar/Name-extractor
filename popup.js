let goBtn = document.querySelector("button");
let startpg = document.querySelector("#Start");
let endpg = document.querySelector("#End");
let all_results = [];

function goToUrl(tab, url) {
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
    msg = {
      Action: "Extract",
      Start: Number(startpg.value),
      End: Number(endpg.value),
      count: Number(endpg.value) - Number(startpg.value),
    };
    if (msg.Start > msg.End) {
      alert("Start page cannot be greater than end page");
      return;
    }
    chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
      let activeTab = tabs[0];
      await goToUrl(
        activeTab.id,
        `https://www.linkedin.com/search/results/people/?keywords=data%20science&origin=SWITCH_SEARCH_VERTICAL&page=${msg.Start}&sid=_PO`
      );
      for (msg.count; msg.count >= 0; msg.count--) {
        chrome.tabs.sendMessage(activeTab.id, msg, (response) => {
          all_results.push(response.res);
        });
        await goToUrl(
          activeTab.id,
          `https://www.linkedin.com/search/results/people/?keywords=data%20science&origin=SWITCH_SEARCH_VERTICAL&page=${++msg.Start}&sid=_PO`
        );
      }
      chrome.tabs.sendMessage(activeTab.id, {
        Action: "Output",
        res: all_results,
      });
    });
  });
});
