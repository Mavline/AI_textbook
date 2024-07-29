// File: server/src/services/llmService.js

const axios = require('axios');
const cacheService = require('./cacheService');
require('dotenv').config();

class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async generateResponse(prompt, context = '') {
    const cacheKey = `${prompt}|${context}`;
    const cachedResponse = cacheService.get(cacheKey);
    
    if (cachedResponse) {
      console.log('Cache hit');
      return cachedResponse;
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful math tutor.' },
            { role: 'user', content: context + '\n' + prompt }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedResponse = response.data.choices[0].message.content;
      cacheService.set(cacheKey, generatedResponse);
      return generatedResponse;
    } catch (error) {
      console.error('Error calling LLM API:', error);
      throw error;
    }
  }
}

module.exports = new LLMService();
