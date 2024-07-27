const express = require('express');
const router = express.Router();
const mathService = require('../services/mathService')

router.get('/problem', (req, res) => {
    const problem = mathService.getRandomProblem();
    res.json(problem);
  });
  
  router.post('/check-answer', (req, res) => {
    const { problemId, answer } = req.body;
    const result = mathService.checkAnswer(problemId, answer);
    res.json(result);
  });
  
  module.exports = router;
  