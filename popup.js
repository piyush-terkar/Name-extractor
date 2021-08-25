let goBtn = document.querySelector("button");
let startpg = document.querySelector("#Start");
let endpg = document.querySelector("#End");

function send(message) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, message);
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
    send(msg);
    console.log(msg);
  });
});
