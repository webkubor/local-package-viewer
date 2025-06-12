// backend/src/app.ts
import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import packageRoutes from './routes/package';
import { createServer } from 'http';

const app = new Koa();

// 中间件
app.use(cors());
app.use(bodyParser());

// 欢迎路由
app.use(async (ctx, next) => {
  if (ctx.path === '/') {
    ctx.body = 'Hello, welcome to localpackageviewer!';
  } else {
    await next();
  }
});

// 使用包管理路由
app.use(packageRoutes.routes());
app.use(packageRoutes.allowedMethods());

// 设置端口并处理端口占用情况
const startServer = (initialPort: number) => {
  let currentPort = initialPort;
  const maxAttempts = 10; // 最多尝试10个端口
  let attempts = 0;
  
  const tryListen = () => {
    const server = createServer(app.callback());
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
        console.log(`端口 ${currentPort} 已被占用，尝试使用端口 ${currentPort + 1}`);
        currentPort += 1;
        attempts += 1;
        tryListen();
      } else {
        console.error('启动服务器失败:', err);
      }
    });
    
    server.listen(currentPort, () => {
      console.log(`服务器成功启动，运行于 http://localhost:${currentPort}`);
    });
  };
  
  tryListen();
};

const initialPort = parseInt(process.env.PORT || '5200', 10);
startServer(initialPort);