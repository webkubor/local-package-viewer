#!/bin/bash

# 定义颜色
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
NC="\033[0m" # 无颜色

# 启动前端服务
echo -e "${CYAN}Starting frontend...${NC}"
cd frontend || { echo -e "${RED}Failed to enter frontend directory!${NC}"; exit 1; }
pnpm install
pnpm run dev | awk '{print "[FRONTEND] " $0}' &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started successfully on PID: $FRONTEND_PID${NC}"

# 启动后端服务
echo -e "${CYAN}Starting backend...${NC}"
cd ../backend || { echo -e "${RED}Failed to enter backend directory!${NC}"; exit 1; }
pnpm install
pnpm run start | awk '{print "[BACKEND] " $0}' &
BACKEND_PID=$!
echo -e "${GREEN}Backend started successfully on PID: $BACKEND_PID (running on port 5200)${NC}"

# 捕获 Ctrl+C 停止脚本的信号
trap "echo -e '${RED}Stopping processes...${NC}'; kill $FRONTEND_PID $BACKEND_PID; exit" SIGINT

# 等待前端和后端进程完成
echo -e "${BLUE}Frontend and backend are running. Press Ctrl+C to stop.${NC}"
wait $FRONTEND_PID
wait $BACKEND_PID