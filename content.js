let result = [];
let hrefs = [];

let extractNames = () => {
  let names = document.querySelectorAll('[dir="ltr"]');
  console.clear();
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
    let companies = document.querySelectorAll(
      ".pv-entity__secondary-title.separator"
    );
    for (let company of companies) {
      profile.experience.push(company.parentElement.innerText);
    }
  } else {
    profile.experience = "This profile doesn't have experience section";
  }
  let abt = document.querySelector(".pv-about-section");
  if (abt) {
    profile.about = abt.innerText;
  } else {
    profile.about = "This profile doesn't have an about section";
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
    console.log(
      "----------:Final Result Stored in Array Data Structure (of JSON):----------"
    );
    console.log(request.profiles);
    console.log("----------: Expanded View of Final Result :----------");
    for (let profile of request.profiles) {
      console.log(profile);
    }
    alert("Done");
  }
});
