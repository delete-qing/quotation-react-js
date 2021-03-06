import React, { Component } from 'react'
import common from '../common/common'
import { Table, Button, Modal, Select, message, Input, DatePicker, Divider, Pagination, Tag } from 'antd';
import http from '../../http'
import api from '../../http/httpApiName'
import './quotation.css'


export default class index extends Component {
    // 报价单
    state = {
        pageId: '',
        columns: [
            {
                title: '报价单号',
                dataIndex: 'number',
            },
            {
                title: '客户名称',
                width: 150,
                dataIndex: 'customer_name',
            },
            {
                title: '产品名称',
                width: 150,
                render: (text, record) => (
                    <>
                        {record.inquiry_order != null &&
                            record.inquiry_order.products.map(e => (
                                <div key={e.id}>
                                    {e.name}
                                </div>
                            ))
                        }

                    </>
                )
            },
            {
                title: '状态',
                dataIndex: 'status_desc',
            },
            {
                title: '询价单号',
                dataIndex: 'related_number',
            },
            {
                title: '询价日期',
                width: 110,
                dataIndex: 'inquiry_date',
            },
            {
                title: '报价日期',
                width: 110,
                dataIndex: 'quote_date',
            },
            {
                title: '报价人员',
                dataIndex: 'pricing_offer_name',
            },
            {
                title: '审批人员',
                render: (text, record) => {
                    let show = []
                    record.approve_logs.forEach(e => {
                        if (e.approved_at == null) {
                            e.color = 'blue'
                        } else if (e.approved_at && e.result) {
                            e.color = 'green'
                        } else if (e.approved_at && e.result == false) {
                            e.color = 'red'
                        }
                        show.push(e)
                    })

                    return (
                        <div>
                            {show.map.length != 0 &&
                                show.map((i, index) => (
                                    <div key={index} className='mb-5'>
                                        <Tag color={i.color}>
                                            {i.approver_name}
                                        </Tag>
                                    </div>

                                ))
                            }
                        </div>
                    )

                }
            },
            {
                title: '退回说明',
                width: 150,
                render: (text, record) => (
                    <>
                        {record.approve_logs.length != 0 &&
                            record.approve_logs.map(e => (
                                <div key={e.id}>
                                    {e.return_reason}
                                </div>
                            ))
                        }

                    </>
                )
            },
            {
                title: '操作',
                width: 170,
                render: (text, record) => {
                    let lookPage
                    lookPage = <a onClick={() => this.goLookPage(record)}>查看</a>

                    let qutation
                    if (record.status == 1 || record.status == 6) {
                        qutation = <a onClick={() => this.goQutation(record)}>报价</a>
                    } else {
                        qutation = <a style={{ color: '#ccc' }}>报价</a>
                    }

                    let approveQuotation
                    if (record.status == 3 || record.status == 4) {
                        approveQuotation = <a onClick={() => this.goApproveQuotation(record)}>审批</a>
                    } else {
                        approveQuotation = <a style={{ color: '#ccc' }}>审批</a>
                    }

                    let confrim
                    if (record.status == 10) {
                        confrim = <a onClick={() => this.confrim(record.id)}>客户确认</a>
                    } else {
                        confrim = <a style={{ color: '#ccc' }}>客户确认</a>
                    }

                    let transferOrder
                    if (record.status == 11) {
                        transferOrder = <a onClick={() => this.goTransferOrder(record.id)}>转订单</a>
                    } else {
                        transferOrder = <a style={{ color: '#ccc' }}>转订单</a>
                    }

                    let downQuotationOrder = <a onClick={() => this.downQuotationOrder(record)}>下载报价单</a>

                    return (
                        <>
                            <div style={{ marginBottom: 5 }}>
                                {lookPage}
                                <Divider type="vertical" />
                                {qutation}
                                <Divider type="vertical" />
                                {approveQuotation}
                            </div>
                            <div style={{ marginBottom: 5 }}>
                                {confrim}
                                <Divider type="vertical" />
                                {transferOrder}
                            </div>
                            <div style={{ marginBottom: 5 }}>
                                {downQuotationOrder}
                            </div>
                        </>
                    )
                },
            },
        ],
        list: [],
        statusArr: [],
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
        },
        pageSizeOptions: [10, 15, 20, 30],
        searchData: {
            number: '',
            status: '',
            customer_name: '',
            related_number: '',
            pricing_offer_name: '',
            customer_id: '',
            inquiry_date_start: '',
            inquiry_date_end: '',
            quote_date_start: '',
            quote_date_end: '',
            product_name: '',
        },
        type: 1

    }
    componentDidMount() {
        let pageId = common.common.getQueryVariable('id')
        this.setState({ pageId })
        this.getList()
        this.getStatus()
    }

    getList(type = 1) {
        const { pagination, searchData } = this.state
        http.get(api.quoteList[type], {
            params: {
                per_page: pagination.pageSize,
                page: pagination.current,
                number: searchData.number,
                status: searchData.status,
                customer_name: searchData.customer_name,
                related_number: searchData.related_number,
                pricing_offer_name: searchData.pricing_offer_name,
                customer_id: searchData.customer_id,
                inquiry_date_start: searchData.inquiry_date_start,
                inquiry_date_end: searchData.inquiry_date_end,
                quote_date_start: searchData.quote_date_start,
                quote_date_end: searchData.quote_date_end,
                product_name: searchData.product_name
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                pagination.total = res.data.total
                this.setState({ list: data })
            } else {
                message.warning(res.message)
            }
        })
    }
    onChangePage = (page, pageSize) => {
        const { pagination, type } = this.state
        pagination.current = page
        pagination.pageSize = pageSize
        this.setState({ pagination })
        this.getList(type)
    }
    searchIt = (type) => {
        const { pagination } = this.state
        pagination.current = 1
        this.setState({ pagination, type })
        this.getList(type)
    }
    getStatus() {
        http.get(api.quoteStatus).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.setState({ statusArr: data })
            } else {
                message.warning(res.message)
            }
        })
    }

    handleChangeStatus = (value) => {
        const { searchData } = this.state
        searchData.status = value
        this.setState({ searchData })
    }

    changeInput = (e) => {
        const { searchData } = this.state
        searchData[e.target.name] = e.target.value
        this.setState({ searchData })
    }

    onChangeInquiryTime = (date, dateString) => {
        const { searchData } = this.state
        searchData.inquiry_date_start = dateString[0]
        searchData.inquiry_date_end = dateString[1]
        this.setState({ searchData })
    }
    onChangeQuoteTime = (date, dateString) => {
        const { searchData } = this.state
        searchData.quote_date_start = dateString[0]
        searchData.quote_date_end = dateString[1]
        this.setState({ searchData })

    }

    goApproveQuotation = (data) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/approveQuotation?id=' + data.id + '&type=1',
                data: {
                    id: data.id,
                    type: 1,
                },
                history: history
            }
        )
    }

    goQutation = (record) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/addQuotation?id=' + record.id,
                data: {
                    type: 2,
                    id: record.id
                },
                history: history
            }
        )
    }

    // 客户确认
    confrim = (id) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/lookQuotation?id=' + id + '&type=4',
                data: {
                    id: id,
                    type: 4,
                },
                history: history
            }
        )

    }
    // 查看
    goLookPage(data) {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/lookQuotation?id=' + data.id + '&type=3',
                data: {
                    id: data.id,
                    type: 3,
                },
                history: history
            }
        )
    }

    goTransferOrder = (id) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/transferOrder?id=' + id,
                data: {
                    id: id,
                    type: 6,
                },
                history: history
            }
        )
    }
    downQuotationOrder = (record) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/downQuotationOrder?id=' + record.id,
                data: {
                    type: 7,
                    id: record.id
                },
                history: history
            }
        )
    }


    testPage = () => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/init',
                data: {
                    type: 8,
                },
                history: history
            }
        )
    }
    render() {
        const { columns, list, statusArr, pagination, pageSizeOptions } = this.state
        const { RangePicker } = DatePicker;
        const { Option } = Select;

        return (
            <div>
                <div className="page">
                    <div className="search-title">
                        <div className="mr-20">
                            <span>报价单号：</span>
                            <Input name="number" onChange={this.changeInput} className="w200" placeholder="请输入报价单号" />
                        </div>
                        <div className="mr-20">
                            <span>询价单号：</span>
                            <Input name="related_number" onChange={this.changeInput} className="w200" placeholder="请输入询价单号" />
                        </div>
                        <div className="mr-20">
                            <span>产品名称：</span>
                            <Input name="product_name" onChange={this.changeInput} className="w200" placeholder="请输入产品名称" />
                        </div>

                        <div className="mr-20">
                            <span>询价时间：</span>
                            <RangePicker style={{ width: '290px' }} placeholder={['开始时间', '结束时间']} onChange={this.onChangeInquiryTime} />
                        </div>
                    </div>
                    <div className="search-title mt-15">
                        <div className="mr-20">
                            <span>客户名称：</span>
                            <Input name="customer_name" onChange={this.changeInput} className="w200" placeholder="请输入客户名称" />
                        </div>
                        <div className="mr-20">
                            <span>状态筛选：</span>
                            <Select placeholder="请选择" style={{ width: 200 }} onChange={this.handleChangeStatus}>
                                {statusArr.map(e => (
                                    <Option key={e.id} value={e.id}>{e.name}</Option>
                                ))
                                }
                            </Select>
                        </div>

                        <div className="mr-20">
                            <span>报价时间：</span>
                            <RangePicker style={{ width: '290px' }} placeholder={['开始时间', '结束时间']} onChange={this.onChangeQuoteTime} />
                        </div>
                        <div>
                            <Button type="primary" className="mr-20" onClick={() => this.searchIt(1)}>搜索</Button>
                            <Button type="primary" onClick={() => this.searchIt(2)}>搜索公司全部相关信息</Button>
                        </div>
                    </div>
                    {/* <Button className='ml-10' type="primary" onClick={this.testPage}>勿动</Button> */}
                    <div className="mt-15 mb-15">
                        <div className="mt-15">
                            <Table rowKey={record => record.id} columns={columns} dataSource={list} pagination={false} />
                            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
                                <Pagination current={pagination.current} total={pagination.total}
                                    pageSize={pagination.pageSize} onChange={this.onChangePage} pageSizeOptions={pageSizeOptions} showSizeChanger />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
