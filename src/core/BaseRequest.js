/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 周洋
 * @Date: 2019-08-15 19:09:42
 * @LastEditors: 周洋
 * @LastEditTime: 2019-08-31 13:27:26
 */
/**
 * 异步请求基类
 */
import axios from 'axios';
import q from 'q';
import qs from 'qs';

// 设置默认请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

class BaseRequest {
    send (
        {
            url,
            type = 'get', // 请求方法： 默认get
            timeout = 10000, // 超时： 默认10s
            headers = {} // 请求头
        },
        body = {}
    ) {
        let options = {
            url: url,
            method: type.toLocaleLowerCase(),
            timeout: timeout,
            headers: headers,
            transformResponse: [
                function (data) {
                    return JSON.parse(data.replace(/:(\d{17,})/g, `:"$1"`));
                }
            ]
        };
        // 根据请求方法，处理参数
        try {
            // 处理 post 参数格式
            if (options.method === 'post') {
                if (!options.headers.post) {
                    options.headers.post = {};
                }
                let contentType =
                    options.headers.ContentType || options.headers.contentType || options.headers.post['Content-Type'];
                if (contentType && contentType.toLocaleLowerCase() === 'application/json') {
                    // json post处理
                    options.data = JSON.stringify(body);
                } else if (contentType && contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
                    options.data = qs.stringify({ ...body }, { indices: false });
                } else {
                    // 普通post处理
                    options.data = qs.stringify(body);
                }
            } else if (options.method === 'get') {
                // get请求使用params参数
                options.params = body;
            } else {
                options.data = body;
            }
            // 发出请求
            return q.resolve(axios(options));
        } catch (e) {
            // 抛出异常
            q.reject(e);
            // console.log(e);
        }
    }
}

export default BaseRequest;
