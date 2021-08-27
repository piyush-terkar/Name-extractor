let result = [];
let extractNames = () => {
  let names = document.querySelectorAll('[dir="ltr"]');
  for (let i = 1; i <= 10; i++) {
    window.scrollBy(0, 500);
    console.log(names[i].firstChild.innerText);
    result.push(names[i].firstChild.innerText);
  }
  return result;
};

function showOutput(all_results, Start) {
  console.clear();
  for (const page of all_results) {
    console.log(
      `---------------:Names on Page[${Start++}] are:--------------------------`
    );
    for (let j = 0; j < 10; j++) {
      console.log(page[j]);
    }
  }
  alert("Done");
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.Action == "Extract") {
    let msg = {
      res: extractNames(),
    };
    sendResponse(msg);
  } else {
    showOutput(request.res, request.Start);
  }
});
