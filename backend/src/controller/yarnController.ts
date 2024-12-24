import { promisify } from 'util';
import { exec as execCb } from 'child_process';

const exec = promisify(execCb);

// 获取 yarn 全局依赖
const getGlobalDependenciesYarn = async (ctx: any) => {
  try {
    console.log('/yarn/global', "getGlobalDependencies", ctx.query);
    const { stdout, stderr } = await exec('yarn global list --json');

    if (stderr) {
      ctx.status = 500;
      ctx.body = { error: stderr };
      return;
    }
    // `yarn global list --json` 返回的 JSON 会包含一个 `data` 字段，提取该字段中的依赖信息
    const data = JSON.parse(stdout);
    ctx.body = { dependencies: data.data };
  } catch (error) {
    console.error('Error fetching global yarn dependencies:', error);
    ctx.status = 500;
    ctx.body = { error: '无法获取yarn依赖列表' };
  }
};

export default { getGlobalDependenciesYarn };
