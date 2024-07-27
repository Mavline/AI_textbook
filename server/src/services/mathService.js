const admin = require('../config/firebase-config');
const db = admin.firestore();

class MathService {
  async getRandomProblem() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() < 0.5 ? '+' : '-';
    const problem = {
      question: `What is ${a} ${operation} ${b}?`,
      answer: operation === '+' ? a + b : a - b
    };

    const docRef = await db.collection('problems').add(problem);
    return { id: docRef.id, question: problem.question };
  }

  async checkAnswer(problemId, userAnswer) {
    const docRef = db.collection('problems').doc(problemId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return { error: 'Problem not found' };
    }

    const problem = doc.data();
    const correct = parseInt(userAnswer) === problem.answer;

    return {
      correct,
      correctAnswer: problem.answer,
      explanation: correct ? 'Great job!' : `The correct answer is ${problem.answer}.`
    };
  }
}

module.exports = new MathService();
