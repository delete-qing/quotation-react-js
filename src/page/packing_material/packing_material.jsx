import React, { Component } from 'react';
import { Table, Switch, Button, Modal, Input, message, Divider, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import common from '../../../public/common';
import http from '../../http/index'
import api from "../../http/httpApiName";
import './packing_material.css'


class index extends Component {
    state = {
        list: [],
        materialArr: [],
        columns: [
            {
                title: '材质名称',
                dataIndex: 'name',
            },
            {
                title: '物料名称',
                width: 300,
                render: (text, record) => (
                    <div>
                        {record.bind_material != null &&
                            < div >
                                {record.bind_material.name}
                            </div>
                        }
                    </div>


                ),
            },
            {
                title: '物料编号',
                render: (text, record) => (
                    <div>
                        {record.bind_material != null &&
                            < div >
                                {record.bind_material.show_sku_number}
                            </div>
                        }
                    </div>
                ),
            },
            {
                title: '物料特性',
                render: (text, record) => (
                    <div>
                        {record.bind_material != null &&
                            < div >
                                {record.bind_material.feature}
                            </div>
                        }
                    </div>
                ),
            },
            {
                title: '物料规格',
                render: (text, record) => (
                    <div>
                        {record.bind_material != null &&
                            < div >
                                {record.bind_material.specification}
                            </div>
                        }
                    </div>
                ),
            },
            {
                title: '计数单位',
                render: (text, record) => (
                    <div>
                        {record.bind_material != null &&
                            < div >
                                {record.bind_material.unit}
                            </div>
                        }
                    </div>
                ),
            },
            {
                title: '启用/停用',
                render: (text, record) => (
                    <Switch checkedChildren="开启" unCheckedChildren="关闭"
                        onChange={() => this.isStop(record)}
                        defaultChecked={record.is_usage == 1 ? true : false} />
                ),
            },
            {
                title: '操作',

                render: (text, record) => (
                    <div>
                        <a onClick={() => this.bindMeterial(record)}>绑定物料</a>
                        <Divider type="vertical" />

                        <Popconfirm
                            title="您确定要删除么？"
                            onConfirm={() => this.deleteMeterial(record.id)}
                            okText="是"
                            cancelText="否"
                        >
                            <a style={{ color: 'red' }}>删除</a>
                        </Popconfirm>
                    </div>
                )
            },
        ],
    }


    componentWillMount() {
        this.getList()
    }

    getList() {
        http.get(api.packingList).then(res => {
            if (res.code == 1) {
                let data = res.data.items;
                this.setState({ list: data })
            }
        })
    }

    deleteMeterial(id) {
        // message.success('删除成功'); 
        http.get(api.deleteMateria, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('删除成功');
                this.getList()
            }
        })
    }

    isStop(record) {
        let is_usage = 1
        if (record.is_usage == 1) {
            is_usage = 0
        } else {
            is_usage = 1
        }
        http.get(api.usage, {
            params: {
                id: record.id,
                is_usage: is_usage
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('设置成功');
                this.getList()
            }
        })
    }
    addList = () => {
        this.setState({ isModalVisible: true })
    }
    handleOk = () => {
        const { materialArr } = this.state
        let params = []
        materialArr.forEach(e => {
            params.push(
                {
                    name: e.name,
                    is_usage: 1
                }
            )

        })
        http.post(api.createMateria, params).then(res => {
            if (res.code == 1) {
                message.success('新建成功');
                this.getList()
                this.setState({ isModalVisible: false })
            }

        })

    }
    cancleIt = () => {
        this.setState({ isModalVisible: false })
    }
    addMaterial = () => {
        const { materialArr } = this.state
        materialArr.push(
            {
                name: ''
            }
        )
        this.setState({ materialArr })
    }

    cutMaterial(index) {
        const { materialArr } = this.state
        materialArr.splice(index, 1)
        this.setState({ materialArr })
    }

    changInput = (e, index) => {
        const { materialArr } = this.state
        materialArr.forEach((i, index1) => {
            if (index == index1) {
                i.name = e.target.value
            }
        })
        this.setState({ materialArr })
    }

    bindMeterial = (record) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/materials?id=' + record.id,
                data: {
                    id: record.id,
                },
                history: history
            }
        )
    }
    render() {
        const { list, isModalVisible, materialArr, columns, } = this.state
        if (materialArr.length == 0) {
            materialArr.push(
                {
                    name: ''
                }
            )
        }
        return (
            <div className="page">
                <div className="mim-block">
                    <div>
                        <Button type="primary" onClick={this.addList}>新建</Button>
                    </div>
                    <div className="mt-15">
                        <Table rowKey={record => record.id} columns={columns} dataSource={list} pagination={false} />
                    </div>
                    <div>
                        <Modal title="新建" visible={isModalVisible} onOk={this.handleOk} onCancel={this.cancleIt} okText="确定" cancelText="取消">
                            <div>
                                {materialArr.map((e, index) => (
                                    <div className="mb-15" key={index}>
                                        <span>材质名称：</span>
                                        <Input defaultValue={e.name} onChange={e => this.changInput(e, index)} className="w200" placeholder="请输入材质名称" />
                                        <MinusCircleOutlined onClick={e => this.cutMaterial(index)} style={{ fontSize: '20px', marginLeft: '15px' }} />
                                        <PlusCircleOutlined onClick={this.addMaterial} style={{ fontSize: '20px', marginLeft: '15px' }} />
                                    </div>
                                ))}

                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;