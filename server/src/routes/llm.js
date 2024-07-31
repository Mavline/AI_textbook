const express = require('express');
const router = express.Router();
const llmService = require('../services/llmService');
const { generateMathTutorPrompt } = require('../config/llmConfig');

router.post('/chat', async (req, res) => {
    console.log('Received request:', req.body);
    try {
      const { question } = req.body; // Убираем grade и language
      const context = "";
      const prompt = generateMathTutorPrompt(question, context);
      console.log('Generated prompt:', prompt);
      const response = await llmService.generateResponse(prompt, context);
      console.log('LLM response:', response);
      res.json({ response });
    } catch (error) {
      console.error('Error in LLM chat:', error);
      res.status(500).json({ error: 'An error occurred during the LLM chat' });
    }
});

module.exports = router;
