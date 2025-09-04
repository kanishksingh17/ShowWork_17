// Quick Tech Stack Test
import fs from 'fs';

console.log('🧪 QUICK TECH STACK VERIFICATION');
console.log('================================');

const stacks = [
  'react', 'nodejs', 'expressjs', 'vue', 'angular', 
  'html', 'javascript', 'typescript', 'python', 
  'java', 'go', 'rust', 'php', 'sql'
];

try {
  const content = fs.readFileSync('d:/download/dev-showcase-ai-main/dev-showcase-ai-main/src/utils/questionBank.ts', 'utf8');
  
  console.log('\n📊 Tech Stack Coverage:');
  console.log('----------------------');
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  stacks.forEach(stack => {
    const hasQuestions = content.includes(`techStack: '${stack}'`) || content.includes(`techStack: "${stack}"`);
    const regex = new RegExp(`techStack: ['"]${stack}['"]`, 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    
    if (hasQuestions && count >= 10) {
      console.log(`✅ ${stack.toUpperCase().padEnd(12)} - ${count} questions`);
      totalPassed++;
    } else if (hasQuestions && count < 10) {
      console.log(`⚠️  ${stack.toUpperCase().padEnd(12)} - ${count} questions (needs more)`);
      totalFailed++;
    } else {
      console.log(`❌ ${stack.toUpperCase().padEnd(12)} - NO QUESTIONS FOUND`);
      totalFailed++;
    }
  });
  
  console.log('\n📈 SUMMARY:');
  console.log(`✅ Passed: ${totalPassed}/${stacks.length} tech stacks`);
  console.log(`❌ Failed: ${totalFailed}/${stacks.length} tech stacks`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 ALL TECH STACKS READY!');
    console.log('✅ Every tech stack has sufficient questions');
    console.log('✅ Quiz system is fully operational');
  } else {
    console.log('\n⚠️  ISSUES FOUND - Some tech stacks need attention');
  }
  
} catch (error) {
  console.error('❌ Error reading question bank:', error.message);
}