// backend/src/app.ts
import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import npmController from './controller/npmController';
import yarnController from './controller/yarnController';
import pnpmController from './controller/pnpmController';

const app = new Koa();
const router = new Router();

// 启用 CORS 支持，解决前后端跨域问题
app.use(cors());

// 设置路由
router.get('/', 
  async (ctx: any) => {
    ctx.body = 'Hello, welcome to localpackageviewer!';
  }
);

router.get('/npm/global', npmController.getGlobalDependenciesNpm);
router.get('/yarn/global', yarnController.getGlobalDependenciesYarn);
router.get('/pnpm/global', pnpmController.getGlobalDependenciesPnpm);

// 使用路由
app.use(router.routes()).use(router.allowedMethods());

// 设置端口
const port = 3000;
app.listen(port, () => {
  console.log(`Koa server is running at http://localhost:${port}`);
});