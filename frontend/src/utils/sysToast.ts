import { useToast } from 'primevue/usetoast';

// 创建全局 Toast 对象
function sysToast() {
  const toast = useToast();
  return {
    success(title: string, message: string, life: number = 3000) {
      toast.add({ severity: 'success', summary: title, detail: message, life: life });
    },
    error(title: string, message: string, life: number = 3000) {
      toast.add({ severity: 'error', summary: title, detail: message, life: life });
    },
    info(title: string, message: string, life: number = 3000) {
      toast.add({ severity: 'info', summary: title, detail: message, life: life });
    },
    warn(title: string, message: string, life: number = 3000) {
      toast.add({ severity: 'warn', summary: title, detail: message, life: life });
    },
  };
}

// 使用 setup 中初始化
export function initToast() {
  if (!window.$toast) {
    window.$toast = sysToast();
    window.$logger.success('系统提示', 'Toast 初始化成功');
  }
}