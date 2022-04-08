import axios from 'axios'
// import process from 'process'

let instance = axios.create({
    baseURL: import.meta.env.VITE_APP_QUOTATION_HOST,
    timeout: 15000, // 请求超时时间
    // headers: {'X-Auth-Token': 'Dzz Token'} 
});

// axios.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use(function (config) {   

    let token = ''
    if (process.env.NODE_ENV == 'development') {
        token = '915eb99f-e90f-497c-b84c-00feaa0a6b71'
        // 915eb99f-e90f-497c-b84c-00feaa0a6b71
        // bddb5088-6ac5-4cc9-8937-179b16005798
    } else {
        let query = location.search.substring(1)
        let vars = query.split("&")
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=")

            if (pair[0] == 'Authorization') {
                token = pair[1]
            }
        }
    }
    config.headers.Authorization = token;
    config.headers.token = token;



    // 发送请求之前
    return config;

}, function (error) {
    // 请求错误时
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 处理响应数据
    if (response.status === 200) {
        let result

        let data = response.data;
        if (data.code == 1) {
            result = {
                code: 1,
                data: data.data
            };
        } else {
            result = {
                code: -1,
                data: data,
                message: data.message
            };
        }
        // else if (response.statusText == 'OK') {
        //     result = {
        //         code: 1,
        //         data: data
        //     };
        // }



        return result;
    } else if (response.status === -200) {
        return response.statusText;
    } else if (response.status === 401) {



    }
}, function (error) {
    // 请求错误时
    return Promise.reject(error);
});

export default instance