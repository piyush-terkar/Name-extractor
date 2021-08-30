let result = [];
let hrefs = [];

let extractNames = () => {
  let names = document.querySelectorAll('[dir="ltr"]');
  for (let i = 1; i <= 10; i++) {
    window.scrollBy(0, 500);
    console.log(names[i].firstChild.innerText);
    result.push(names[i].firstChild.innerText);
    hrefs.push(names[i].parentElement.href);
  }
  return result;
};

function ExtractProfile() {
  let profile = {};
  profile.name = document.querySelector(".text-heading-xlarge").innerText;
  profile.connections = document.querySelector(".t-bold").innerText;
  let expSec = document.querySelector("#experience-section");
  if (expSec) {
    profile.experience = [];
    let exp = document.querySelectorAll("h3");
    for (let entry of exp) {
      profile.experience.push(entry.innerText);
    }
  }
  let abt = document.querySelector(".pv-about-section");
  if (abt) {
    profile.about = abt.innerText;
  }
  console.clear();
  console.log(profile);
  return profile;
}

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
  if (request.Action === "Extract") {
    let msg = {
      res: extractNames(),
      links: hrefs,
    };
    sendResponse(msg);
  } else if (request.Action === "ExtractProfile") {
    sendResponse(ExtractProfile());
  } else {
    showOutput(request.res, request.Start);
    for (let profile of request.profiles) {
      console.log(profile);
    }
  }
});
