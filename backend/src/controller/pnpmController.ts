import { promisify } from 'util';
import { exec as execCb } from 'child_process';

const exec = promisify(execCb);

const getGlobalDependenciesPnpm = async (ctx: any) => {
  try {
    console.log('/pnpm/global', "getGlobalDependencies", ctx.query);
    const { stdout, stderr } = await exec('pnpm list -g --depth=0 --json');
    if (stderr) {
      ctx.status = 500;
      ctx.body = { error: stderr };
      return;
    }

    const data = JSON.parse(stdout);
    ctx.body = { dependencies: data.dependencies };
  } catch (error) {
    console.error('Error fetching global pnpm dependencies:', error);
    ctx.status = 500;
    ctx.body = { error: '无法获取pnpm依赖列表' };
  }
};

export default { getGlobalDependenciesPnpm };