import React, { ChangeEvent } from "react";
import "./App.css";
import { lang } from "./data";

function App() {
  const [la, setLang] = React.useState<string>("en");

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          chrome.tabs.sendMessage(tabs[0].id || 0, {
            data: {
              to: e.target.value,
            },
          });
        }
      );
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
