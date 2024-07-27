const express = require('express');
const router = express.Router();
const mathService = require('../services/mathService');

router.get('/problem', async (req, res) => {
  try {
    const problem = await mathService.getRandomProblem();
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

router.post('/check-answer', async (req, res) => {
  try {
    const { problemId, answer } = req.body;
    const result = await mathService.checkAnswer(problemId, answer);
    res.json(result);
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

module.exports = router;
