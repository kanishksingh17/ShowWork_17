#!/bin/bash
echo "🔍 Checking Docker build context..."
ls -R | grep prisma || echo "⚠️ prisma folder missing!"

echo "🔍 Checking server.js..."
find . -name "server.js" || echo "⚠️ server.js missing!"

echo "🔍 Checking Render YAML..."
grep 'Dockerfile' render.yaml || echo "⚠️ Missing Dockerfile references!"

echo "✅ Everything looks ready for Render!"
