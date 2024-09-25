import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios"; // for making API calls

const ChatWindow = ({ user, doctorId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
 

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:5173/");

    // Fetch chat history when the component mounts
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:4025/api/chat/${doctorId}/${user.id}`);
  
        setMessages(response.data); // Set the fetched chat history
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    // Join a chat room for this user and doctor
    socketRef.current.emit("joinRoom", { userId: user.id, doctorId });

    // Listen for incoming messages
    socketRef.current.on("message", (newMessage) => {
      // Immediately update the messages state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketRef.current.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [user.id, doctorId]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        sender_id: doctorId, // Set sender_id to doctorId
        receiver_id: user.id, // Set receiver_id to user.id
        message,
      };

      try {
        // Send message through the Socket.io event
        socketRef.current.emit("sendMessage", newMessage);

        // Save the message to the database via REST API
        await axios.post("http://localhost:4025/api/chat/", newMessage);

        // Immediately update the messages state
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Clear the input field
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-[#34a5b1] border-b border-[#34a5b1]">
        <h2 className="text-xl font-semibold text-white">Chat with {user.name}</h2>
      </div>

      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-y-auto">
  {messages.map((msg, index) => {
 
    return (
      <div
        key={index}
        className={`my-2 p-2 rounded-md ${
          msg.sender_id == doctorId ? "bg-[#34a5b1] ml-auto" : "bg-gray-200 mr-auto"
        }`}
        style={{ maxWidth: "75%" }}
      >
        <p>
          <strong>{msg.sender_id == doctorId ? "You" : user.name}: </strong>
          {msg.message}
        </p>
      </div>
    );
  })}
</div>


      {/* Input Section */}
      <div className="p-4 border-t border-gray-300">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-[#34a5b1] text-white px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
