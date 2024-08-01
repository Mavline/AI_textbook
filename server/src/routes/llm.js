const express = require('express');
const router = express.Router();
const llmService = require('../services/llmService');
const cacheService = require('../services/cacheService');
const logger = require('../services/logger');
const { generateMathTutorPrompt } = require('../config/llmConfig');

router.post('/chat', async (req, res) => {
  const { question, sessionId } = req.body;
  logger.info(`Received request for session ${sessionId}: ${JSON.stringify(req.body)}`);

  try {
    let context = cacheService.get(sessionId, 'context') || "";

    const prompt = generateMathTutorPrompt(question, context);
    logger.info(`Generated prompt for session ${sessionId}: ${prompt}`);

    const response = await llmService.generateResponse(prompt, context);
    logger.info(`LLM response for session ${sessionId}: ${response}`);

    // Обновление контекста
    context += `\nStudent's question: ${question}\nLLM's response: ${response}`;
    cacheService.set(sessionId, 'context', context);

    res.json({ response });
  } catch (error) {
    logger.error(`Error in LLM chat for session ${sessionId}: ${error.message}`);
    res.status(500).json({ error: 'An error occurred during the LLM chat' });
  }
});

module.exports = router;
