/**
 * API Route: AI Post Generation
 * POST /api/ai/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePost } from '../../../../lib/workers/postGenerator.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, platforms = ['twitter', 'linkedin'] } = body;
    
    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    // Validate platforms
    const validPlatforms = ['twitter', 'linkedin', 'instagram'];
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { error: `Invalid platforms: ${invalidPlatforms.join(', ')}` },
        { status: 400 }
      );
    }
    
    console.log(`🤖 Generating AI content for: ${title}`);
    
    // Generate platform-specific content
    const generatedContent = await generatePost({
      projectTitle: title,
      description: description,
      platforms: platforms
    });
    
    console.log(`✅ AI content generated for ${platforms.join(', ')}`);
    
    return NextResponse.json({
      success: true,
      content: generatedContent,
      platforms: platforms,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ AI generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate AI content',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
