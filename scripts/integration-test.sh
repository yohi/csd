#!/bin/bash
set -e

# Claude Subscription Gateway Integration Test Script

# 1. 環境設定
export CSG_ENCRYPTION_KEY="test-encryption-key-must-be-long-enough-123456"
export CSG_PORT=4001
export CSG_LOG_LEVEL=info
export NODE_ENV=test

# 色の定義
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting integration test...${NC}"

# 2. プロジェクトのビルド
echo "Building project..."
npm run build

# 3. サーバーの起動 (バックグラウンド)
echo "Starting server on port $CSG_PORT..."
npm run start &
SERVER_PID=$!

# 終了時のクリーンアップ関数
cleanup() {
  echo -e "\n${GREEN}Cleaning up...${NC}"
  if [ -n "$SERVER_PID" ]; then
    kill $SERVER_PID 2>/dev/null || true
  fi
}
trap cleanup EXIT

# 4. ヘルスチェックが通るまで待機
echo "Waiting for server to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until curl -s http://localhost:$CSG_PORT/health > /dev/null; do
  sleep 1
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo -e "${RED}Error: Server failed to start within $MAX_RETRIES seconds.${NC}"
    exit 1
  fi
done

echo -e "${GREEN}Server is up and running!${NC}"

# 5. 各エンドポイントの検証

# Test /health
echo -n "Testing /health endpoint... "
HEALTH_RES=$(curl -s http://localhost:$CSG_PORT/health)
if [[ $HEALTH_RES == *"\"status\":\"ok\""* ]]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC}"
  echo "Response: $HEALTH_RES"
  exit 1
fi

# Test /v1/models
echo -n "Testing /v1/models endpoint... "
MODELS_RES=$(curl -s http://localhost:$CSG_PORT/v1/models)
if [[ $MODELS_RES == *"\"object\":\"list\""* ]] && [[ $MODELS_RES == *"\"data\""* ]]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC}"
  echo "Response: $MODELS_RES"
  exit 1
fi

# Test /v1/messages (Basic Routing Test)
# 注: トークンがないため、通常は 401 Unauthorized または 500 (トークンファイル不在時) を期待します。
# ルーティングが機能していることを確認するのが目的です。
echo -n "Testing /v1/messages endpoint (routing check)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:$CSG_PORT/v1/messages \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100,
    "stream": false
  }')

# 401 (Unauthorized) または 500 (Token file not found) なら、ハンドラーには到達している
if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "500" ] || [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}PASS${NC} (HTTP $HTTP_CODE)"
else
  echo -e "${RED}FAIL${NC} (HTTP $HTTP_CODE)"
  exit 1
fi

echo -e "\n${GREEN}All integration tests passed successfully!${NC}"
