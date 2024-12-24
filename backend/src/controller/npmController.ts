import { promisify } from 'util';
import { exec as execCb } from 'child_process';

const exec = promisify(execCb);

const getGlobalDependenciesNpm = async (ctx: any) => {
  try {
    console.log('/npm/global', "getGlobalDependencies", ctx.query);
    const { stdout, stderr } = await exec('npm list -g --depth=0 --json');

    if (stderr) {
      ctx.status = 500;
      ctx.body = { error: stderr };
      return;
    }

    // 解析 JSON 输出并返回
    const data = JSON.parse(stdout);
    ctx.body = { dependencies: data.dependencies };
  } catch (error) {
    console.error('Error fetching global dependencies:', error);
    ctx.status = 500;
    ctx.body = { error: '无法获取依赖列表' };
  }
};

export default { getGlobalDependenciesNpm };