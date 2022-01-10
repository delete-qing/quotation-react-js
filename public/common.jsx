import http from '../src/http/index'

// 获取id
const common = {
    getQueryVariable: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false)
    },

}

// 传路径
const pathData = {
    getPathData: function (path) {
        let env = process.env.NODE_ENV
        if (env == 'development') {
            path.history.push(path.path)
        } else {
            window.parent.postMessage(JSON.stringify(path.data), '*')
        }
    },

}

// 下载文件
const downFile = {
    down: function (id, storage_location) {
        http.get(import.meta.env.VITE_FILE_SERVICE_HOST + '/file/get_download_url', {
            params: {
                id: id,
                storage_location: storage_location
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                var link = document.createElement('a');
                //设置下载的文件名
                link.download = '文件';
                link.style.display = 'none';
                //设置下载路径
                link.href = data;
                //触发点击
                document.body.appendChild(link);
                link.click();
                //移除节点
                document.body.removeChild(link);
            } else {
                message.warning(res.message)
            }
        })
    },

}

// 克隆
const clone = {
    deepClone: function (obj) {
        var newObj = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === "object") {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = (obj && typeof obj[key] === 'object') ? clone.deepClone(obj[key]) : obj[key];
                }
            }
        }
        return JSON.stringify(newObj) == '{}' ? null : newObj;
    }
}



// 输入框




export default
    {
        common,
        pathData,
        downFile,
        clone
    }

