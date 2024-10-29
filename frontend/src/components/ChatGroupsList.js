import React, { useEffect, useState } from 'react';
import { getUserChatGroups } from '../services/authService';
import { Link } from 'react-router-dom';
import './ChatGroupsList.css';

const ChatGroupsList = ({ userId }) => {
  const [chatGroups, setChatGroups] = useState([]);

  useEffect(() => {
    const fetchChatGroups = async () => {
      try {
        const groups = await getUserChatGroups(userId);
        setChatGroups(groups);
      } catch (error) {
        console.error('Failed to fetch chat groups:', error);
      }
    };

    fetchChatGroups();
  }, [userId]);

  return (
    <div className="chat-groups-list">
      <h3>Your Chat Groups</h3>
      <ul>
        {chatGroups.length === 0 ? (
          <p>No chat groups yet</p>
        ) : (
          chatGroups.map((group) => (
            <li key={group.groupId}>
              <Link to={`/chat/${group.groupId}`}>
              Event Chat Group #{group.ChatGroup.groupName || group.ChatGroup.eventId}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ChatGroupsList;
