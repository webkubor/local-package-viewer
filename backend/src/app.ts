// backend/src/app.ts
import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import packageRoutes from './routes/package';

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

// 设置端口
const port = process.env.PORT || 5200;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});