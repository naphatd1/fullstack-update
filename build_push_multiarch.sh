#!/bin/bash
set -e

# กำหนด Docker Hub username
DOCKERHUB_USERNAME="naphatd"

# กำหนดแท็กเวอร์ชัน
TAG="3.0.0"

# สร้างและใช้ builder ใหม่ (ถ้ายังไม่มี)
docker buildx create --name mybuilder --use || docker buildx use mybuilder
docker buildx inspect --bootstrap

echo "Building and pushing backend image..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t $DOCKERHUB_USERNAME/backend:$TAG \
  --push \
  ./backend

echo "Building and pushing frontend image..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t $DOCKERHUB_USERNAME/frontend:$TAG \
  --push \
  ./frontend

echo "All images built and pushed successfully!"
