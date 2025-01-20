import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "User", text: userMessage },
    ]);
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/message", {
        userMessage, // Ensure this matches the backend
      });

      console.log("Backend Response:", response.data); // Debugging log

      setMessages((prev) => [
        ...prev,
        { user: "Bot", text: response.data.botResponse }, // Match the backend response key
      ]);
      setInput(""); // Clear the input
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("http://localhost:5000/api/history");
        setMessages(
          response.data.map((msg) => ({
            user: msg.user_message ? "User" : "Bot",
            text: msg.user_message || msg.bot_response,
          }))
        );
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError("Failed to load chat history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Chatbot</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        style={{
          width: "80%",
          padding: "0.5rem",
          marginRight: "0.5rem",
        }}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        style={{ padding: "0.5rem" }}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Chat;
