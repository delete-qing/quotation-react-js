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
        }
    };

    const columns = [
        {
            title: '????????????',
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
                title: '????????????',
                dataIndex: 'name',
                editable: true,
            },
            {
                title: '????????????',
                dataIndex: 'number',
                editable: true,
            },
            {
                title: '????????????',
                dataIndex: 'specification',
                editable: true,
            },
            {
                title: '????????????',
                dataIndex: 'unit',
                editable: true,
            },
            {
                title: '??????',
                render: (text, record, index) => (
                    <div>

                    </div >
                )
            },
        ],
        proList: [],
        editArr: [],
        arr: [],
        dataArr: []
    }

    componentDidMount() {
        this.getShowData()
        this.addArr()
    }

    addArr() {
        let data = []
        let dataArr = []
        for (let i = 1; i < 201; i++) {
            if (i % 10 == 7 || i / 10 % 10 == 7 || i % 7 == 0) {
                console.log('i: ', i);
                data.push({
                    name: i,
                    color: 'red'
                })
            } else {
                data.push({
                    name: i,
                    color: ''
                })
            }

            dataArr.push(i)
        }
        this.setState({
            arr: data,
            dataArr
        })
    }
    // ???????????????
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
    // ???????????????
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
    // ????????????input,?????????????????????dataSource?????????
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

    // ????????????
    edit = (record, index) => {
        const { proList } = this.state;
        // ??????????????????
        const newArr = [...proList];
        // ??????index??????
        // ??????splice???????????????????????????????????????
        newArr.splice(index, 1, { ...record, edit: true });
        // ???????????????????????????const arr = newArr.splice(index, 1, { ...record, ...{ edit: true } });???????????????????????????????????????????????????????????????
        this.setState({ proList: newArr });
    };

    // input???????????????
    inputChange = (e, record, index, field) => {
        let { editArr } = this.state;
        editArr[index] = record;
        record[field] = e.target.value;
        this.setState({ editArr });
    };

    // ????????????
    handleSave = (record, index) => {
        const { editArr, proList } = this.state;
        const newData = [...proList];
        // ???splice??????????????????????????????
        newData.splice(index, 1, {
            ...record,
            ...editArr[index],
            edit: false,
        });
        this.setState({ proList: newData });
    };

    render() {
        const { proList, columnsPro, arr, dataArr } = this.state


        const columns = [
            {
                title: "??????",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "??????",
                dataIndex: "customer_number",
                key: "customer_number",
                render: (text, record, index) =>
                    this.renderInput(text, record, index, "customer_number"),
            },
            {
                title: "??????",
                dataIndex: "number",
                key: "number",
                render: (text, record, index) =>
                    this.renderInput(text, record, index, "number"),
            },
            {
                title: "??????",
                dataIndex: "edit",
                key: "edit",
                render: (text, record, index) => {
                    return !record.edit ? (
                        <span
                            style={{ color: "black", cursor: "pointer" }}
                            onClick={() => this.edit(record, index)}
                        >
                            ??????
                        </span>
                    ) : (
                        <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => this.handleSave(record, index)}
                        >
                            ????????????
                        </span>
                    );
                },
            },
        ];

        let show = []
        dataArr.forEach((i, index) => {
            if (i % 10 == 7 || i / 10 % 10 == 7 || i % 7 == 0) {
                show.push(<a key={index} style={{ color: 'red', margin: 10 }}>{i}???</a>)
            } else {
                show.push(<a style={{ margin: 10 }} key={index}>{i}???</a>)
            }
        })


        return (
            <div>
                <div className="mb-15">
                    <Table rowKey={record => record.id} columns={columnsPro} dataSource={proList}
                        bordered title={() => '????????????'} pagination={false} />
                </div>
                <EditableTable />

                <Table
                    rowKey={(record) => record.id}
                    dataSource={this.state.proList}
                    columns={columns}
                />
                <div style={{ width: '800px', marginLeft: 300, marginBottom: 100 }}>
                    {/* {
                        arr.map((e, index) => (
                            <span style={{ color: e.color }} key={index}>{e.name}???</span>
                        ))
                    } */}

                    {show}
                </div>

            </div >
        );
    }
}

export default init;