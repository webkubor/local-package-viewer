import fly from "flyio";

// 创建一个函数来获取后端API的基础URL
const getBaseUrl = () => {
  // 从环境变量中获取API URL，如果没有则使用默认值
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) return apiUrl;
  
  // 如果没有环境变量，尝试自动检测后端端口
  // 默认使用5200端口，如果不可用则尝试5201
  return 'http://localhost:5201';
};

fly.config.baseURL = getBaseUrl()

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
    // flyio 的错误对象结构与标准 Error 不同，需要正确处理
    const status = error.response ? error.response.status : error.status;
    
    if (status === 401) {
      // 未授权，可以在这里处理登出逻辑
      localStorage.removeItem('token');
      // 可以添加重定向到登录页面的逻辑
    }
    return Promise.reject(error);
  }
);

export default fly;
