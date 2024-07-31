const axios = require('axios');
const firebaseService = require('./firebase');
require('dotenv').config();

class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4o-mini';
  }

  async generateResponse(prompt, context = '') {
    console.log('Generating response...');
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            { role: 'user', content: context + '\n' + prompt }
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const generatedResponse = response.data.choices[0].message.content;
      console.log('Generated response:', generatedResponse);
      return generatedResponse;
    } catch (error) {
      console.error('Error calling LLM API:', error);
      throw error;
    }
  }

  getSystemPrompt() {
    return `You are a friendly and patient math tutor for students aged 8-11.
    Your goal is to explain math concepts in a simple and engaging way, as if talking to a child.
    Use everyday examples and simple language.
    If the student doesn't understand, try explaining differently using analogies or visual descriptions.
    Ask questions to ensure the student is following your explanation.
    Always be encouraging and supportive.
    Break down complex ideas into small, easy-to-understand parts.
    If you need to use math terms, always explain what they mean.
    Remember, you're replacing a real teacher, so your explanations should be very clear and accessible.
    Respond in the same language as the student's question.`;
  }
}

module.exports = new LLMService();
