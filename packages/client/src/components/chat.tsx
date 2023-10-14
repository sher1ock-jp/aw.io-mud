import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket';
import { startChat, stopChat } from '../reducers/gameState';

interface RootState {
  messages: Array<{ nickname: string; text: string }>;
  gameState: {
    isChatting: boolean;
  };
}

const Chat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.messages);
  const gameState = useSelector((state: RootState) => state.gameState);

  const [message, setMessage] = useState('');
  const messageBoxRef = useRef<HTMLUListElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const updateMessage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(evt.target.value);
  };

  const sendMessage = () => {
    if (message) {
      socket.emit('new_message', message);
      setMessage('');
    }
  };

  useEffect(() => {
    if (gameState.isChatting && messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }

    if (chatInputRef.current && gameState.isChatting) {
      chatInputRef.current.focus();
    }
  }, [gameState.isChatting, messages]);

  useEffect(() => {
    const handleKeyDown = (evt: KeyboardEvent) => {
      if (!gameState.isChatting && evt.keyCode === 13) dispatch(startChat());
      if (gameState.isChatting && evt.keyCode === 27) dispatch(stopChat());
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.isChatting]);

  return (
    <div id="chat-box">
      { gameState.isChatting
        ? (
          <div id="message-box">
            <ul
              ref={messageBoxRef}
              id="message-list"
              className="collection"
            >
              {messages.map((message, i) => {
                const nickname = message.nickname.length > 15
                  ? `${message.nickname.slice(0, 14)}...`
                  : message.nickname;
                return (
                  <li key={i} className="message-item">
                    {`${nickname}: ${message.text}`}
                  </li>
                );
              })}
            </ul>
            <input
              ref={chatInputRef}
              value={message}
              onChange={updateMessage}
              onBlur={() => dispatch(stopChat())}
              onKeyPress={(evt) => { if (evt.key === 'Enter') sendMessage(); }}
              maxLength={70}
              type="text"
              id="new-message"
              placeholder="press 'esc' to close"
            />
          </div>
        )
        : (
          <div>
            <div
              id="last-message"
              onClick={() => dispatch(startChat())}
            >
              {messages.length > 0 && `${messages[messages.length - 1].nickname}: ${messages[messages.length - 1].text}`}
            </div>
            <div id="open-message">
              press enter to chat
            </div>
          </div>
        )}
    </div>
  );
};

export default Chat;
