import React, { useState } from 'react';
import './Messages.css';

function ChatRoom({ login, messages, onSendMessage }) {
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage("");
        }
    };

    if (messages == null) {
        return (
            <div className='message-error'>Messages Not Found</div>
        )
    }

    const analyzeText = (text) => {
        console.log("\t\tTEXT:", text);
        if (text.toLowerCase().endsWith("images") || text.toLowerCase().endsWith("jpeg")) {
            return <><br/><img src={text} alt={text}/></>
        } else if (text.toLowerCase().includes("http")) {
            return <a href={text}>{text}</a>;
        } else {
            return text;
        }
    }
    
    return (
        <div className="chat-room">
            <h3>Chat Room</h3>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <strong className = "username">{message.username}:</strong> {analyzeText(message.text)}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button className="send_message_button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatRoom;
