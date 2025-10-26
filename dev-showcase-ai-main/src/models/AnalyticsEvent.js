/**
 * Analytics Event Model
 * Tracks analytics events for projects and users
 */

import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['post_published', 'post_engagement', 'profile_view', 'project_view', 'click', 'share', 'like', 'comment']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['twitter', 'linkedin', 'instagram', 'github', 'website']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  processed: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
analyticsEventSchema.index({ userId: 1, timestamp: -1 });
analyticsEventSchema.index({ projectId: 1, timestamp: -1 });
analyticsEventSchema.index({ platform: 1, eventType: 1 });
analyticsEventSchema.index({ processed: 1, timestamp: 1 });

// Static method to get aggregated metrics
analyticsEventSchema.statics.getAggregatedMetrics = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: {
          platform: '$platform',
          eventType: '$eventType'
        },
        count: { $sum: 1 },
        totalEngagement: { $sum: '$data.engagement' },
        totalViews: { $sum: '$data.views' },
        totalLikes: { $sum: '$data.likes' },
        totalShares: { $sum: '$data.shares' },
        totalComments: { $sum: '$data.comments' }
      }
    },
    {
      $group: {
        _id: '$_id.platform',
        events: {
          $push: {
            eventType: '$_id.eventType',
            count: '$count',
            engagement: '$totalEngagement',
            views: '$totalViews',
            likes: '$totalLikes',
            shares: '$totalShares',
            comments: '$totalComments'
          }
        },
        totalEvents: { $sum: '$count' },
        totalEngagement: { $sum: '$totalEngagement' }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Instance method to mark as processed
analyticsEventSchema.methods.markAsProcessed = function() {
  this.processed = true;
  return this.save();
};

export default mongoose.model('AnalyticsEvent', analyticsEventSchema);
