import fly from '../utils/flyio';

interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, string>;
  size?: number;
  homepage?: string;
  license?: string;
}

interface InstallPackageParams {
  packageName: string;
  version?: string;
  type?: 'yarn' | 'npm' | 'pnpm';
}

export default {
  // 获取全局依赖列表
  getGlobalDependencies(type: string = 'yarn') {
    return fly.get(`/api/package/global?type=${type}`);
  },

  // 删除全局包
  removeGlobalPackage(packageName: string, type: string = 'yarn') {
    return fly.delete(`/api/package/global/${packageName}?type=${type}`);
  },

  // 搜索包
  searchPackage(keyword: string, type: string = 'yarn') {
    return fly.get(`/api/package/search?keyword=${keyword}&type=${type}`);
  },

  // 获取包详情
  getPackageInfo(packageName: string, type: string = 'yarn') {
    return fly.get<PackageInfo>(`/api/package/info/${packageName}?type=${type}`);
  },

  // 安装全局包
  installGlobalPackage({ packageName, version, type = 'yarn' }: InstallPackageParams) {
    return fly.post('/api/package/global', { packageName, version }, { params: { type } });
  }
}; 