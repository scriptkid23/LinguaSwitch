const _ = require("lodash");

var to: string = "english"; 
var current: string;

// Debounce function để tối ưu API request
const debounceHandler = _.debounce(async function (
  text: string,
  update: (translatedText: string) => void
) {
  try {
    const url = "https://df48-118-70-168-155.ngrok-free.app/api/generate";

    const headers = {
      "Content-Type": "application/json",
    };

    const data = {
      model: "llama3.1",
      prompt: `Translate the following text to ${to}: "${text}".`,
      stream: false,
      format: {
        type: "object",
        properties: {
          translation: { type: "string" },
        },
        required: ["translation"],
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("API request failed");

    const responseData = await response.json();

    const res = JSON.parse(responseData.response);
    console.log({ res });
    const translatedText = res.translation || text; // Nếu không có dữ liệu, giữ nguyên văn bản gốc

    console.log(translatedText);
    current = translatedText;
    update(translatedText);
  } catch (error) {
    console.error("Translation error:", error);
  }
},
1000);

// Hàm xử lý khi input thay đổi
function handleInputChange(event: Event) {
  if (!event || !event.target) return;

  const targetElement = event.target as HTMLInputElement;
  if (
    !targetElement.getAttribute("aria-label")?.toLowerCase().includes("message")
  )
    return;

  const text = targetElement.textContent;
  if (text?.length === 0 || current === text) return;

  debounceHandler(text, (translatedText: string) => {
    console.log({ translatedText });
    targetElement.textContent = translatedText;
  });
}

// Lắng nghe sự kiện focus để phát hiện ô nhập tin nhắn
document.addEventListener("focusin", (event) => {
  const targetElement = event.target as HTMLInputElement;
  if (
    !targetElement.getAttribute("aria-label")?.toLowerCase().includes("message")
  )
    return;

  // Sử dụng MutationObserver để theo dõi thay đổi nội dung input
  const observer = new MutationObserver(() => {
    handleInputChange(event);
  });

  observer.observe(targetElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Ngắt quan sát khi người dùng mất focus
  targetElement.addEventListener("focusout", () => observer.disconnect(), {
    once: true,
  });
});

// Lắng nghe tin nhắn từ background script để cập nhật ngôn ngữ đích
chrome.runtime.onMessage.addListener((request) => {
  if (request.data) {
    to = request.data.to;
  }
});

export {};
