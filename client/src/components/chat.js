// src/components/Chat.js
import React, { useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/llm/chat`, { question });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Произошла ошибка при получении ответа.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={question} onChange={handleQuestionChange} placeholder="Ask a math question..." />
        <button type="submit">Ask</button>
      </form>
      {response && (
        <div>
          <h2>Response:</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
