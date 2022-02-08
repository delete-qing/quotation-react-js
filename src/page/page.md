# 关于封装

[公共方法](../../public/common.jsx)

-   关于封装 首先这个方法用到的地方很多 导致的代码冗余

-   这些方法 没有很复杂

-   注意暴露方法

# 关于判断总结

## 关于条件判断显示操作的方法

-   方法一
    -   定义一个变量 然后 return 出去 这个是和判断多个条件 这个是最实用的

```js
render: (text, record) => {
    let flag;
    if (record.status == 2) {
        flag = <a onClick={() => this.goDistribute(record)}>分配</a>;
    } else {
        flag = <a style={{ color: "#ccc" }}>分配</a>;
    }
    return (
        <>
            {flag}
            <Divider type="vertical" />
            <a style={{ color: "red" }}>删除</a>
        </>
    );
};
```

-   方法二

    -   这个是三元运算符的判断 具体用法可查看官网的条件语句
        但是这个这个只是用于有一个的判断条件

    ```js
    {
        showData.delivery_address != null && (
            <>
                {showData.delivery_address.country}
                {showData.delivery_address.province}
            </>
        );
    }
    ```

-   方法三
    -   这里是 html 里面直接写的判断 这个只能说还好了 反正后面的的我应该不会用这种了
        因为看起来代码好臃肿

```js
    <div>
        {
        inquiryList.map((e, index) => {
        if (e.is_single_choice) {
            return (
                <div className="inquiry-block" key={index}>
                    3213
                </div>
            );
        } else {
            return (
                <div className="inquiry-block" key={index}>
                    46546
                </div>
            );
        }
        });
        }
 </div>

```

-   方法四

    -   这是写在表格中的自执行函数/匿名函数 但是这样很麻烦 强烈不推荐  
        这个是我刚开始学的时候用的

    ```js
    {
        (() => {
            if (record.status == 2 || record.status == 3) {
                return (
                    <>
                        <a onClick={() => this.goPeConfig(record)}>PE配置</a>
                    </>
                );
            } else {
                return (
                    <>
                        <a style={{ color: "#ccc" }}>PE配置</a>
                    </>
                );
            }
        })();
    }
    ```

-   方法五
-   这个是写在 render 下面的 这个写起来简单 代码看起来也是简单易懂的
    首先 let 一个变量 根据条件判断 let 变量的显示

```js
// 准备时长
let standardPrepareTime;
if ((status == 5 || status == 6) && showListData.flag == 1) {
    standardPrepareTime = (
        <>
            {isStandardPrepareTime == 1 && (
                <>
                    {showListData.standard_prepare_time}
                    <EditTwoTone onClick={() => this.changeFormatQutity("standard_prepare_time")} />
                </>
            )}
            {isStandardPrepareTime == 2 && (
                <>
                    <Input
                        className="w200"
                        name="standard_prepare_time"
                        value={showListData.standard_prepare_time}
                        onChange={this.isUnitFormatQuantity}
                        onBlur={() => this.changeFormatQutity("standard_prepare_time")}
                    />
                </>
            )}
        </>
    );
} else {
    standardPrepareTime = <>{showListData.standard_prepare_time}</>;
}
```

# page 遇到的问题

### 1. 首先我遇到的最大的坑 也是最不可思议的 💢💢

气愤指数直达十颗星 想了 n 多种方式

#### 问题描述：表格输入框本地运行、本地打包运行、输入框和改变输入框的值都跑的很快 没有一点问题， 但是 ❗ 但是 ❗ 但是 ❗😤 就是推到线上不行 一分钟了输入框显示了 一分钟了输入框改变了一个数字 这个问题整整困扰我了好几天

-   解决：把 columns 放到 render 里面执行 不要放在 state 里面执行 我百度了下说是两个运行的机制不一样 我的理解是 state 是只有数据改变才会触发 render 渲染 但是我想不明白的是这样话这个问题就不是渲染的慢的问题而是就不渲染

### 2. 表格问题

#### 问题描述：

-   我本想拿到当条数据里面的一个对象 但是拿不到报错 只有拿对象的指定属性值才行 react 是不支持显示整个对象的

#### 注意：🚩

1. 如果不进行数组/对象为 undfind/null 判断会报错

2. 表格的 key 值 columns 如果没有声明 key 值，name 可以用 rowKey={record => record.id}

```js
<Table rowKey={(record) => record.id} columns={columns} dataSource={this.state.dataList} />
```

3. 如果有循环那么一定要判断这个数组长度是不是为 0 不为 0 的时候才循环 并且一定不要忘记写 key 值 不然烦死你

# 知识点

1. 输入框事件 onchange 可以多个输入框用一个方法

    - 首先在 input 定义一个 name 值 然后在方法中获取 name 值 根据 name 改变 set 那个数据

```html
<Input name="customer_representative_name" onChange={this.handleChangeTelephone} style={{ width: 200 }}
placeholder="请输询价人员" />
```

```js
handleChangeTelephone = (e) => {
    const { saveData } = this.state;
    saveData[e.target.name] = e.target.value;
    this.setState({ saveData });
};
```

2. 判断类型要这样

```js
if (typeof id === "undefined") {
    _id = pageId;
    url = api.productCreate;
    params.attaches = fList;
}
```

3. 文件上传 这次用的是组件 具体可查看上传 🍀🍀🍀🍀🍀  
   下载的话就就直接下载地址一个 a 链接下载就好了，具体的百度 网上 a 链接下载 就随便搜搜就有了
