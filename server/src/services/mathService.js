// const firebaseService = require('./firebase');

// class MathService {
//   async getRandomProblem() {
//     // TODO: Implement logic to fetch a random math problem from Firebase
//     return { question: "What is 2 + 2?", answer: 4 };
//   }

//   async checkAnswer(problemId, userAnswer) {
//     // TODO: Implement logic to check the user's answer
//     return { correct: true, explanation: "Good job!" };
//   }

//   // TODO: Add more methods as needed
// }

// module.exports = new MathService();

class MathService {
    constructor() {
      this.problems = new Map();
    }
  
    getRandomProblem() {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const operation = Math.random() < 0.5 ? '+' : '-';
      const problem = {
        id: Date.now().toString(),
        question: `What is ${a} ${operation} ${b}?`,
        answer: operation === '+' ? a + b : a - b
      };
      this.problems.set(problem.id, problem);
      return { id: problem.id, question: problem.question };
    }
  
    checkAnswer(problemId, userAnswer) {
      const problem = this.problems.get(problemId);
      if (!problem) {
        return { error: 'Problem not found' };
      }
      const correct = parseInt(userAnswer) === problem.answer;
      return {
        correct,
        correctAnswer: problem.answer,
        explanation: correct ? 'Great job!' : `The correct answer is ${problem.answer}.`
      };
    }
  }
  
  module.exports = new MathService();
  
