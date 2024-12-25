import fly from "flyio";

fly.config.baseURL = 'http://localhost:5200'

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
  (error) => {
    // 对响应错误做些什么
    if (error.status === 401) {
      // 未授权，可以在这里处理登出逻辑
      localStorage.removeItem('token');
      // 可以添加重定向到登录页面的逻辑
    }
    return Promise.reject(error);
  }
);

export default fly;
