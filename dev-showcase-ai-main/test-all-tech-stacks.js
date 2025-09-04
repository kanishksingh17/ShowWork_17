// Comprehensive Tech Stack Question Test Suite
// Tests all tech stacks to ensure questions are available

import { getQuestionsForTechStack, hasTechStackQuestions, getAvailableTechStacks } from './src/utils/questionBank.js';
import { getHybridQuestions, testAPIConnections } from './src/utils/webQuestionService.js';

// All tech stacks that should be supported
const ALL_TECH_STACKS = [
  'react', 'nodejs', 'expressjs', 'vue', 'angular', 'html', 
  'javascript', 'typescript', 'python', 'java', 'go', 'rust', 
  'php', 'sql'
];

const TECH_STACK_NAMES = {
  'react': 'React',
  'nodejs': 'Node.js', 
  'expressjs': 'Express.js',
  'vue': 'Vue.js',
  'angular': 'Angular',
  'html': 'HTML',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'go': 'Go',
  'rust': 'Rust',
  'php': 'PHP',
  'sql': 'SQL'
};

class TechStackTester {
  constructor() {
    this.results = {};
    this.failedStacks = [];
    this.passedStacks = [];
  }

  async runAllTests() {
    console.log('🧪 COMPREHENSIVE TECH STACK TESTING');
    console.log('=====================================');
    console.log(`Testing ${ALL_TECH_STACKS.length} tech stacks for question availability...\n`);

    // Test 1: API Connection Test
    await this.testAPIConnections();

    // Test 2: Local Question Availability 
    await this.testLocalQuestions();

    // Test 3: Hybrid Question Fetching
    await this.testHybridQuestions();

    // Test 4: Question Quality Check
    await this.testQuestionQuality();

    // Final Report
    this.generateReport();
  }

  async testAPIConnections() {
    console.log('📡 TEST 1: API Connection Status');
    console.log('----------------------------------');
    
    try {
      const apiStatus = await testAPIConnections();
      console.log('API Status:');
      Object.entries(apiStatus).forEach(([api, status]) => {
        console.log(`  ${api}: ${status ? '✅ Working' : '❌ Failed'}`);
      });
    } catch (error) {
      console.log('❌ API test failed:', error.message);
    }
    console.log('');
  }

  async testLocalQuestions() {
    console.log('📚 TEST 2: Local Question Availability');
    console.log('--------------------------------------');

    for (const techStack of ALL_TECH_STACKS) {
      const hasQuestions = hasTechStackQuestions(techStack);
      const questions = getQuestionsForTechStack(techStack, 15);
      
      this.results[techStack] = {
        local: {
          hasQuestions,
          questionCount: questions.length,
          questions: questions.slice(0, 3) // Store first 3 for preview
        }
      };

      const status = hasQuestions ? '✅' : '❌';
      const name = TECH_STACK_NAMES[techStack];
      console.log(`  ${status} ${name}: ${questions.length} questions available`);

      if (!hasQuestions || questions.length === 0) {
        this.failedStacks.push(techStack);
      }
    }
    console.log('');
  }

  async testHybridQuestions() {
    console.log('🔄 TEST 3: Hybrid Question Fetching');
    console.log('-----------------------------------');

    for (const techStack of ALL_TECH_STACKS) {
      try {
        const localQuestions = getQuestionsForTechStack(techStack, 5);
        const hybridQuestions = await getHybridQuestions(techStack, 10, localQuestions);
        
        this.results[techStack].hybrid = {
          success: true,
          questionCount: hybridQuestions.length,
          sources: this.identifyQuestionSources(hybridQuestions)
        };

        const status = hybridQuestions.length >= 10 ? '✅' : '⚠️';
        const name = TECH_STACK_NAMES[techStack];
        console.log(`  ${status} ${name}: ${hybridQuestions.length} hybrid questions fetched`);

        if (hybridQuestions.length === 0) {
          this.failedStacks.push(`${techStack}-hybrid`);
        } else {
          this.passedStacks.push(techStack);
        }

      } catch (error) {
        this.results[techStack].hybrid = {
          success: false,
          error: error.message
        };
        
        const name = TECH_STACK_NAMES[techStack];
        console.log(`  ❌ ${name}: Hybrid fetch failed - ${error.message}`);
        this.failedStacks.push(`${techStack}-hybrid`);
      }
    }
    console.log('');
  }

  identifyQuestionSources(questions) {
    const sources = {
      web: 0,
      local: 0,
      mock: 0
    };

    questions.forEach(q => {
      if (q.id.includes('web_') || q.id.includes('api_')) {
        sources.web++;
      } else if (q.id.includes('mock_')) {
        sources.mock++;
      } else {
        sources.local++;
      }
    });

    return sources;
  }

