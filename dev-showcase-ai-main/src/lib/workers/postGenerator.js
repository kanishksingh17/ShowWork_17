/**
 * AI Post Generator - Generates platform-specific content using OpenAI
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

/**
 * Generate platform-specific posts for a project
 * @param {Object} params - Generation parameters
 * @param {string} params.projectTitle - Title of the project
 * @param {string} params.description - Project description
 * @param {Array} params.platforms - Target platforms ['twitter', 'linkedin', 'instagram']
 * @returns {Object} Platform-specific generated content
 */
export async function generatePost({ projectTitle, description, platforms = ['twitter', 'linkedin'] }) {
  try {
    console.log(`🤖 Generating AI content for: ${projectTitle}`);
    
    const results = {};
    
    for (const platform of platforms) {
      const prompt = getPlatformPrompt(platform, projectTitle, description);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a social media expert who creates engaging, platform-appropriate content for developers and tech professionals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });
      
      results[platform] = completion.choices[0].message.content.trim();
      console.log(`✅ Generated ${platform} content`);
    }
    
    return results;
  } catch (error) {
    console.error('❌ AI post generation failed:', error);
    
    // Fallback to template-based generation
    return generateFallbackContent({ projectTitle, description, platforms });
  }
}

/**
 * Get platform-specific prompt for AI generation
 */
function getPlatformPrompt(platform, projectTitle, description) {
  const prompts = {
    twitter: `Create a Twitter post (max 280 chars) for a developer showcasing their project: "${projectTitle}". Description: "${description}". Make it engaging, use relevant hashtags, and include emojis. Focus on the tech stack and impact.`,
    
    linkedin: `Create a LinkedIn post for a developer showcasing their project: "${projectTitle}". Description: "${description}". Make it professional, highlight technical achievements, and encourage engagement. Include relevant hashtags.`,
    
    instagram: `Create an Instagram caption for a developer showcasing their project: "${projectTitle}". Description: "${description}". Make it visually appealing, use emojis, and include relevant hashtags. Keep it engaging and personal.`
  };
  
  return prompts[platform] || prompts.twitter;
}

/**
 * Fallback content generation when AI fails
 */
function generateFallbackContent({ projectTitle, description, platforms }) {
  const templates = {
    twitter: `🚀 Just built "${projectTitle}"! ${description.substring(0, 100)}... #DevShowcase #Tech #Coding`,
    
    linkedin: `Excited to share my latest project: "${projectTitle}"\n\n${description}\n\n#Tech #Development #Portfolio #Innovation`,
    
    instagram: `✨ New project alert! "${projectTitle}" 🚀\n\n${description.substring(0, 150)}...\n\n#DevShowcase #Tech #Coding #Innovation #Portfolio`
  };
  
  const results = {};
  for (const platform of platforms) {
    results[platform] = templates[platform] || templates.twitter;
  }
  
  return results;
}

/**
 * Generate hashtags for a project
 */
export function generateHashtags(projectTitle, description, platform) {
  const baseHashtags = ['#DevShowcase', '#Tech', '#Development'];
  
  const platformHashtags = {
    twitter: [...baseHashtags, '#Coding', '#Innovation'],
    linkedin: [...baseHashtags, '#Professional', '#Career', '#TechIndustry'],
    instagram: [...baseHashtags, '#Creative', '#Design', '#Portfolio']
  };
  
  // Add technology-specific hashtags based on description
  const techKeywords = description.toLowerCase();
  const techHashtags = [];
  
  if (techKeywords.includes('react')) techHashtags.push('#React');
  if (techKeywords.includes('node')) techHashtags.push('#NodeJS');
  if (techKeywords.includes('python')) techHashtags.push('#Python');
  if (techKeywords.includes('ai') || techKeywords.includes('machine learning')) techHashtags.push('#AI', '#MachineLearning');
  if (techKeywords.includes('web')) techHashtags.push('#WebDev');
  if (techKeywords.includes('mobile')) techHashtags.push('#MobileDev');
  
  return [...(platformHashtags[platform] || baseHashtags), ...techHashtags].slice(0, 5);
}
