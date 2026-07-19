#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

echo "Installing dependencies..."
pnpm install --prefer-frozen-lockfile --prefer-offline --loglevel debug --reporter=append-only

echo "Ensuring @tailwindcss/postcss is installed..."
pnpm add @tailwindcss/postcss --no-save

echo "Building the Next.js project..."
pnpm next build

echo "Build completed successfully!"
