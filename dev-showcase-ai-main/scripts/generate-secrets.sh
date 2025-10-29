#!/bin/bash
# Generate secure secrets for ShowWork production environment
# Usage: ./generate-secrets.sh

echo "🔐 Generating secure secrets for ShowWork production..."
echo ""
echo "=========================================="
echo "SESSION_SECRET:"
openssl rand -base64 32
echo ""
echo "=========================================="
echo "JWT_SECRET:"
openssl rand -base64 32
echo ""
echo "=========================================="
echo "✅ Copy these values to your .env.production file"
echo "✅ Also add them to Render Dashboard > Environment Variables"
echo ""
