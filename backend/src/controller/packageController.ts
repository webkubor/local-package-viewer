import { promisify } from 'util';
import { exec as execCb } from 'child_process';

const exec = promisify(execCb);

interface PackageManager {
  type: 'yarn' | 'npm' | 'pnpm';
}

class PackageController {
  // 获取全局依赖列表
  async getGlobalDependencies(ctx: any) {
    try {
      const { type = 'yarn' } = ctx.query as PackageManager;
      console.log(`正在获取 ${type} 全局依赖列表...`);
      
      const command = {
        yarn: 'yarn global list --json',
        npm: 'npm list -g --depth=0 --json',
        pnpm: 'pnpm list -g --json'
      }[type];
      
      console.log(`执行命令: ${command}`);
      
      const { stdout, stderr } = await exec(command);
      
      // npm 命令即使成功也可能输出一些警告信息到 stderr
      if (stderr && type !== 'npm') {
        console.error(`命令执行出错: ${stderr}`);
        ctx.status = 500;
        ctx.body = { error: stderr };
        return;
      }
      
      // 确保 stdout 不为空
      if (!stdout || stdout.trim() === '') {
        console.error('命令执行成功但没有输出');
        ctx.status = 500;
        ctx.body = { error: '命令执行成功但没有输出' };
        return;
      }
      
      try {
        const data = JSON.parse(stdout);
        console.log(`成功解析 ${type} 依赖数据`);
        ctx.body = { dependencies: data };
      } catch (parseError: any) {
        console.error(`JSON解析错误: ${parseError}`);
        console.error(`原始输出: ${stdout}`);
        ctx.status = 500;
        ctx.body = { error: `无法解析JSON: ${parseError.message}`, stdout };
      }
    } catch (error: any) {
      console.error(`获取依赖列表失败: ${error.message}`);
      ctx.status = 500;
      ctx.body = { error: `无法获取依赖列表: ${error.message}` };
    }
  }

  // 删除全局包
  async removeGlobalPackage(ctx: any) {
    try {
      const { packageName } = ctx.params;
      const { type = 'yarn' } = ctx.query as PackageManager;
      
      const command = {
        yarn: `yarn global remove ${packageName}`,
        npm: `npm uninstall -g ${packageName}`,
        pnpm: `pnpm uninstall -g ${packageName}`
      }[type];

      const { stdout, stderr } = await exec(command);
      if (stderr) {
        ctx.status = 500;
        ctx.body = { error: stderr };
        return;
      }
      ctx.body = { message: `成功删除 ${packageName}`, output: stdout };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '删除包失败' };
    }
  }

  // 搜索包
  async searchPackage(ctx: any) {
    try {
      const { keyword } = ctx.query;
      const { type = 'yarn' } = ctx.query as PackageManager;
      
      const command = {
        yarn: `yarn info ${keyword} --json`,
        npm: `npm search ${keyword} --json`,
        pnpm: `pnpm search ${keyword} --json`
      }[type];

      const { stdout, stderr } = await exec(command);
      if (stderr) {
        ctx.status = 500;
        ctx.body = { error: stderr };
        return;
      }
      const data = JSON.parse(stdout);
      ctx.body = { packageInfo: data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '搜索包失败' };
    }
  }

  // 获取包详细信息
  async getPackageInfo(ctx: any) {
    try {
      const { packageName } = ctx.params;
      const { type = 'yarn' } = ctx.query as PackageManager;
      
      const command = {
        yarn: `yarn info ${packageName} --json`,
        npm: `npm view ${packageName} --json`,
        pnpm: `pnpm view ${packageName} --json`
      }[type];

      const { stdout, stderr } = await exec(command);
      if (stderr) {
        ctx.status = 500;
        ctx.body = { error: stderr };
        return;
      }
      const data = JSON.parse(stdout);
      ctx.body = data;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '获取包信息失败' };
    }
  }

  // 安装全局包
  async installGlobalPackage(ctx: any) {
    try {
      const { packageName, version } = ctx.request.body;
      const { type = 'yarn' } = ctx.query as PackageManager;
      
      const packageWithVersion = version ? `${packageName}@${version}` : packageName;
      const command = {
        yarn: `yarn global add ${packageWithVersion}`,
        npm: `npm install -g ${packageWithVersion}`,
        pnpm: `pnpm add -g ${packageWithVersion}`
      }[type];

      const { stdout, stderr } = await exec(command);
      if (stderr) {
        ctx.status = 500;
        ctx.body = { error: stderr };
        return;
      }
      ctx.body = { message: `成功安装 ${packageWithVersion}`, output: stdout };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '安装包失败' };
    }
  }
}

export default new PackageController(); 