import fly from "flyio";


fly.config.baseURL = 'http://localhost:3000'

fly.interceptors.request.use((request) => {
    request.headers.Accept = "application/json";
    return request;
});

fly.interceptors.response.use(
    (response) => {
        let res = response.data;
        return Promise.reject(res);
    },

    (err) => {
        return Promise.reject(err);
    }
);

export default fly;
