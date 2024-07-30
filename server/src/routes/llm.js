// // File: server/src/routes/llm.js

// const express = require('express');
// const router = express.Router();
// const llmService = require('../services/llmService');
// const { generateMathTutorPrompt } = require('../config/llmConfig');

// router.post('/test', async (req, res) => {
//   try {
//     const { question, grade, language } = req.body;
//     const context = "This is a test context from the math textbook.";
//     const prompt = generateMathTutorPrompt(question, context, grade);
//     const response = await llmService.generateResponse(prompt, context, language);
//     res.json({ response });
//   } catch (error) {
//     console.error('Error in LLM test:', error);
//     res.status(500).json({ error: 'An error occurred during the LLM test' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const llmService = require('../services/llmService');
const { generateMathTutorPrompt } = require('../config/llmConfig');

router.post('/chat', async (req, res) => {
    console.log('Received request:', req.body);
    try {
      const { question, grade, language } = req.body;
      const context = "";
      const prompt = generateMathTutorPrompt(question, context, grade, language);
      console.log('Generated prompt:', prompt);
      const response = await llmService.generateResponse(prompt, context, language);
      console.log('LLM response:', response);
      res.json({ response });
    } catch (error) {
      console.error('Error in LLM chat:', error);
      res.status(500).json({ error: 'An error occurred during the LLM chat' });
    }
  });

module.exports = router;


/*
To test this route using curl, run the following command in your terminal:

curl -X POST http://localhost:3001/api/llm/test \
     -H "Content-Type: application/json" \
     -d '{"question": "What is the Pythagorean theorem?", "grade": 8}'

Make sure your server is running before sending the request.
*/
