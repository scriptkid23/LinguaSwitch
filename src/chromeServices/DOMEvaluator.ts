const _ = require("lodash");

export {}
function facebookUpdate(actEl: any, text: any) {
  //@ts-ignore
  if (document.body.parentElement.id == "facebook") {
    var dc = getDeepestChild(actEl);
    var elementToDispatchEventFrom = dc.parentElement;
    let newEl;
    if (dc.nodeName.toLowerCase() == "br") {
      // attempt to paste into empty messenger field
      // by creating new element and setting it's value
      newEl = document.createElement("span");
      newEl.setAttribute("data-lexical-text", "true");
      dc.parentElement.appendChild(newEl);
      newEl.innerText = text;
    } else {
      // attempt to paste into not empty messenger field
      // by changing existing content
      dc.textContent = text;
      elementToDispatchEventFrom = elementToDispatchEventFrom.parentElement;
    }
    // simulate user's input
    elementToDispatchEventFrom.dispatchEvent(
      new InputEvent("input", { bubbles: true })
    );
    // remove new element if it exists
    // otherwise there will be two of them after
    // Facebook adds it itself!
    if (newEl) newEl.remove();
  }
}

// helper function
//@ts-ignore
function getDeepestChild(element) {
  if (element.lastChild) {
    return getDeepestChild(element.lastChild);
  } else {
    return element;
  }
}

const debounceHandler = _.debounce(function (text: string) {
  const spanElement = document.querySelector(
    'span[data-lexical-text="true"]'
  ) as HTMLSpanElement;
  if (!spanElement) return;

  try {
    const data = JSON.stringify([
      {
        Text: text,
      },
    ]);

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const result = JSON.parse(this.responseText);
        facebookUpdate(spanElement, result[0].translations[0].text);
      }
    });

    xhr.open(
      "POST",
      "https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=en&api-version=3.0&profanityAction=NoAction&textType=plain"
    );
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader(
      "X-RapidAPI-Key",
      "e19b40ac60msh9a9aa94f4b7ceb0p1fc313jsna3265fab9699"
    );
    xhr.setRequestHeader(
      "X-RapidAPI-Host",
      "microsoft-translator-text.p.rapidapi.com"
    );

    xhr.send(data);
  } catch (error) {
    console.log(error);
  }
}, 1000);

document.addEventListener("keyup", function (event: any) {
  if (event.target.getAttribute("aria-label") === "Message") {
    var text = event.target.textContent;
    debounceHandler(text);
  }
});
