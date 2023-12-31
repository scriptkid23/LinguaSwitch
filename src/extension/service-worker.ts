import { SupportPlatform } from "./constants";
import { facebookUpdate, instagramUpdate, telegramUpdate } from "./support";
const _ = require("lodash");

var to: string;
var current: string;

const debounceHandler = _.debounce(async function (text: string, update: any) {
  try {
    const language = await chrome.storage.local.get(["la"]);

    const url = "https://api.caipacity.com/v1/chat/completions";
    const xhr = new XMLHttpRequest();
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer 8a3c3770-c747-4c42-927e-fa071406607d",
    };
    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `translate into ${to ? to : language.la}: "${text}"`,
        },
      ],
    };

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log("trigger");

        const response = JSON.parse(xhr.responseText);
        const regex = /"(.*?)"/;

        const match = response.choices[0].message.content.match(regex);

        let result = response.choices[0].message.content;

        if (match) {
          result = match[1];
        }
        current = result;
        update(result);
      }
    });

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", headers["Content-Type"]);
    xhr.setRequestHeader("Authorization", headers["Authorization"]);
    xhr.send(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}, 1000);

document.addEventListener("keyup", function (event: Event) {
  // if (event instanceof KeyboardEvent && event.key === "Enter") {
  //   event.preventDefault();
    
  //   // remove data in LRU cache

  // }
  if (!event || !event.target) return;

  const targetElement = event.target as HTMLInputElement;

  if (current === targetElement.textContent) return;

  switch (window.location.hostname) {
    case SupportPlatform.Facebook:
      if (targetElement.getAttribute("aria-label") === "Message") {
        var text = targetElement.textContent;
        if (text?.length === 0) return;
        debounceHandler(text, facebookUpdate);
      }
      break;
    case SupportPlatform.Instagram:
      if (targetElement.getAttribute("aria-label") === "Message") {
        var text = targetElement.textContent;
        if (text?.length === 0) return;
        debounceHandler(text, instagramUpdate);
      }
      break;
    default:
      break;
  }
});

document.addEventListener("input", function (event: Event) {
  if (!event || !event.target) return;

  const targetElement = event.target as HTMLInputElement;

  if (current === targetElement.textContent) return;

  switch (window.location.hostname) {
    case SupportPlatform.Telegram:
      if (targetElement.getAttribute("aria-label") === "Message") {
        var text = targetElement.textContent;
        if (text?.length === 0) return;

        debounceHandler(text, telegramUpdate);
      }
      break;
    default:
      break;
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.data) {
    to = request.data.to;
  }
});

export {};