  async testQuestionQuality() {
    console.log('🎯 TEST 4: Question Quality Check');
    console.log('---------------------------------');

    for (const techStack of ALL_TECH_STACKS) {
      const questions = getQuestionsForTechStack(techStack, 15);
      const qualityCheck = this.checkQuestionQuality(questions);
      
      this.results[techStack].quality = qualityCheck;

      const status = qualityCheck.score >= 8 ? '✅' : qualityCheck.score >= 6 ? '⚠️' : '❌';
      const name = TECH_STACK_NAMES[techStack];
      console.log(`  ${status} ${name}: Quality score ${qualityCheck.score}/10`);
      
      if (qualityCheck.issues.length > 0) {
        qualityCheck.issues.forEach(issue => {
          console.log(`    ⚠️ ${issue}`);
        });
      }
    }
    console.log('');
  }

  checkQuestionQuality(questions) {
    const issues = [];
    let score = 10;

    // Check for minimum questions
    if (questions.length < 10) {
      issues.push(`Only ${questions.length} questions (minimum 10 expected)`);
      score -= 2;
    }

    // Check for variety in difficulty
    const difficulties = [...new Set(questions.map(q => q.difficulty))];
    if (difficulties.length < 2) {
      issues.push('Lacks difficulty variety');
      score -= 1;
    }

    // Check for variety in categories
    const categories = [...new Set(questions.map(q => q.category))];
    if (categories.length < 3) {
      issues.push('Lacks category variety');
      score -= 1;
    }

    // Check for duplicate questions
    const questionTexts = questions.map(q => q.question);
    const uniqueQuestions = [...new Set(questionTexts)];
    if (uniqueQuestions.length !== questionTexts.length) {
      issues.push('Contains duplicate questions');
      score -= 2;
    }

    // Check for proper answer options
    const invalidOptions = questions.filter(q => 
      !q.options || q.options.length < 2 || q.correctAnswer >= q.options.length
    );
    if (invalidOptions.length > 0) {
      issues.push(`${invalidOptions.length} questions have invalid options`);
      score -= 3;
    }

    return { score: Math.max(0, score), issues };
  }

  generateReport() {
    console.log('📊 FINAL TEST REPORT');
    console.log('====================');
    
    const totalStacks = ALL_TECH_STACKS.length;
    const passedCount = this.passedStacks.length;
    const failedCount = this.failedStacks.length;
    
    console.log(`\n📈 Overall Results:`);
    console.log(`  ✅ Passed: ${passedCount}/${totalStacks} tech stacks`);
    console.log(`  ❌ Failed: ${failedCount} issues found`);
    
    if (failedCount === 0) {
      console.log('\n🎉 ALL TECH STACKS WORKING PERFECTLY!');
      console.log('✅ Every tech stack has questions available');
      console.log('✅ Hybrid system functioning correctly');
      console.log('✅ Quality standards met across all stacks');
    } else {
      console.log('\n⚠️ Issues Found:');
      this.failedStacks.forEach(issue => {
        console.log(`  ❌ ${issue}`);
      });
    }

    // Detailed breakdown
    console.log('\n📋 Detailed Breakdown:');
    console.log('Tech Stack | Local | Hybrid | Quality | Status');
    console.log('-----------|-------|--------|---------|--------');
    
    ALL_TECH_STACKS.forEach(techStack => {
      const result = this.results[techStack];
      const local = result.local?.questionCount || 0;
      const hybrid = result.hybrid?.questionCount || 0;
      const quality = result.quality?.score || 0;
      const status = (local > 0 && hybrid > 0 && quality >= 7) ? '✅ PASS' : '❌ FAIL';
      
      const name = TECH_STACK_NAMES[techStack].padEnd(10);
      console.log(`${name} | ${local.toString().padStart(5)} | ${hybrid.toString().padStart(6)} | ${quality.toString().padStart(7)} | ${status}`);
    });

    console.log('\n🎯 Recommendations:');
    if (passedCount === totalStacks) {
      console.log('✅ System is production-ready');
      console.log('✅ All tech stacks properly supported');
      console.log('✅ Quiz system will work reliably');
    } else {
      console.log('⚠️ Fix failed tech stacks before deployment');
      console.log('⚠️ Verify API connections');
      console.log('⚠️ Check question bank completeness');
    }
  }
}

// Export test function for browser/Node.js usage
async function testAllTechStacks() {
  const tester = new TechStackTester();
  await tester.runAllTests();
  return tester.results;
}

// Auto-run if called directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testAllTechStacks = testAllTechStacks;
  console.log('🧪 Tech Stack Tester loaded. Run: testAllTechStacks()');
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = { testAllTechStacks };
}

export { testAllTechStacks };