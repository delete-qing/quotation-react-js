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
                title: '工单编号',
                dataIndex: 'number',
                width: 200,
                fixed: 'left',
            },
            {
                title: '状态',
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
                title: '产品说明',
                width: 400,
                render: (text, record) => {
                    let show = []
                    record.product.options.forEach(e => {
                        let remark = ''
                        if (e.pivot.remark != '') {
                            remark = '(' + e.pivot.remark + ')'
                        }

                        show.push(
                            {
                                name: e.param.name,
                                pid: e.param.id,
                                child: [
                                    {
                                        name: e.name + remark
                                    }
                                ]
                            }
                        )
                    })
                    let list = {}
                    show.forEach(i => {
                        if (list[i.pid]) {
                            list[i.pid].child.push(...i.child)
                        } else {
                            list[i.pid] = i
                        }

                    })

                    let data = []
                    for (let key in list) {
                        let name = []
                        for (let keyChild in list[key].child) {
                            name.push(list[key].child[keyChild].name)
                        }
                        list[key].child = name.join('，')
                        data.push(list[key])
                    }


                    return (
                        <div>
                            {
                                data.map((e, index) => (
                                    <div key={index}>
                                        {e.name}（{e.child}）
                                    </div>
                                ))
                            }
                        </div>
                    )

                },
            },
            {
                title: '来源属性',
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.source_attribute_desc}
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
                title: '客户名称',
                dataIndex: 'customer_name',
            },
            {
                title: '工单生成时间',
                dataIndex: 'created_at',
            },
            {
                title: '工单图纸',
                render: (text, record) => (
                    <>
                        <div>{record.project_file_person_name}</div>
                        <div>{record.project_commit_at}</div>
                    </>

                ),
            },
            {
                title: 'PE配置',
                render: (text, record) => (
                    <>
                        <div>{record.pe_person_name}</div>
                        <div>{record.pe_commit_at}</div>
                    </>

                ),
            },
            {
                title: 'IE规划',
                render: (text, record) => (
                    <>
                        <div>{record.ie_person_name}</div>
                        <div>{record.ie_commit_at}</div>
                    </>

                ),
            },
            {
                title: '操作',
                fixed: 'right',
                width: 160,
                render: (text, record) => {
                    let distribute
                    let peConfig
                    let ieConfig
                    let project
                    let preview
                    let commitPage

                    if (record.status == 1 || record.status == 2 || record.status == 3 || record.status == 4 || record.status == 5 || record.status == 10) {
                        distribute = <a onClick={() => this.distribute(record)}>任务分配</a>
                    } else {
                        distribute = <a style={{ color: '#ccc' }}>任务分配</a>
                    }

                    if (record.status == 2 || record.status == 3 || record.status == 4 || record.status == 5) {
                        peConfig = <a onClick={() => this.goPeConfig(record)}>BOM配置</a>
                    } else {
                        peConfig = <a style={{ color: '#ccc' }}>BOM配置</a>
                    }

                    if (record.status == 10 && record.product.source_attribute == 1 && record.project_file_person_id != 0) {
                        project = <a onClick={() => this.goProject(record)}>工程图纸</a>
                    } else {
                        project = <a style={{ color: '#ccc' }}>工程图纸</a>
                    }

                    if (record.status != 1) {
                        preview = <a onClick={() => this.goPreview(record, 5)}>BOM预览</a>
                    } else {
                        preview = <a style={{ color: '#ccc' }}>BOM预览</a>
                    }

                    if (record.status == 4) {
                        commitPage = <a onClick={() => this.goPreview(record, 6)}>待BOM提交</a>
                    } else {
                        commitPage = <a style={{ color: '#ccc' }}>待BOM提交</a>
                    }
                    return (
                        <div>
                            <span className='db'>{distribute}</span>
                            <span className='db'>{project}</span>
                            <span className='db'>{peConfig}</span>
                            <span className='db'>{ieConfig}</span>
                            <span className='db'>{commitPage}</span>
                            <span className='db'>{preview}</span>
                        </div>
                    )

                },
            },
        ],
        list: [],
        personnelData: [],
        isModalVisible: false,

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
        showData: {
            product: {},
        },
        listProject: []

    }
    componentDidMount() {
        this.getList()
        this.getPersonnel()
        this.getStatus()
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

    searchIt = () => {
        const { pagination } = this.state
        pagination.current = 1
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

                let listProject = common.clone.deepClone(data)
                listProject.push(
                    {
                        id: 0,
                        name: '忽略'
                    }
                )
                this.setState({ personnelData: data, listProject })
            } else {
                message.warning(res.message);
            }
        })
    }
    distribute = (data) => {
        if (data.pe_person_id == 0) {
            data.pe_person_id = ''
        }
        if (data.ie_person_id == 0) {
            data.ie_person_id = ''
        }
        this.setState({
            isModalVisible: true,
            listId: data.id,
            showData: data
        })
    }
    handleChangePE = (value) => {
        const { showData } = this.state
        showData.pe_person_id = value
        this.setState({ showData })
    }
    handleChangeIE = (value) => {
        const { showData } = this.state
        showData.ie_person_id = value
        this.setState({ showData })
    }
    handleChangeProject = (value) => {
        const { showData } = this.state
        showData.project_file_person_id = value
        this.setState({ showData })
    }
    handleOk = () => {
        const { listId, showData } = this.state
        let params = {
            id: listId,
            pe_person_id: showData.pe_person_id,
            ie_person_id: showData.ie_person_id,
            project_file_person_id: showData.project_file_person_id,
        }
        console.log('params: ', params);
        if (params.pe_person_id == '') {
            message.warning('请选择PE人员')
            return
        } else if (params.ie_person_id == '') {
            message.warning('请选择IE人员')
            return
        } else if (typeof params.project_file_person_id == null) {
            message.warning('请选择工程图纸')
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
    goPreview(data, type) {
        let history = this.props.history
        common.pathData.getPathData(
            {
                // path: '/PeConfig?id=' + data.id,
                data: {
                    id: data.id,
                    type: type
                },
                history: history
            }
        )

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

    // 工程图纸
    goProject(data) {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/project?id=' + data.id,
                data: {
                    id: data.id,
                    type: 4
                },
                history: history
            }
        )

    }

    render() {
        const { columns, list, isModalVisible, personnelData, satusData, pagination, pageSizeOptions, showData, listProject } = this.state
        const { Option } = Select;
        let isProject = false
        if (!showData.project_commit_at == null) {
            isProject = true
        }
        return (
            <div>
                <div className="page">
                    <div className="fs mb-15">
                        <div className="mr-20">
                            <span>工单编号：</span>
                            <Input name="number" onChange={this.changeInput} className="w200" placeholder="请输入工单编号" />
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
                    <Modal title="任务分配" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}
                        cancelText="取消" okText="确定" width={600}>
                        <div className='mb-15'>
                            <div className='fs'>
                                <div className='mb-15' style={{ marginRight: 100 }}>
                                    <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                                        工程单号：
                                    </span>
                                    {showData.number}
                                </div>

                                <div className='mb-15'>
                                    <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                                        产品编号：
                                    </span>
                                    {showData.product.number}
                                </div>
                            </div>

                            <div className='mb-15'>
                                <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                                    产品名称：
                                </span>
                                {showData.product.name}
                            </div>
                        </div>

                        <div className="mt-15">
                            <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                                工程图纸：
                            </span>
                            <Select style={{ width: '260px' }} onChange={this.handleChangeProject} value={showData.project_file_person_id} disabled={isProject}>
                                {
                                    listProject.map(e => (
                                        <Option key={e.id} value={e.id}>{e.name}</Option>
                                    ))
                                }

                            </Select>
                        </div>

                        <div className="mt-15">
                            <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }}>
                                PE配置：
                            </span>
                            <Select style={{ width: '260px' }} onChange={this.handleChangePE} value={showData.pe_person_id} disabled={!showData.pe_commit_at == null}>
                                {
                                    personnelData.map(e => (
                                        <Option key={e.id} value={e.id}>{e.name}</Option>
                                    ))
                                }

                            </Select>
                        </div>

                        <div className="mt-15">
                            <span style={{ display: 'inline-block', width: '70px', textAlign: 'right' }} >
                                IE规划：
                            </span>
                            <Select style={{ width: '260px' }} onChange={this.handleChangeIE} value={showData.ie_person_id} disabled={!showData.ie_commit_at == null}>
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
