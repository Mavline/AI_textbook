// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
// Закомментируем BlockMath временно
// import { BlockMath } from 'react-katex';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [history, setHistory] = useState([]); // Для сохранения истории диалога

  useEffect(() => {
    // Создание новой сессии при монтировании компонента
    const startSession = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/start-session`);
        setSessionId(res.data.sessionId);
      } catch (error) {
        console.error('Ошибка при создании сессии:', error);
      }
    };

    startSession();
  }, []); // Пустой массив зависимостей для выполнения эффекта только один раз

  useEffect(() => {
    // Завершение сессии при размонтировании компонента
    const endSession = async () => {
      if (sessionId) {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/end-session`, { sessionId });
        } catch (error) {
          console.error('Ошибка при завершении сессии:', error);
        }
      }
    };

    return () => {
      endSession();
    };
  }, [sessionId]); // Массив зависимостей с sessionId

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/llm/chat`, { question, sessionId });
      const newResponse = res.data.response;
      setResponse(newResponse);
      setHistory([...history, { question, response: newResponse }]); // Добавление в историю
      setQuestion(''); // Очистка вопроса
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      setResponse('Произошла ошибка при получении ответа.');
    }
  };

  const endCurrentSession = async () => {
    if (sessionId) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/end-session`, { sessionId });
        setSessionId('');
        setHistory([]); // Очистка истории
        setResponse('Текущая сессия завершена.');
      } catch (error) {
        console.error('Ошибка при завершении сессии:', error);
      }
    }

    // Начало новой сессии
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/start-session`);
      setSessionId(res.data.sessionId);
    } catch (error) {
      console.error('Ошибка при создании новой сессии:', error);
    }
  };

  const renderResponse = (response) => {
    // Предполагается, что ответ содержит LaTeX, заключенный в $$...$$ или $...$
    const parts = response.split(/(\$\$.*?\$\$|\$.*?\$)/g).filter(Boolean);
    return parts.map((part, index) => {
      // Закомментируем BlockMath временно
      // if (part.startsWith('$$')) {
      //   return <BlockMath key={index}>{part.slice(2, -2)}</BlockMath>;
      // } else if (part.startsWith('$')) {
      //   return <BlockMath key={index}>{part.slice(1, -1)}</BlockMath>;
      // } else {
      return <p key={index} style={{ whiteSpace: 'pre-wrap', color: '#f0f0f0' }}>{part}</p>;
      // }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
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
        {response && (
          <div style={styles.responseContainer}>
            <h2 style={styles.heading}>Response:</h2>
            {renderResponse(response)}
          </div>
        )}
        {history.length > 0 && (
          <div style={styles.historyContainer}>
            <h2 style={styles.heading}>History:</h2>
            {history.map((item, index) => (
              <div key={index} style={styles.historyItem}>
                <p><strong>Q:</strong> {item.question}</p>
                <p><strong>A:</strong> {renderResponse(item.response)}</p>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'sticky',
    top: '0',
    backgroundColor: '#1c1c1c',
    paddingBottom: '10px',
    zIndex: '100',
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
};

export default Chat;
