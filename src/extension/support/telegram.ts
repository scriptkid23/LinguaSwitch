export function telegramUpdate(text: string) {
  
    const messageDiv = document.getElementById('editable-message-text')

    if (!messageDiv) return;
  
    messageDiv.textContent = text;
  
   messageDiv.dispatchEvent(new Event('input', { bubbles: true }));
   
  }