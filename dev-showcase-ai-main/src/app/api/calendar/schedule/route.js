/**
 * API Route: Schedule a post
 * POST /api/calendar/schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { schedulePost } from '../../../../lib/workers/platformPublisher.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { projectId, platforms, content, scheduledAt, userId } = body;
    
    // Validate required fields
    if (!projectId || !platforms || !content || !scheduledAt || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
    
    // Validate scheduled date
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled date must be in the future' },
        { status: 400 }
      );
    }
    
    // Schedule the post
    const result = await schedulePost({
      projectId,
      platforms,
      content,
      scheduledAt: scheduledDate,
      userId
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Schedule post error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    );
  }
}
