module.exports = {
    project: '119', // 项目鉴权project, 测试用 md-admin
    title: '统一运营平台XXX模块', // 项目名称
    production: { // 生产环境
        qukan: { // 接口1project
            'default': '//api.1sapp.com/' // 默认分支
        },
        perm: { // 接口2project
            'default': '//api.perm.1sapp.com/'
        },
        task: {
            'default': "http://admin-coin-task-server.1sapp.com/"
        }
    },
    preview: { // 预发布环境
        qukan: {
            'default': '//pre.api.1sapp.com/'
        },
        perm: {
            'default': '//api.perm.1sapp.com/'
        },
        task: {
            'default': "http://admin-coin-task-server.1sapp.com/"
        }
    },
    development: { // 测试环境
        qukan: {
            'default': '//test-api.qukan.qttcs3.cn/',
            '1': '//test1-api.qukan.qttcs3.cn/' // 测试分支1
        },
        perm: {
            'default': '//test-api.qukan.perm.qttcs3.cn/',
            // 'default': '//api.perm.1sapp.com/'
        },
        YApi: {
            'default': '//rd-yapi.qutoutiao.net/mock/'
        },
        task: {
            'default': "http://qa-coin-services-task.qttcs3.cn/"
        }
    }
}