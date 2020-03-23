import Cookies from 'js-cookie';

let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = 'yyyy-MM-dd';
const QU_LOCAL_PERMS = 'qu_local_perms';
const project = 'md-admin';

const TOKEN_KEY = 'ewx-perm-token';

function padding (s, len) {
    len = len - (s + '').length;
    for (let i = 0; i < len; i++) {
        s = '0' + s;
    }
    return s;
}

export default {
    getToken () {
        const token = Cookies.get(TOKEN_KEY);
        if (token) return token;
        else return false;
    },
    getQueryStringByName (name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        let context = '';
        if (r != null) context = r[2];
        reg = null;
        r = null;
        return context === null || context === '' || context === 'undefined' ? '' : context;
    },
    formatDate: {
        format (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                case 'y':
                    return padding(date.getFullYear(), $0.length);
                case 'M':
                    return padding(date.getMonth() + 1, $0.length);
                case 'd':
                    return padding(date.getDate(), $0.length);
                case 'w':
                    return date.getDay() + 1;
                case 'h':
                    return padding(date.getHours(), $0.length);
                case 'm':
                    return padding(date.getMinutes(), $0.length);
                case 's':
                    return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse (dateString, pattern) {
            let matchs1 = pattern.match(SIGN_REGEXP);
            let matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length === matchs2.length) {
                let _date = new Date(1970, 0, 1);
                for (let i = 0; i < matchs1.length; i++) {
                    let _int = parseInt(matchs2[i]);
                    let sign = matchs1[i];
                    switch (sign.charAt(0)) {
                    case 'y':
                        _date.setFullYear(_int);
                        break;
                    case 'M':
                        _date.setMonth(_int - 1);
                        break;
                    case 'd':
                        _date.setDate(_int);
                        break;
                    case 'h':
                        _date.setHours(_int);
                        break;
                    case 'm':
                        _date.setMinutes(_int);
                        break;
                    case 's':
                        _date.setSeconds(_int);
                        break;
                    }
                }
                return _date;
            }
            return null;
        }
    },
    getUrlSearch () {
        let search;

        let items;

        let item;

        let name;

        let value;

        let args = {};
        search = location.search.length > 0 ? location.search.substring(1) : null;
        items = search ? search.split('&') : '';
        for (let i = 0, len = items.length; i < len; i++) {
            item = items[i].split('=');
            name = decodeURIComponent(item[0]);
            value = (item[1] || '').replace(/(.*)%$/, (match, $1) => {
                return $1 + encodeURIComponent('%');
            });
            value = decodeURIComponent(value || '');
            if (name.length > 0) {
                // 防止为空的参数比如说(?page=2&=invalidParam)
                args[name] = value;
            }
        }
        return args;
    },
    getPermUrl: function permUrl (menu = [], uris = []) {
        menu.forEach(menuItem => {
            let { meta = {} } = menuItem;
            if (meta.api) {
                let appId;
                try {
                    appId = window.localStorage.getItem('appId');
                } catch (e) {}
                meta.api.forEach(perm => {
                    uris.push(`${project}::/app_${appId}${perm}`);
                });
            }
            if (menuItem.children) {
                permUrl(menuItem.children, uris);
            }
        });
        return uris;
    },
    savePermApi (perms) {
        localStorage.setItem(QU_LOCAL_PERMS, JSON.stringify(perms));
    },
    checkPermApi (map) {
        let localPerms = [];
        try {
            localPerms = JSON.parse(localStorage.getItem(QU_LOCAL_PERMS)) || [];
        } catch (err) {}

        map.forEach(item => {
            if (item.children) {
                item.children.forEach(child => {
                    let apiList = child.meta.api || [];
                    let isHidden = true;
                    for (let i = 0, len = apiList.length; i < len; i++) {
                        let uri = apiList[i];
                        let key = `${project}::/app_${this.getId()}${uri}`;
                        if (localPerms[key] && localPerms[key].has === 1 && child.meta.hidden === false) {
                            isHidden = false;
                        } else {
                            isHidden = true;
                            break;
                        }
                        // // console.log(key, isHidden);
                    }
                    child.meta.hidden = isHidden;
                });
            }
        });
        return map;
    },
    validatePermission (paths) {
        let localPerms = [];
        try {
            localPerms = JSON.parse(localStorage.getItem(QU_LOCAL_PERMS)) || [];
        } catch (err) {}
        for (let item of paths) {
            const list = [];
            list.push(project + '::' + item);
            list.push(project + '::' + `/app_${this.getId()}${item}`);
            for (let key of list) {
                if (localPerms[key] && localPerms[key].has === 1) {
                    return true;
                }
            }
        }
        return false;
    },
    goBack (_this) {
        _this
            .$confirm('您的操作将不会保存，确定离开?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                _this.$router.go(-1);
            })
            .catch(() => {});
    },
    setTableHeight (_this, decContainerHeight, decTableHeight) {
        _this.$nextTick(() => {
            const home = document.querySelector('#test');
            if (!home) return;
            const wrapHeight = home.clientHeight;
            let container = _this.$refs.container;
            if (container) {
                container.style.height = wrapHeight - decContainerHeight + 'px';
            }
            _this.tableHeight = wrapHeight - decTableHeight;
            return _this.tableHeight;
        });
    },
    getStorageItem (key, value = {}) {
        try {
            const data = localStorage.getItem(key) || value;
            return JSON.parse(data);
        } catch (error) {
            return value;
        }
    },
    setStorageItem (key, value = {}) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    },
    // 拿到appId的值，默认为蛋蛋
    getId () {
        const id = this.getStorageItem('appId', -1);
        return id;
    },
    getTel () {
        return this.getStorageItem('info', {}).ldap_account;
    }
};
