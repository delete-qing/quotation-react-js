import React, { Component } from 'react'
import { Table, Modal, Divider, Select, message, Input, Button, Pagination } from 'antd';
import common from '../../../public/common';
import http from '../../http/index'
import api from "../../http/httpApiName";
import './index.css'


export default class index extends Component {
    // 报价BOM
    state = {
        columns: [
            {
                title: '任务编号',
                dataIndex: 'number',
                width: 200,
                fixed: 'left',
            },
            {
                title: '任务状态',
                dataIndex: 'status_desc',
                fixed: 'left',
                width: 150
            },
            {
                title: '相关类型',
                dataIndex: 'related_type_desc',
                width: 150
            },
            {
                title: '相关单号',
                dataIndex: 'related_number',
                width: 200,
            },
            {
                title: '产品编号',
                width: 200,
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.number}
                            </div>
                        }
                    </>


                ),
            },
            {
                title: '产品名称',
                width: 200,
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.name}
                            </div>
                        }
                    </>

                ),
            },
            {
                title: '产品规格',
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.specification}
                            </div>
                        }
                    </>
                ),
            },
            {
                title: '计数单位',
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.unit}
                            </div>
                        }
                    </>

                ),
            },
            {
                title: '包装要求',
                width: 500,
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.pack_units.map((e, index) => (
                                    <div key={index}>
                                        <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                            {e.level}级包装单位：{e.name}，
                                        </span>
                                        {e.pack_material != null &&

                                            <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                                包装材质：{e.pack_material.name}，
                                            </span>
                                        }
                                        <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                            包装容量：{e.capacity_type == 1 ? '固定数量' : '工程定义'}，
                                        </span>
                                        {e.capacity_type == 1 &&
                                            <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                                固定数量：{e.capacity_value}
                                            </span>
                                        }

                                    </div>
                                ))
                                }
                            </div>
                        }
                    </>

                ),
            },
            {
                title: '询价数量',
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.quantities.map((e, index) => (
                                    <div key={index}>
                                        {e.quantity}{e.unit}
                                    </div>
                                ))}
                            </div>
                        }
                    </>

                ),
            },
            {
                title: 'PE人员',
                dataIndex: 'pe_person_name',
            },
            {
                title: 'PE完成时间',
                dataIndex: 'pe_finish_duration',
            },
            {
                title: 'IE人员',
                dataIndex: 'ie_person_name',
            },
            {
                title: 'IE完成时间',
                dataIndex: 'ie_finish_duration',
            },
            {
                title: '操作',
                fixed: 'right',
                width: 150,
                render: (text, record) => (
                    <div>
                        <div>
                            <a onClick={() => this.goConfig(record)}>查看</a>
                            <Divider type="vertical" />
                            {record.status == 1 &&
                                <a onClick={() => this.distribute(record)}>任务分配</a>
                            }
                            {record.status != 1 &&
                                <a style={{ color: '#ccc' }}>任务分配</a>
                            }
                        </div>
                        {
                            (() => {
                                if (record.status == 2 || record.status == 3) {
                                    return <>
                                        <a onClick={() => this.goPeConfig(record)}>PE配置</a>
                                    </>
                                } else {
                                    return <>
                                        <a style={{ color: '#ccc' }}>PE配置</a>
                                    </>
                                }
                            })()
                        }
                        {
                            (() => {
                                if (record.status == 4 || record.status == 5) {
                                    return <>
                                        <Divider type="vertical" />
                                        <a onClick={() => this.goEeConfig(record)}>IE规划</a>
                                    </>
                                } else {
                                    return <>
                                        <Divider type="vertical" />
                                        <a style={{ color: '#ccc' }}>IE规划</a>
                                    </>
                                }
                            })()
                        }


                    </div>
                ),
            },
        ],
        list: [
            {
                quantities: [],
                pack_units: []
            }
        ],
        personnelData: [],
        isModalVisible: false,
        PEID: '',
        IEID: '',
        listId: '',
        satusData: [],
        searchData: {
            number: '',
            related_number: '',
            product_number: '',
            product_name: '',
            ie_person_name: '',
            pe_person_name: '',
            status: '',
        },
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
        },
        pageSizeOptions: [5, 10, 15, 20],

    }
    componentDidMount() {
        this.getList()
        this.getPersonnel()
        this.getStatus()
        let pageHeigth = document.body.scrollHeight;
        console.log('pageHeigth: ', pageHeigth);
    }
    getList() {
        const { pagination, searchData } = this.state
        http.get(api.bomList, {
            params: {
                per_page: pagination.pageSize,
                page: pagination.current,
                number: searchData.number,
                related_number: searchData.related_number,
                product_number: searchData.product_number,
                product_name: searchData.product_name,
                ie_person_name: searchData.ie_person_name,
                pe_person_name: searchData.pe_person_name,
                status: searchData.status,

            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                pagination.total = res.data.total
                this.setState({
                    list: data,
                    pagination
                })
            } else {
                message.warning(res.message)
            }
        })
    }
    onChangePage = (page, pageSize) => {
        const { pagination } = this.state
        pagination.current = page
        pagination.pageSize = pageSize
        this.setState({ pagination })
        this.getList()
    }

    getStatus() {
        http.get(api.bomStatus).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.setState({ satusData: data })
            } else {
                message.warning(res.message)
            }
        })
    }
    getPersonnel() {
        http.get(api.adminList).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ personnelData: data })
            } else {
                message.warning(res.message);
            }
        })
    }
    distribute = (data) => {
        console.log('data: ', data);
        // let history = this.props.history
        // common.pathData.getPathData(
        //     {
        //         path: '/PeConfig?id=' + data.id,
        //         data: {
        //             id: data.id,
        //             type: 1
        //         },
        //         history: history
        //     }
        // )
        this.setState({
            isModalVisible: true,
            listId: data.id
        })
    }
    handleChangePE = (value) => {
        this.setState({ PEID: value })
    }
    handleChangeIE = (value) => {
        this.setState({ IEID: value })
    }
    handleOk = () => {
        const { listId, PEID, IEID, isModalVisible } = this.state
        let params = {
            id: listId,
            pe_person_id: PEID,
            ie_person_id: IEID
        }
        if (params.pe_person_id == '') {
            message.warning('请选择PE人员')
            return
        } else if (params.ie_person_id == '') {
            message.warning('请选择IE人员')
            return
        }
        http.post(api.bomAssign, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.setState({ isModalVisible: false })
                this.getList()
            } else {
                message.warning(res.message)
            }
        })
    }
    handleCancel = () => {
        this.setState({ isModalVisible: false })
    }
    goPeConfig(data) {
        let history = this.props.history
        common.pathData.getPathData(
            {
                // path: '/PeConfig?id=' + data.id,
                data: {
                    id: data.id,
                    type: 1
                },
                history: history
            }
        )
    }
    goEeConfig(data) {
        let history = this.props.history
        common.pathData.getPathData(
            {
                // path: '/PeConfig?id=' + data.id,
                data: {
                    id: data.id,
                    type: 2
                },
                history: history
            }
        )
    }

    searchIt = () => {
        this.getList()
    }
    handleChangeStatus = (value) => {
        const { searchData } = this.state
        searchData.status = value
        this.setState({ searchData })
        this.getList()
    }
    changeInput = (e) => {
        const { searchData } = this.state
        searchData[e.target.name] = e.target.value
        this.setState({ searchData })
    }

    goConfig(data) {
        let history = this.props.history
        if (data.status == 2 || data.status == 3 || data.status == 6 || data.status == 7 || data.status == 8 || data.status == 9) {
            common.pathData.getPathData(
                {
                    // path: '/PeConfig?id=' + data.id,
                    data: {
                        id: data.id,
                        type: 1
                    },
                    history: history
                }
            )

        } else if (data.status == 4 || data.status == 5) {
            common.pathData.getPathData(
                {
                    // path: '/PeConfig?id=' + data.id,
                    data: {
                        id: data.id,
                        type: 2
                    },
                    history: history
                }
            )
        } else if (data.status == 1) {
            common.pathData.getPathData(
                {
                    path: '/home',
                    data: {
                        type: 3
                    },
                    history: history
                }
            )
        }
    }
    render() {
        const { columns, list, isModalVisible, personnelData, satusData, pagination, pageSizeOptions, } = this.state
        const { Option } = Select;

        return (
            <div>
                <div className="page">
                    <div className="fs mb-15">
                        <div className="mr-20">
                            <span>任务编号：</span>
                            <Input name="number" onChange={this.changeInput} className="w200" placeholder="请输入任务编号" />
                        </div>
                        <div className="mr-20">
                            <span>相关单号：</span>
                            <Input name="related_number" onChange={this.changeInput} className="w200" placeholder="请输入相关单号" />
                        </div>
                        <div className="mr-20">
                            <span>产品名称：</span>
                            <Input name="product_name" onChange={this.changeInput} className="w200" placeholder="请输入产品名称" />
                        </div>
                        <div className="mr-20">
                            <span>产品编号：</span>
                            <Input name="product_number" onChange={this.changeInput} className="w200" placeholder="请输入产品编号" />
                        </div>
                    </div>
                    <div className="fs mb-15">
                        <div className="mr-20">
                            <span>筛选状态：</span>
                            <Select style={{ width: 200 }} onChange={this.handleChangeStatus}>
                                {
                                    satusData.map(e => (
                                        <Option key={e.id} value={e.id}>{e.name}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="mr-20">
                            <span>PE&nbsp;人&nbsp;&nbsp;员：</span>
                            <Input name="pe_person_name" onChange={this.changeInput} className="w200" placeholder="请输入PE人员" />
                        </div>
                        <div className="mr-20">
                            <span>IE&nbsp;&nbsp;人&nbsp;&nbsp;员：</span>
                            <Input name="ie_person_name" onChange={this.changeInput} className="w200" placeholder="请输入IE人员" />
                        </div>
                        <Button type="primary" onClick={this.searchIt}>搜索</Button>

                    </div>
                    <div>
                        <Table rowKey={record => record.id} columns={columns} dataSource={list} pagination={false} scroll={{ x: 3000 }} />
                        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
                            <Pagination current={pagination.current} total={pagination.total}
                                pageSize={pagination.pageSize} onChange={this.onChangePage} pageSizeOptions={pageSizeOptions} showSizeChanger />
                        </div>
                    </div>
                </div>
                <div>
                    <Modal title="任务分配" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} cancelText="取消" okText="确定">
                        <div>
                            <span style={{ display: 'inline-block', width: '35px' }}>
                                PE：
                            </span>
                            <Select style={{ width: '260px' }} onChange={this.handleChangePE}>
                                {
                                    personnelData.map(e => (
                                        <Option key={e.id} value={e.id}>{e.name}</Option>
                                    ))
                                }

                            </Select>
                        </div>
                        <div className="mt-15">
                            <span style={{ display: 'inline-block', width: '35px' }}>
                                IE：
                            </span>
                            <Select style={{ width: '260px' }} onChange={this.handleChangeIE}>
                                {
                                    personnelData.map(e => (
                                        <Option key={e.id} value={e.id}>{e.name}</Option>
                                    ))
                                }

                            </Select>
                        </div>

                    </Modal>
                </div>
            </div>
        )
    }
}
