// Express.js Question Test
// This tests if Express.js questions are properly available

import { getQuestionsForTechStack, hasTechStackQuestions } from '../utils/questionBank.js';
import { getHybridQuestions } from '../utils/webQuestionService.js';

async function testExpressQuestions() {
  console.log('🧪 Testing Express.js Question Availability');
  console.log('==========================================');
  
  // Test 1: Check if Express.js is recognized
  console.log('1. Checking if Express.js has questions...');
  const hasQuestions = hasTechStackQuestions('expressjs');
  console.log(`   Result: ${hasQuestions ? '✅ YES' : '❌ NO'}`);
  
  // Test 2: Get local questions
  console.log('\n2. Getting local Express.js questions...');
  const localQuestions = getQuestionsForTechStack('expressjs', 5);
  console.log(`   Found: ${localQuestions.length} questions`);
  localQuestions.forEach((q, i) => {
    console.log(`   ${i+1}. ${q.question}`);
  });
  
  // Test 3: Get hybrid questions (web + local)
  console.log('\n3. Testing hybrid question fetching...');
  try {
    const hybridQuestions = await getHybridQuestions('expressjs', 3, localQuestions);
    console.log(`   Hybrid result: ${hybridQuestions.length} questions`);
    hybridQuestions.forEach((q, i) => {
      console.log(`   ${i+1}. ${q.question} (${q.difficulty})`);
    });
  } catch (error) {
    console.log(`   Hybrid error: ${error.message}`);
  }
  
  console.log('\n✅ Express.js question test completed!');
}

// Export for browser testing
if (typeof window !== 'undefined') {
  window.testExpressQuestions = testExpressQuestions;
}

export { testExpressQuestions };