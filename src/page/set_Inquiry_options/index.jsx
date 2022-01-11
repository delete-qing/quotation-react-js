import React, { Component } from 'react';
import { Table, Switch, Button, Modal, Input, Divider, Select, message, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import http from '../../http/index'
import api from "../../http/httpApiName";
import './index.css'

class index extends Component {
    state = {
        list: [],
        isModalVisible: false,
        optionName: [],
        columns: [
            {
                title: '参数名称',
                dataIndex: 'name',
            },
            {
                title: '可选项',
                render: (text, record) => <div>
                    {
                        record.options.map((e, index) => {
                            return (<div key={index}>
                                {e.name}
                            </div>)
                        })
                    }
                </div>
            },
            {
                title: '选择方式',
                render: (text, record) => (
                    <span>
                        {record.is_single_choice ? '单选' : '多选'}
                    </span>
                ),
            },
            {
                title: '启用/停用',
                render: (text, record) => (
                    <Switch checkedChildren="开启" unCheckedChildren="关闭"
                        onChange={() => this.isStop(record)}
                        defaultChecked={record.is_usage} />
                ),
            },
            {
                title: '操作',
                render: (text, record) => <div>
                    <a onClick={() => this.editData(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="您确定要删除么？"
                        onConfirm={() => this.deleteIt(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </div>
            },
        ],
        name: '',
        selectId: true,
        options: [
            {
                id: 1,
                type: false,
                name: '多选'
            },
            {
                id: 2,
                type: true,
                name: '单选'
            }

        ],
        id: undefined,
    }


    componentWillMount() {
        this.getList()
    }
    getList() {
        http.get(api.inquiryOptionsList).then(res => {
            if (res.code == 1) {
                const { list } = this.state
                let data = res.data.items
                this.setState({ list: data })
            }

        })
    }
    isStop(record) {
        let isUsage
        if (record.is_usage == true) {
            isUsage = false
        } else {
            isUsage = true
        }
        http.get(api.inquiryUsage, {
            params: {
                id: record.id,
                is_usage: isUsage

            }
        }).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getList()
            } else {
                message.warning(res.message)
            }

        })
    }
    deleteIt(record) {
        http.get(api.inquiryDelete, {
            params: {
                id: record.id,

            }
        }).then(res => {
            if (res.code == 1) {
                message.success('删除成功')
                this.getList()
            } else {
                message.warning(res.data.msg)
            }

        })
    }
    editData(data) {
        this.setState({
            id: data.id,
            name: data.name,
            selectId: data.is_single_choice,
            optionName: data.options,
            isModalVisible: true,
        })
    }

    addList = () => {
        this.setState({
            name: '',
            optionName: [],
            selectId: '',
            isModalVisible: true
        })
    }
    getInputValue = (e, index) => {
        const { optionName, name } = this.state
        optionName.forEach((i, index1) => {
            if (index == index1) {
                i.name = e.target.value
            }
        });
        this.setState({ optionName })
    }
    getInputNameValue(e) {
        const { name } = this.state
        this.setState({ name: e.target.value })
    }
    changeSelect = (value) => {
        const { selectId } = this.state
        this.setState({ selectId: value })
    }
    handleOk = () => {
        const { optionName, name, selectId, id } = this.state
        let nameArr = []
        optionName.forEach(e => {
            nameArr.push({
                name: e.name
            })
        })
        let params = {
            name: name,
            is_usage: true,
            is_single_choice: selectId,
            options: nameArr,
            id: id,
        }
        let url
        if (typeof id == 'undefined') {
            url = api.create
        } else {
            url = api.paramUpdate
        }

        http.post(url, params).then(res => {
            if (res.code == 1) {
                if (typeof id == 'undefined') {
                    message.success('添加成功');
                } else {
                    message.success('编辑成功');
                }

                this.setState({ isModalVisible: false })
                this.getList()
            } else {
                message.warning(res.message)
            }
        })



    }
    handleCancel = () => {
        this.setState({
            isModalVisible: false
        })
    }
    cutData(index) {
        const { optionName } = this.state
        optionName.splice(index, 1)
        this.setState({ optionName })
    }
    addData = () => {
        const { optionName } = this.state
        optionName.push(
            {
                name: ''
            }
        )
        this.setState({ optionName })
    }


    render() {
        const { list, isModalVisible, optionName, columns, name, selectId, options } = this.state
        const { Option } = Select;

        if (optionName.length == 0) {
            optionName.push(
                {
                    name: ''
                }
            )
        }

        return (
            <div className="page">
                <div className="mim-block">
                    <div className="mb-15">
                        <Button type="primary" onClick={this.addList}>新建</Button>
                        {/* <Input onChange={e => this.getInputNameValue(e)} defaultValue={name} className="w200" /> */}
                    </div>
                    <div>
                        <Table rowKey={record => record.id} columns={columns} dataSource={list} />
                    </div>
                    <div>
                        <Modal title="新建" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} okText="确定" cancelText="取消" destroyOnClose="true">
                            <div>
                                <div className="mb-15">
                                    <span>参数名称：</span>
                                    <Input onChange={e => this.getInputNameValue(e)} defaultValue={name} className="w200" />
                                </div>
                                <div className="mb-15" >
                                    <span>选择方式：</span>
                                    <Select style={{ width: 200 }} defaultValue={selectId} onChange={this.changeSelect}>
                                        {
                                            options.map(e =>
                                            (
                                                <Option key={e.type} value={e.type}>{e.name}</Option>)
                                            )
                                        }
                                    </Select>
                                </div>
                                <div>
                                    <div>
                                        {
                                            optionName.map((e, index) => (
                                                <div className="mt-15" key={index}>
                                                    <span>选项名称：</span>
                                                    <Input onChange={e => this.getInputValue(e, index)} defaultValue={e.name} className="w200" />
                                                    <MinusCircleOutlined onClick={e => this.cutData(index)} style={{ fontSize: '18px', marginLeft: '15px' }} />
                                                    <PlusCircleOutlined onClick={this.addData} style={{ fontSize: '18px', marginLeft: '15px' }} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;