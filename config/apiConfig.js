module.exports = {
    project: '119', // 项目鉴权project, 测试用 md-admin
    title: '统一运营平台XXX模块', // 项目名称
    production: { 
        task: {
            'default': "xxx.com/"
        }
    },
    preview: { // 预发布环境
        task: {
            'default': "xxx.com/"
        }
    },
    development: { // 测试环境
        YApi: {
            'default': '//'
        },
        task: {
            'default': "xxx.com/"
        }
    }
}