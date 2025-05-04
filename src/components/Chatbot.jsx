import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [fileData, setFileData] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef(null);

  const API_KEY = "AIzaSyC0S2M3ViLkQWoznBQiOrY76e5p0jiOzBI";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchFoods = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/foods');  // Đảm bảo URL chính xác
      const data = await response.json();

      // Chuyển đổi danh sách thực phẩm thành chuỗi
      const foodListText = data.map(food => `${food.brand} ${food.model} - ${food.price} VND`).join("\n");
      return foodListText;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thực phẩm:", error);
      return "";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage = {
      type: "user",
      text: message,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");

    const thinkingMessage = { type: "bot", text: "thinking..." };
    setMessages(prev => [...prev, thinkingMessage]);

    const foodListText = await fetchFoods(); // Lấy danh sách thực phẩm
    const fullPrompt =
      `Bạn là một trợ lý AI trả lời câu hỏi về thực phẩm. Trả lời NGẮN GỌN, rõ ràng, thân thiện. Nếu không tìm thấy thông tin trong danh sách thực phẩm dưới đây, hãy trả lời: "Hiện tại mình chưa tìm thấy thực phẩm nào phù hợp với bạn."\n\nDanh sách thực phẩm:\n${foodListText}\n\n` +
      `Người dùng hỏi: ${message}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);

      const botResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      setMessages(prev => [...prev.slice(0, -1), { type: "bot", text: botResponse }]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages(prev => [...prev.slice(0, -1), { type: "bot", text: "Đã xảy ra lỗi. Vui lòng thử lại sau.", error: true }]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result.split(",")[1];
      setFileData({
        data: base64String,
        mime_type: file.type,
        preview: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="chatbot-container">
    <button id="toggle-chatbot" onClick={() => setShowChatbot(!showChatbot)}>
      {showChatbot ? "✖" : "💬"}
    </button>

      {showChatbot && (
        <div className="chatbot-popup">
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}-message`}>
                {msg.file && <img src={msg.file.preview} alt="attachment" className="attachment" />}
                <div className="message-text" style={{ color: msg.error ? '#ff0000' : undefined }}>
                  {msg.text === "thinking" ? (
                    <div className="thinking-indicator">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              className="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button id="send-message" onClick={handleSendMessage}>Gửi</button>
            <button id="file-upload" onClick={() => document.getElementById("file-input").click()}>
              📎
            </button>
            <input
              type="file"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            {fileData && (
              <div className="file-upload-wrapper file-uploaded">
                <img src={fileData.preview} alt="uploaded" />
                <button id="file-cancel" onClick={() => setFileData(null)}>❌</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
