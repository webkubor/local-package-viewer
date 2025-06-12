import fly from "flyio";

// 直接设置后端API的基础URL为5201端口
fly.config.baseURL = 'http://localhost:5201'

// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
  return request;
});

// 添加响应拦截器
fly.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response.data;
  },
  (error: any) => {
    // 对响应错误做些什么
    // flyio 的错误对象结构与标准 Error 不同
    let status = 0;
    
    // 安全地检查错误对象结构
    if (error && typeof error === 'object') {
      if (error.response && typeof error.response === 'object' && 'status' in error.response) {
        status = error.response.status;
      } else if ('status' in error) {
        status = error.status;
      }
    }
    
    if (status === 401) {
      // 未授权，可以在这里处理登出逻辑
      localStorage.removeItem('token');
      // 可以添加重定向到登录页面的逻辑
    }
    return Promise.reject(error);
  }
);

export default fly;
