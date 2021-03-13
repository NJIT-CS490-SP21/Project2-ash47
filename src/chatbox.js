import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export function ChatBox(props) {
  const inputRef = useRef(null);
  const [chat, setChat] = useState([]);

  const messages = document.getElementById('chat');

  function clickHandler() {
    const userChat = inputRef.current.value;
    inputRef.current.value = '';

    if (userChat !== '') {
      setChat((prevList) => [...prevList, `${props.user}: ${userChat}`]);

      props.socket.emit('chat', { chat: `${props.user}: ${userChat}` });
    }
  }

  function scrollToBottom() {
    try {
      messages.scrollTop = messages.scrollHeight;
    } catch (err) { console.log(); }
  }

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    props.socket.emit('currentChat', 'getChat');

    props.socket.on('currentChat', (data) => {
      setChat((prevData) => {
        let newBoard = [...prevData];
        newBoard = data.board;
        return newBoard;
      });
    });
  }, []);

  useEffect(() => {
    props.socket.on('chat', (data) => {
      setChat((prevList) => [...prevList, data.chat]);
    });
  }, []);

  return (
    <div className="chatBox">
      <h1 className="user_h1">Chat</h1>
      <div className="chat" id="chat">
        {chat.map((item) => (
          <div>
            <p>{item}</p>
          </div>
        ))}
      </div>
      <input
        className="chatInput"
        ref={inputRef}
        type="text"
        placeholder="Type message..."
      />
      <button className="chatButton" type="submit" onClick={clickHandler}>
        Submit
      </button>
    </div>
  );
}

ChatBox.propTypes = {
  user: PropTypes.string,
  socket: PropTypes.objectOf(PropTypes.object),
};

ChatBox.defaultProps = {
  user: PropTypes.string,
  socket: PropTypes.objectOf(PropTypes.object),
};

export default ChatBox;
