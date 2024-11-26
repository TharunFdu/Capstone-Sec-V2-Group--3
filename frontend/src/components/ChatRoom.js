import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getChatMessages, sendMessage } from '../services/authService';
import { useParams } from 'react-router-dom';
import './ChatRoom.css';

const ChatRoom = ({ userId }) => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const socket = io('http://localhost:5001', { transports: ['websocket'] });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const groupMessages = await getChatMessages(groupId);
        setMessages(groupMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.emit('joinGroup', { groupId });


    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [groupId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; 

    try {
      const sentMessage = await sendMessage(groupId, userId, newMessage);

   
      socket.emit('sendMessage', sentMessage.newMessage);

     
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...sentMessage.newMessage, User: { name: 'You' } },
      ]);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-room">
      <h3>Group Chat</h3>
      <div className="messages">
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.User?.name || 'Unknown User'}</strong>: {msg.message}
            </p>
          ))
        )}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
