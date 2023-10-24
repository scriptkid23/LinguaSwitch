export function instagramUpdate(text: string) {
  const spanElement = document.querySelector(
    'span[data-lexical-text="true"]'
  ) as HTMLSpanElement;

  if (!spanElement) return;

  //@ts-ignore
  var dc = getDeepestChild(spanElement);
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

// helper function
//@ts-ignore
function getDeepestChild(element) {
  if (element.lastChild) {
    return getDeepestChild(element.lastChild);
  } else {
    return element;
  }
}
