//// File: server/src/services/llmService.js

// const axios = require('axios');
// const cacheService = require('./cacheService');
// require('dotenv').config();

// class LLMService {
//   constructor() {
//     this.apiKey = process.env.OPENAI_API_KEY;
//     this.apiUrl = 'https://api.openai.com/v1/chat/completions';
//   }

//   async generateResponse(prompt, context = '') {
//     const cacheKey = `${prompt}|${context}`;
//     const cachedResponse = cacheService.get(cacheKey);
    
//     if (cachedResponse) {
//       console.log('Cache hit');
//       return cachedResponse;
//     }

//     try {
//       const response = await axios.post(
//         this.apiUrl,
//         {
//           model: 'gpt-3.5-turbo',
//           messages: [
//             { role: 'system', content: 'You are a helpful math tutor.' },
//             { role: 'user', content: context + '\n' + prompt }
//           ]
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${this.apiKey}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const generatedResponse = response.data.choices[0].message.content;
//       cacheService.set(cacheKey, generatedResponse);
//       return generatedResponse;
//     } catch (error) {
//       console.error('Error calling LLM API:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new LLMService();



// // File: server/src/services/llmService.js by llama

// const axios = require('axios');

// require('dotenv').config();

// class LLMService {
//   constructor() {
//     this.apiKey = process.env.OPENAI_API_KEY;
//     this.apiUrl = 'https://api.openai.com/v1/chat/completions';
//   }

//   async generateResponse(prompt, context = '', language) {
//     try {
//       const response = await axios.post(
//         this.apiUrl,
//         {
//           model: 'gpt-4o-mini',
//           messages: [
//             { role: 'system', content: 'You are a helpful multilaguage math tutor.', Language: `${language}`, },
//             { role: 'user', content: context + '\n' + prompt },
//           ],
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${this.apiKey}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const generatedResponse = response.data.choices[0].message.content;
//       return generatedResponse;
//     } catch (error) {
//       console.error('Error calling LLM API:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new LLMService();


const axios = require('axios');
const firebaseService = require('./firebase');
require('dotenv').config();

class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4o-mini';
  }

  async generateResponse(prompt, context = '', language) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            { 
              role: 'system', 
              content: this.getSystemPrompt(language)
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
      
      if (this.needsClarification(generatedResponse)) {
        return generatedResponse; // Возвращаем уточняющий вопрос
      } else if (this.needsDatabaseCheck(generatedResponse)) {
        return await this.getResponseWithDatabaseCheck(prompt, context, language);
      }

      return generatedResponse;
    } catch (error) {
      console.error('Error calling LLM API:', error);
      throw error;
    }
  }

  getSystemPrompt(language) {
    return `You are a helpful multilanguage math tutor for elementary and middle school students. 
    Your primary goal is to engage in human-like interaction, asking clarifying questions when needed. 
    If you don't understand the question, ask for clarification up to two times. 
    If you understand the question but lack context, indicate that you need to check additional resources. 
    Always respond in ${language} and maintain a friendly, patient, and encouraging tone. 
    Break down complex problems into simpler steps and use real-world examples when possible.`;
  }

  needsClarification(response) {
    return response.toLowerCase().includes("could you please clarify") || 
           response.toLowerCase().includes("can you provide more information");
  }

  needsDatabaseCheck(response) {
    return response.toLowerCase().includes("i need to check additional resources") || 
           response.toLowerCase().includes("let me consult our textbook");
  }

  async getResponseWithDatabaseCheck(prompt, context, language) {
    try {
      console.log('Attempting to fetch book structure from Firestore...');
      const bookStructure = await firebaseService.getDocument('textbooks', 'math-textbook-structure');
      console.log('Book structure fetched:', bookStructure);
      
      const relevantSection = this.findRelevantSection(bookStructure, prompt);
      
      if (relevantSection) {
        const newContext = `Based on our textbook, the relevant information can be found in ${relevantSection.title} on page ${relevantSection.page}.`;
        return this.generateResponse(prompt, context + '\n' + newContext, language);
      } else {
        return this.generateResponse(prompt, context, language);
      }
    } catch (error) {
      console.error('Error fetching book structure:', error);
      return this.generateResponse(prompt, context, language);
    }
  }

  findRelevantSection(bookStructure, prompt) {
    const keywords = prompt.toLowerCase().split(' ');
    for (const chapter of (bookStructure.chapters || [])) {
      for (const section of (chapter.sections || [])) {
        if (keywords.some(keyword => section.title.toLowerCase().includes(keyword))) {
          return section;
        }
      }
    }
    return null;
  }
}

module.exports = new LLMService();
