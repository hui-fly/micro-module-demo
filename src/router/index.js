import List from '../views/List.vue';
export default {
    mode: 'history', // history 模式下, nginx 不配置的话, 浏览器刷新会404, 所以采用 hash
    base: window.BASE_ROUTE,
    routes: [
        {
            path: '/test',
            redirect: '/test/list',
            component: List
        },
        {
            name: 'List',
            path: '/test/list',
            component: List
        }
    ]
};
