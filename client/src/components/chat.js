import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
// import { BlockMath } from 'react-katex';

// Используем относительные пути для импорта изображений
import avatarResponse from '../assets/avatar_response.png';
import avatarQuestion from '../assets/avatar_question.png';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/start-session`);
        setSessionId(res.data.sessionId);
      } catch (error) {
        console.error('Ошибка при создании сессии:', error);
      }
    };

    startSession();

    return () => {
      if (sessionId) {
        axios.post(`${process.env.REACT_APP_API_URL}/api/end-session`, { sessionId })
          .catch(error => console.error('Ошибка при завершении сессии:', error));
      }
    };
  }, []);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/llm/chat`, { question, sessionId });
      const newResponse = res.data.response;
      setHistory([...history, { question, response: newResponse }]);
      setQuestion('');
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      setHistory([...history, { question, response: 'Произошла ошибка при получении ответа.' }]);
    }
  };

  const endCurrentSession = async () => {
    if (sessionId) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/end-session`, { sessionId });
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/start-session`);
        setSessionId(res.data.sessionId);
        setHistory([]);
      } catch (error) {
        console.error('Ошибка при завершении/создании сессии:', error);
      }
    }
  };

  const renderResponse = (response) => {
    const parts = response.split(/(\$\$.*?\$\$|\$.*?\$)/g).filter(Boolean);
    return parts.map((part, index) => {
      // Закомментировано использование BlockMath
      // if (part.startsWith('$$') && part.endsWith('$$')) {
      //   return <BlockMath key={index}>{part.slice(2, -2)}</BlockMath>;
      // }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.stickyContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={question}
              onChange={handleQuestionChange}
              placeholder="Ask a math question..."
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Ask</button>
          </form>
          <button onClick={endCurrentSession} style={styles.button}>New topic</button>
        </div>
        {history.length > 0 && (
          <div style={styles.historyContainer}>
            {history.map((item, index) => (
              <div key={index} style={styles.historyItem}>
                <div style={styles.messageContainer}>
                  <img src={avatarQuestion} alt="Question" style={styles.avatar} />
                  <p style={styles.messageText}>{item.question}</p>
                </div>
                <div style={styles.messageContainer}>
                  <img src={avatarResponse} alt="Response" style={styles.avatar} />
                  <div style={styles.messageText}>{renderResponse(item.response)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100vh',
    backgroundColor: '#2c2c2c',
    overflow: 'auto',
    padding: '20px',
  },
  chatBox: {
    backgroundColor: '#1c1c1c',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    width: '600px',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stickyContainer: {
    position: 'sticky',
    top: '0',
    backgroundColor: '#1c1c1c',
    zIndex: '100',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#333',
    color: '#f0f0f0',
    width: '100%',
  },
  button: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e91e63',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '10px',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  responseContainer: {
    marginTop: '20px',
    color: '#f0f0f0',
    width: '100%',
  },
  historyContainer: {
    marginTop: '20px',
    color: '#f0f0f0',
    width: '100%',
  },
  historyItem: {
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  heading: {
    color: '#e91e63',
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
};

export default Chat;
