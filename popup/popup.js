const eksiUrl = "https://eksisozluk.com";
const eksiGundem =
  eksiUrl + "/basliklar/gundem?_=" + String(new Date().getTime());
const eksiDebe = eksiUrl + "/debe?_" + String(new Date().getTime());

listContainer = document.createElement("div");
document.getElementsByTagName("body")[0].appendChild(listContainer);

var parser = new DOMParser();

var debeReq = new XMLHttpRequest();
debeReq.open("GET", eksiDebe, true);

var gundemReq = new XMLHttpRequest();
gundemReq.open("GET", eksiGundem, true);

gundemReq.addEventListener("load", function () {
  // Request "debe" after "gündem" is loaded.
  debeReq.send(null);

  var gundemHtmlDoc = parser.parseFromString(gundemReq.response, "text/html");
  var gundemElements = gundemHtmlDoc.getElementsByClassName(
    "topic-list partial"
  )[0];
  var gundemHrefs = gundemElements.getElementsByTagName("a");
  var gundemLinks = [...gundemHrefs].map(
    (x) => eksiUrl + x.pathname + "?a=popular"
  );
  var gundemTexts = [...gundemHrefs].map((x) => x.innerText);
  var gundemTexts = [...gundemTexts].map((x) =>
    x
      .split(" ")
      .slice(0, -1)
      .concat(
        isNaN(x.split(" ").slice(-1))
          ? ["📌"]
          : ["("] + x.split(" ").slice(-1) + [")"]
      )
      .join(" ")
  );
  // console.log(gundemTexts);
  // console.log(gundemLinks);

  listElement = document.createElement("ul");
  listElement.className = "left";
  listContainer.appendChild(listElement);
  var h1 = document.createElement("h1");
  var text = document.createTextNode("gündem");
  h1.appendChild(text);
  listElement.appendChild(h1);

  for (i = 0; i < gundemLinks.length; ++i) {
    fList = document.createElement("li");
    listItem = document.createElement("a");
    listItem.innerHTML = gundemTexts[i];
    listItem.setAttribute("title", gundemTexts[i]);
    listItem.setAttribute("href", gundemLinks[i]);
    fList.appendChild(listItem);
    listElement.appendChild(fList);
  }
});

debeReq.addEventListener("load", function () {
  var debeHtmlDoc = parser.parseFromString(debeReq.response, "text/html");
  var debeElements = debeHtmlDoc.getElementsByClassName(
    "topic-list partial"
  )[1];
  var debeTexts = debeElements.getElementsByTagName("span");
  var debeTexts = [...debeTexts].map((x) => x.innerText);
  var debeLinks = debeElements.getElementsByTagName("a");
  var debeLinks = [...debeLinks].map((x) => eksiUrl + x.pathname);
  // console.log(debeLinks);
  // console.log(debeTexts);

  listElement = document.createElement("ul");
  listElement.className = "right";
  listContainer.appendChild(listElement);
  var h1 = document.createElement("h1");
  var text = document.createTextNode("debe");
  h1.appendChild(text);
  listElement.appendChild(h1);

  for (i = 0; i < debeLinks.length; ++i) {
    fList = document.createElement("li");
    listItem = document.createElement("a");
    listItem.innerHTML = debeTexts[i];
    listItem.setAttribute("title", debeTexts[i]);
    listItem.setAttribute("href", debeLinks[i]);
    fList.appendChild(listItem);
    listElement.appendChild(fList);
  }
});

// Open links in the current tab.
if (typeof browser === "undefined") {
  window.addEventListener("click", function (e) {
    if (e.target.href !== undefined) {
      e.preventDefault();
      chrome.tabs.update({ url: e.target.href });
    }
  });
} else {
  window.addEventListener("click", function (e) {
    if (e.target.href !== undefined) {
      e.preventDefault();
      browser.tabs.update({ url: e.target.href });
    }
  });
}

gundemReq.send(null);
