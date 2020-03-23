/**
 * 统一请求类
 */
import BaseRequest from './BaseRequest';
import ApiDomain from './ApiDomain';
import ewxLoginSDK from '@qtt/ewx-login-sdk';
class QuRequest extends BaseRequest {
    constructor () {
        super();
        this.apiDomain = new ApiDomain();
    }

    queryParse (url) {
        let dic = {};
        url = url || location.search.slice(1);
        let array = url.split('&');
        for (let i = 0, len = array.length; i < len; i++) {
            let params = array[i].split('=');
            if (params[0]) {
                dic[decodeURIComponent(params[0])] = decodeURIComponent(params[1]);
            }
        }
        return dic;
    }

    // 基类请求
    nativeSend (api, data = {}, headers = {}) {
        data = Object.assign(
            {
                token: ewxLoginSDK.getToken({ isPerm: true }),
                dtu: 200
            },
            data
        );

        // project透传
        if (api.project === 'perm') {
            data.project = 'perm';
        }
        const header = Object.assign(headers, api.headers);
        return super
            .send(
                {
                    url: api.url,
                    type: api.type,
                    timeout: api.timeout,
                    headers: header
                },
                data
            )
            .then(response => this.responseInterceptor(response, api), error => this.errorInterceptor(error));
    }

    // 普通请求
    send (api, data = {}, headers = {}) {
        let url = this.apiDomain.getUrl(api);
        return this.nativeSend(
            {
                url: url,
                type: api.type,
                timeout: api.timeout,
                headers: api.headers,
                author: api._author || '',
                project: api.project
            },
            data,
            headers
        );
    }
    // 返回处理
    responseInterceptor (response, api) {
        let res = response.data;
        // TODO
        const rules = {
            '0': res => {
                return res;
            },
            '-2101': () => {
                return res;
            },
            '-126': () => {
                // location.href='/#/login'
            }
        };
        if (rules[res.code + '']) {
            return rules[res.code + ''](res);
        }
        // not define code throw error
        /* eslint-disable no-throw-literal */
        throw {
            message: `请求失败code: ${res.code}, message: ${res.message || '未知原因'}，接口开发者：${api.author}`,
            stack: new Error().stack,
            code: res.code
        };
        /* eslint-enable no-throw-literal */
    }
    // 异常处理
    errorInterceptor (error) {
        let status = 0;
        if (error.response) {
            status = error.response.status;
        } else if (error.request) {
            status = error.request.status;
        }
        throw new Error(`网络错误 [ ${status} ] ${error.message} `);
    }

    // 获取鉴权项目
    getProject () {
        return this.apiDomain.getProject();
    }

    // 获取分支map
    getBranch () {
        return this.apiDomain.getBranchMap();
    }

    // 是否生产环境
    isProduct () {
        return this.apiDomain.isProduct();
    }

    // 获取项目名称
    getProjectTitle () {
        return this.apiDomain.getProjectTitle();
    }
}

export default QuRequest;
