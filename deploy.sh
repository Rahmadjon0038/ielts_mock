#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="ielts_mock"
PORT="${PORT:-4012}"
ENV_FILE="${ENV_FILE:-.env.production}"
CLEANUP_ENV=""

if [ ! -f "${ENV_FILE}" ]; then
  echo "Env file '${ENV_FILE}' topilmadi, bo'sh env bilan ishga tushuryapman."
  CLEANUP_ENV="$(mktemp)"
  ENV_FILE="${CLEANUP_ENV}"
  touch "${ENV_FILE}"
else
  echo "Env file ishlatiladi: ${ENV_FILE}"
fi

export PORT ENV_FILE

echo "docker compose orqali build va run (${PROJECT_NAME})..."
docker compose -p "${PROJECT_NAME}" up -d --build --remove-orphans

if [ -n "${CLEANUP_ENV}" ] && [ -f "${CLEANUP_ENV}" ]; then
  rm -f "${CLEANUP_ENV}"
fi

echo "Container ishga tushdi: http://localhost:${PORT}"
