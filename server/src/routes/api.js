const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const cacheService = require('../services/cacheService');
const logger = require('../services/logger');
const mathService = require('../services/mathService');

router.get('/problem', async (req, res) => {
  try {
    const problem = await mathService.getRandomProblem();
    res.json(problem);
  } catch (error) {
    logger.error('Error fetching problem:', error.message);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

router.post('/check-answer', async (req, res) => {
  try {
    const { problemId, answer } = req.body;
    const result = await mathService.checkAnswer(problemId, answer);
    res.json(result);
  } catch (error) {
    logger.error('Error checking answer:', error.message);
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

router.get('/book-structure', async (req, res) => {
  try {
    const structure = await mathService.getBookStructure();
    res.json(structure);
  } catch (error) {
    logger.error('Error fetching book structure:', error.message);
    res.status(500).json({ error: 'Failed to fetch book structure' });
  }
});

// Add session management routes
router.post('/start-session', (req, res) => {
  const sessionId = uuid.v4();
  cacheService.set(sessionId, 'context', '');
  logger.info(`Session started: ${sessionId}`);
  res.json({ sessionId });
});

router.post('/end-session', (req, res) => {
  const { sessionId } = req.body;
  cacheService.deleteSession(sessionId);
  logger.info(`Session ended: ${sessionId}`);
  res.json({ message: 'Session ended' });
});

module.exports = router;
