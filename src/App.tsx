import React, { ChangeEvent } from "react";
import "./App.css";
import { lang } from "./data";

function App() {
  const [la, setLang] = React.useState<string>("en");

  React.useEffect(() => {
    chrome.storage.local.get(["la"], (result) => {
      setLang(result.la || "en");
      sendToServiceWorker(result.la);
    });
  }, []);

  const sendToServiceWorker = (la: string) => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        async (tabs) => {
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          if (
            tabs[0].url &&
            /chrome:\/\/extensions|chrome:\/\/newtab\//i.test(tabs[0].url)
          )
            return;

          await chrome.tabs.sendMessage(tabs[0].id || 0, {
            data: {
              to: la,
            },
          });
        }
      );
  };

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
    sendToServiceWorker(e.target.value);

    await chrome.storage.local.set({ la: e.target.value });
  };
  return (
    <div className="App">
      <div className="alert alert-primary" role="alert">
        Only works on Facebook.
      </div>
      <div className="d-flex w-100">
        <div>
          <span>To</span>
          <div>
            <select
              className="form-select"
              aria-label="Default select example"
              name="to"
              value={la}
              onChange={(e) => handleChange(e)}
            >
              {Object.keys(lang).map((key: string, index: number) => (
                <option value={key} key={index}>
                  {lang[key].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
