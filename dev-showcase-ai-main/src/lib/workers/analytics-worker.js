// A worker that consumes analytics jobs and writes results to MongoDB
const { Worker } = require('bullmq');
const { queue } = require('../../config');
const { connect } = require('../../db/connection');
const AnalyticsEvent = require('../../models/AnalyticsEvent');
const AnalyticsAggregate = require('../../models/AnalyticsAggregate');

async function processJob(job) {
  // job.data should include { type: 'pageview'|'engagement', payload: {...} }
  const { type, payload, userId, portfolioId, projectId, platform = 'site' } = job.data;

  console.log(`📊 Processing analytics job: ${type}`, { userId, portfolioId, projectId });

  // Example processing logic — adapt to your spec
  const result = {
    userId,
    portfolioId,
    projectId,
    eventType: type,
    platform,
    meta: payload,
    ts: new Date(),
    processedAt: new Date(),
    summary: null
  };

  if (type === 'view' || type === 'pageview') {
    result.summary = {
      path: payload.path || '/',
      count: 1
    };
  } else if (type === 'engagement' || type === 'like' || type === 'share') {
    result.summary = {
      score: (payload.likes || 0) + (payload.shares || 0) * 2,
      engagement: payload.engagement || 0
    };
  }

  // Save to Mongo
  const analyticsEvent = await AnalyticsEvent.create(result);

  // Update aggregated metrics
  if (portfolioId) {
    const today = new Date().toISOString().split('T')[0];
    await AnalyticsAggregate.findOneAndUpdate(
      { portfolioId, day: today },
      { 
        $inc: { 
          [`counters.${type}s`]: 1,
          [`counters.views`]: type === 'view' ? 1 : 0,
          [`counters.likes`]: type === 'like' ? 1 : 0,
          [`counters.shares`]: type === 'share' ? 1 : 0,
          [`counters.clicks`]: type === 'click' ? 1 : 0,
          [`counters.downloads`]: type === 'download' ? 1 : 0
        } 
      },
      { upsert: true, new: true }
    );
  }

  return { eventId: analyticsEvent._id, summary: result.summary };
}

async function start() {
  await connect();
  
  const worker = new Worker('analytics', async (job) => {
    try {
      const out = await processJob(job);
      console.log('✅ Processed analytics job', job.id, out);
      return out;
    } catch (err) {
      console.error('❌ Analytics job failed', job.id, err);
      throw err;
    }
  }, { 
    connection: queue.connection, 
    concurrency: 5 
  });

  worker.on('failed', (job, err) => console.error('❌ Worker failed job', job.id, err));
  worker.on('completed', (job, res) => console.log('✅ Job completed', job.id));
  worker.on('error', (err) => console.error('❌ Worker error:', err));

  console.log('📊 Analytics Worker started and ready to process jobs');
}

if (require.main === module) {
  start().catch(err => {
    console.error('❌ Failed to start analytics worker:', err);
    process.exit(1);
  });
}

module.exports = { start, processJob };
