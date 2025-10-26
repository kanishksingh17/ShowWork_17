/**
 * API Route: Platform webhooks
 * POST /api/webhooks/platform/[platform]
 */

import { NextRequest, NextResponse } from 'next/server';
import AnalyticsEvent from '../../../../../models/AnalyticsEvent.js';
import { connectDB } from '../../../../../lib/config/db.js';

export async function POST(request, { params }) {
  try {
    const { platform } = params;
    const body = await request.json();
    
    // Connect to database
    await connectDB();
    
    // Validate platform
    const validPlatforms = ['twitter', 'linkedin', 'instagram', 'github'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }
    
    // Extract webhook data
    const { postId, likes, views, shares, comments, engagement } = body;
    
    // Create analytics event
    const analyticsEvent = new AnalyticsEvent({
      eventType: 'post_engagement',
      data: {
        postId,
        likes: likes || 0,
        views: views || 0,
        shares: shares || 0,
        comments: comments || 0,
        engagement: engagement || 0
      },
      userId: body.userId || 'system', // In real implementation, extract from auth
      projectId: body.projectId || 'demo123',
      platform,
      processed: false
    });
    
    await analyticsEvent.save();
    
    console.log(`📊 Webhook received for ${platform}: ${postId}`);
    
    return NextResponse.json({
      message: 'Webhook received and metrics updated',
      eventId: analyticsEvent._id
    });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
