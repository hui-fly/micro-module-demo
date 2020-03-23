import ApiInfo from './ApiInfo.js';
// import util from '@/common/js/util';
const author = '陈龙';

class QukanApiInfo extends ApiInfo {
    // 声明接口类
    constructor ({ path, type = 'get', timeout = 25 * 1000, headers, project = 'task', author = '陈龙' }) {
        super({
            path,
            type,
            timeout,
            headers,
            project,
            author
        });
    }
}

export default {
    getTaskList: new QukanApiInfo({
        path: '/admin/task_list',
        type: 'get',
        author
    }),
    editTask: new QukanApiInfo({
        path: '/admin/task_edit',
        type: 'post',
        author,
        headers: {
            post: {
                'Content-Type': 'application/json'
            }
        }
    }),
    addTask: new QukanApiInfo({
        path: '/admin/task_create',
        type: 'post',
        author,
        headers: {
            post: {
                'Content-Type': 'application/json'
            }
        }
    }),
    delTask: new QukanApiInfo({
        path: '/admin/task_delete',
        type: 'post',
        author
    }),
    getRecord: new QukanApiInfo({
        path: '/admin/task_log',
        type: 'get',
        author
    }),
    getRecordY: new QukanApiInfo({
        path: '/853/v1/admin/task_log',
        type: 'get',
        author,
        project: 'YApi'
    })
};
