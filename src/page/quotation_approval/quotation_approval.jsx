import React, { Component } from 'react'
import { Button, Pagination, Table, Modal, Divider, Select, message, InputNumber, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import http from '../../http/index'
import api from '../../http/httpApiName'

export default class quotation_approval extends Component {
    state = {
        columnsList: [
            {
                title: '利润率（%）',
                dataIndex: '',
                render: (text, record) => (
                    <div>
                        <span> 小于等于 {record.discount_rate}%</span>
                    </div>
                ),
            },
            {
                title: '审批人员',
                dataIndex: 'approver_name',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <div>
                        <a onClick={() => this.editIt(record)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="您确定要删除么?"
                            onConfirm={() => this.remove(record)}
                            okText="是"
                            cancelText="否"
                        >
                            <a style={{ color: 'red' }}>删除</a>
                        </Popconfirm>
                    </div>
                ),
            },
        ],
        list: [],
        isModalVisible: false,
        personnelData: [],
        discountArr: [],
        isModalVisibleEdit: false,
        editShow: {
            discount_rate: '',
            approver_id: '',
            approver_name: '',
            id: ''
        },
        pageSizeOptions: [2, 5, 15, 20],
        pagination: {
            total: 0,
            current: 1,
            pageSize: 15,
        },
    }

    componentDidMount() {
        this.getList()
        this.getPersonnel()
    }
    getList() {
        const { pagination } = this.state
        http.get(api.discountList, {
            params: {
                per_page: pagination.pageSize,
                page: pagination.current
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                pagination.total = res.data.total
                console.log('pagination.total: ', pagination.total);
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
    getPersonnel() {
        http.get(api.adminList).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ personnelData: data })
            } else {
                message.warning(res.message)
            }
        })
    }
    discount = () => {
        this.setState({ isModalVisible: true })
    }
    handleOkAdd = () => {
        const { discountArr, personnelData } = this.state
        let params = []
        discountArr.forEach(e => {
            personnelData.forEach(i => {
                if (e.approver_id == i.id) {
                    params.push(
                        {
                            discount_rate: e.discount_rate,
                            approver_id: e.approver_id,
                            approver_name: i.name,
                        }
                    )
                }
            })
        })
        http.post(api.discountCreate, params).then(res => {
            if (res.code == 1) {
                message.success('新建成功')
                this.getList()
                this.setState({ isModalVisible: false })
            } else {
                message.warning(res.message)
            }
        })
    }
    handleCancelAdd = () => {
        this.setState({ isModalVisible: false })
    }

    cutData = (index) => {
        const { discountArr } = this.state
        discountArr.splice(index, 1)
        this.setState({ discountArr })
    }
    addData = () => {
        const { discountArr } = this.state
        discountArr.push(
            {
                discount_rate: 0,
                approver_id: '',
            }
        )
        this.setState({ discountArr })
    }
    onChangeInput = (e, index) => {
        const { discountArr } = this.state
        discountArr.forEach((item, index1) => {
            if (index == index1) {
                item.discount_rate = e
            }
        })
        this.setState({ discountArr })
    }
    changeOption = (e, index) => {
        const { discountArr } = this.state
        discountArr.forEach((item, index1) => {
            if (index == index1) {
                item.approver_id = e
            }
        })
        this.setState({ discountArr })
    }
    remove = (data) => {
        http.get(api.discountDelete, {
            params: {
                id: data.id
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('删除成功')
                this.getList()
            } else {
                message.warning(res.message)
            }
        })
    }
    editIt = (data) => {
        http.get(api.discountGet, {
            params: {
                id: data.id
            }
        }).then(res => {
            if (res.code == 1) {
                const { editShow } = this.state
                this.setState({
                    isModalVisibleEdit: true,
                    editShow: data
                })
            } else {
                message.warning(res.message)
            }
        })
    }
    handleOkEdit = () => {
        const { editShow } = this.state
        console.log('editShow: ', editShow);
        let params = {
            discount_rate: editShow.discount_rate,
            approver_id: editShow.approver_id,
            approver_name: editShow.approver_name,
            id: editShow.id
        }

        http.post(api.discountUpdate, params).then(res => {
            if (res.code == 1) {
                message.success('编辑成功')
                this.getList()
                this.setState({ isModalVisibleEdit: false })
            } else {
                message.warning(res.message)
            }
        })
    }
    handleCancelEdit = () => {
        this.setState({ isModalVisibleEdit: false })
    }
    changeEditInput = (value) => {
        const { editShow } = this.state
        editShow.discount_rate = value
        this.setState({ editShow })
    }
    changeEditOption = (value) => {
        const { personnelData, editShow } = this.state
        let nameText = ''
        personnelData.forEach(item => {
            if (item.id == value) {
                editShow.approver_name = item.name
                console.log('nameText: ', nameText);
            }
        })
        editShow.approver_id = value
        this.setState({ editShow })
    }


    render() {
        const { columnsList, list, isModalVisible, personnelData, discountArr, isModalVisibleEdit, editShow, pagination, pageSizeOptions } = this.state
        const { Option } = Select;
        if (discountArr.length == 0) {
            discountArr.push(
                {
                    discount_rate: 0,
                    approver_id: '',
                }
            )
        }
        return (
            <div className="page">
                <div className="mb-15">
                    <Button type="primary" onClick={this.discount} >新建</Button>
                </div>
                <div className="mb-15">
                    <Table rowKey={record => record.id} columns={columnsList} dataSource={list} pagination={false} />
                    <div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
                        <Pagination current={pagination.current} total={pagination.total}
                            pageSize={pagination.pageSize} onChange={this.onChangePage} pageSizeOptions={pageSizeOptions} />
                    </div>
                </div>
                <div>
                    <Modal title="新建利润率" visible={isModalVisible} onOk={this.handleOkAdd} onCancel={this.handleCancelAdd}
                        cancelText="取消" okText="确定" width={800}>
                        <div>
                            {discountArr.map((d, index) => (
                                <div key={index} className="fs mb-15">
                                    <div className="mr-20">
                                        <span>利润率小于等于：</span>
                                        <InputNumber
                                            value={d.discount_rate}
                                            min={0}
                                            max={99.99}
                                            formatter={value => `${value}%`}
                                            parser={value => value.replace('%', '')}
                                            onChange={(event) => this.onChangeInput(event, index)}
                                            className="w200" placeholder="请输入两位数"
                                        />
                                    </div>
                                    <div>
                                        审批人：
                                        <Select placeholder="请选择" style={{ width: 200 }} value={d.approver_id} onChange={(e) => this.changeOption(e, index)}>
                                            {personnelData.map(item => (
                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                            ))
                                            }
                                        </Select>
                                    </div>
                                    <div className="fs">
                                        <MinusCircleOutlined onClick={() => this.cutData(index)} style={{ fontSize: '20px', marginLeft: '20px', marginTop: '5px' }} />
                                        <PlusCircleOutlined onClick={this.addData} style={{ fontSize: '20px', marginLeft: '15px', marginTop: '5px' }} />
                                    </div>
                                </div>
                            ))
                            }
                        </div>

                    </Modal>
                </div>
                <div>
                    <Modal title="编辑" visible={isModalVisibleEdit} onOk={this.handleOkEdit} onCancel={this.handleCancelEdit}
                        cancelText="取消" okText="确定" width={800}>
                        <div className="fs">
                            <div className="mr-20">
                                <span>利润率小于等于：</span>
                                <InputNumber
                                    value={editShow.discount_rate}
                                    min={0}
                                    max={99.99}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    className="w200" placeholder="请输入两位数"
                                    onChange={this.changeEditInput}
                                />
                            </div>
                            <div>
                                审批人：
                                <Select placeholder="请选择" style={{ width: 200 }} value={editShow.approver_id} onChange={this.changeEditOption}>
                                    {personnelData.map(item => (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    ))
                                    }
                                </Select>
                            </div>
                        </div>

                    </Modal>
                </div>

            </div >
        )
    }
}
