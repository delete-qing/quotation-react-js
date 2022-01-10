import React, { Component, useState } from 'react';
import { Table, Button, Select, message, Input, Form, InputNumber, Typography } from 'antd';
import http from '../../../http/index'
import api from '../../../http/httpApiName'

const originData = [];
for (let i = 0; i < 10; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <span>
                    {inputNode}
                </span>
            ) : (
                children
            )}
        </td>
    );
};



const EditableTable = () => {
    const [form] = Form.useForm();

    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: '产品名称',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'age',
            dataIndex: 'age',
            width: '15%',
            editable: true,
        },
        {
            title: 'address',
            dataIndex: 'address',
            width: '40%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                    </span>
                ) : (
                    <Typography.Link onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];


    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                pagination={false}
            />
        </Form>
    );
};

// =================
class init extends Component {

    state = {
        columnsPro: [
            {
                title: '产品名称',
                dataIndex: 'name',
                editable: true,
            },
            {
                title: '产品编号',
                dataIndex: 'number',
                editable: true,
            },
            {
                title: '产品规格',
                dataIndex: 'specification',
                editable: true,
            },
            {
                title: '产品单位',
                dataIndex: 'unit',
                editable: true,
            },
            {
                title: '编辑',
                render: (text, record, index) => (
                    <div>

                    </div >
                )
            },
        ],
        proList: [],


        editArr: [],
    }

    componentDidMount() {
        this.getShowData()
    }
    // 报价单详情
    getShowData(id) {
        http.get(api.quoteGet, {
            params: {
                id: 6
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.getQuotationOrder(data.inquiry_order_id)
                this.setState({
                    showData: data,

                })
            } else {
                message.warning(res.message)
            }
        })
    }
    // 询价单详情
    getQuotationOrder(id) {
        http.get(api.productList + id + '/product/list').then(res => {
            if (res.code == 1) {
                let data = res.data.items.filter(e => {
                    e.check_price_order_details = e.check_price_order_details.filter(i => {
                        i.show = 0
                        return true
                    })
                    return true
                })
                this.setState({
                    proList: [...data]
                })
            } else {
                message.warning(res.message)
            }
        })

    }



    // 渲染出来input,输入的时候改变dataSource的数据
    renderInput = (text, record, index, field) => {
        const { editArr } = this.state;
        return record.edit ? (
            <Input
                value={
                    editArr[index] && editArr[index][field]
                        ? editArr[index][field]
                        : record[field]
                }
                onChange={(e) => this.inputChange(e, record, index, field)}
            />
        ) : (
            text
        );
    };

    // 编辑表格
    edit = (record, index) => {
        const { proList } = this.state;
        // 浅拷贝下数据
        const newArr = [...proList];
        // 找到index的值
        // 利用splice方法删除原数据，新增新数据
        newArr.splice(index, 1, { ...record, edit: true });
        // 注意：一开始写法是const arr = newArr.splice(index, 1, { ...record, ...{ edit: true } });是错的，因为这个方法返回的是删除的那一条值
        this.setState({ proList: newArr });
    };

    // input改变的时候
    inputChange = (e, record, index, field) => {
        let { editArr } = this.state;
        editArr[index] = record;
        record[field] = e.target.value;
        this.setState({ editArr });
    };

    // 单条保存
    handleSave = (record, index) => {
        const { editArr, proList } = this.state;
        const newData = [...proList];
        // 用splice不改变原来的数组顺序
        newData.splice(index, 1, {
            ...record,
            ...editArr[index],
            edit: false,
        });
        this.setState({ proList: newData });
    };





    render() {
        const { proList, columnsPro } = this.state


        const columns = [
            {
                title: "姓名",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "年龄",
                dataIndex: "customer_number",
                key: "customer_number",
                render: (text, record, index) =>
                    this.renderInput(text, record, index, "customer_number"),
            },
            {
                title: "住址",
                dataIndex: "number",
                key: "number",
                render: (text, record, index) =>
                    this.renderInput(text, record, index, "number"),
            },
            {
                title: "操作",
                dataIndex: "edit",
                key: "edit",
                render: (text, record, index) => {
                    return !record.edit ? (
                        <span
                            style={{ color: "black", cursor: "pointer" }}
                            onClick={() => this.edit(record, index)}
                        >
                            编辑
                        </span>
                    ) : (
                        <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => this.handleSave(record, index)}
                        >
                            单条保存
                        </span>
                    );
                },
            },
        ];

        return (
            <div>
                <div className="mb-15">
                    <Table rowKey={record => record.id} columns={columnsPro} dataSource={proList}
                        bordered title={() => '询价产品'} pagination={false} />
                </div>
                <EditableTable />

                <Table
                    rowKey={(record) => record.id}
                    dataSource={this.state.proList}
                    columns={columns}
                />


            </div >
        );
    }
}

export default init;