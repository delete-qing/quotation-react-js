import React, { Component } from 'react'
import { Table, Button, Select, message, Input } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import http from '../../../http/index'
import api from '../../../http/httpApiName'
import common from '../../../../public/common';
import '../quotation.css'


// 添加报价单

export default class index extends Component {

    state = {
        pageId: '',

        proList: [],
        editArr: [],
        showData: {
            delivery_address: {},
            inquiry_order: {}
        },
        remark: '',
    }

    componentDidMount() {
        let dataId = common.common.getQueryVariable('id')
        this.setState({ pageId: dataId })

        if (dataId) {
            this.getShowData(dataId)
        }
    }
    // 报价单详情
    getShowData(id) {
        http.get(api.quoteGet, {
            params: {
                id: id
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
                let data = res.data.items
                data.forEach(e => {
                    e.check_price_order_details.forEach(i => {
                        i.show = 0
                    })
                })
                this.setState({
                    proList: data
                })
            } else {
                message.warning(res.message)
            }
        })

    }
    changeRemark = (e) => {
        this.setState({ remark: e.target.value })

    }
    commit = (type) => {
        const { proList, pageId, remark } = this.state
        let params = {
            id: Number(pageId),
            remark: remark,
            format: 1,
            details: []
        }
        proList.forEach(e => {
            e.check_price_order_details.forEach(i => {
                params.details.push(
                    {
                        id: Number(i.id),
                        actual_quote: Number(i.actual_quote)
                    }
                )
            })
        })
        console.log(params, 'params');

        let url
        if (type == 1) {
            url = '/quote/order/quote/save'
        } else {
            url = '/quote/order/quote/commit'
        }
        http.post(url, params).then(res => {
            if (res.code == 1) {
                if (type == 1) {
                    message.success('保存成功')
                } else {
                    message.success('报价成功')
                    let history = this.props.history
                    setTimeout(function () {
                        common.pathData.getPathData(
                            {
                                path: '/Quotation',
                                data: {
                                    type: 1,
                                },
                                history: history
                            }
                        )
                    }, 1000)
                }
                this.getShowData(pageId)
            } else {
                message.warning(res.message)
            }
        })

    }


    isShow = (index, index1) => {
        const { proList } = this.state
        let data = proList[index].check_price_order_details[index1]
        if (data.show == 0) {
            data.show = 1
        } else {
            data.show = 0
        }

        this.setState({ proList })
    }

    changeaCtualQuote = (event, index, data) => {
        const { proList } = this.state
        data.actual_quote = event.target.value
        this.setState({ proList })
    }




    render() {
        const { proList, showData } = this.state
        const { Option } = Select;
        const { TextArea } = Input;

        const columnsPro = [
            {
                title: '产品名称',
                dataIndex: 'name',
            },
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品规格',
                dataIndex: 'specification',
            },
            {
                title: '产品单位',
                dataIndex: 'unit',
            },
            {
                title: '核价有效期',
                dataIndex: 'expire_date',

            },
            {
                title: '询价数量',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details.length != 0 &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {e.quantity}{e.unit}
                                </div>
                            ))
                        }
                    </div>
                )
            },
            {
                title: '含税单价(元)',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {e.unit_quote}
                                </div>
                            ))
                        }
                    </div>
                )
            },
            {
                title: '核价金额(元)',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {e.total_quote}
                                </div>
                            ))
                        }
                    </div>
                )
            },
            {
                title: '报价金额(元)',
                width: 260,
                render: (text, record, index) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index1) => (
                                <div key={index1}>
                                    {e.show == 0 &&
                                        < div >
                                            <span>
                                                {e.actual_quote}
                                                <EditTwoTone className="ml-10" onClick={() => this.isShow(index, index1)} />
                                            </span>
                                        </div>
                                    }


                                    {e.show == 1 &&
                                        <div key={index1} className='mb-5'>
                                            <Input className="w100 mr-10" value={e.actual_quote}
                                                onChange={(event) => this.changeaCtualQuote(event, index, e)} onBlur={() => this.isShow(index, index1)} />
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </div >
                )
            },
            {
                title: '报价折扣(%)',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {(1 - e.actual_quote / e.total_quote) * 100}
                                </div>
                            ))
                        }
                    </div>
                )
            }
        ]

        return (
            <div className="page">
                <div>
                    <div className="top-block mb-15 fs">
                        <h3 className='db mr-50 fw'>客户名称：{showData.customer_name}</h3>
                        <h3 className='db mr-50 fw'>报价单号：{showData.number}</h3>
                    </div>
                    <div className="top-block mb-15">
                        <span className="w300">询价单号：{showData.number}</span>
                        <span className="w300">询价人员：{showData.inquiry_order.customer_representative_name}</span>
                        <span className="w300">询价时间：{showData.created_at}</span>
                    </div>
                    <div className="top-block mb-15">
                        <span className="w300">联系电话：{showData.inquiry_order.customer_representative_contact}</span>
                        <span className="w300">销售人员：{showData.inquiry_order.salesperson_name}</span>
                        <span className="w300">邮箱地址：{showData.inquiry_order.customer_representative_email}</span>
                    </div>
                </div>
                <div className="mb-15">
                    <Table rowKey={record => record.id} columns={columnsPro} dataSource={proList}
                        bordered title={() => '询价产品'} pagination={false} />
                </div>
                <div className="mb-15">
                    <div>
                        <span className="inl-block w200">
                            交付方式：{showData.inquiry_order.delivery_mode_desc}
                        </span>
                        <span className="inl-block w200">
                            运输方式：{showData.inquiry_order.transport_mode_desc}
                        </span>
                    </div>
                    <div>
                        <span className="inl-block w200">
                            结算方式：{showData.inquiry_order.settlement_mode_desc}
                        </span>
                        <span>
                            交付期限：{showData.inquiry_order.delivery_at}
                        </span>
                    </div>
                    <div>
                        <span className="lh-32">
                            交付地址：
                            {showData.inquiry_order.address}

                        </span>
                    </div>
                    <div>
                        <span className="lh-32">
                            结算说明：{showData.inquiry_order.settlement_instr}
                        </span>
                    </div>
                    <div>
                        <span className="lh-32">
                            询价备注：{showData.inquiry_order.remark}
                        </span>
                    </div>
                </div>
                <div>
                    <div className="mb-15">
                        <span className="inl-block">
                            报价单格式：
                        </span>
                        <Select style={{ width: 200 }} placeholder="默认" disabled>
                            <Option value="默认">默认</Option>
                        </Select>
                    </div>
                    <div className="fs">
                        <span className="inl-block">
                            报价备注：
                        </span>
                        <div className="w450">
                            <TextArea onChange={this.changeRemark} placeholder="请输入报价备注" allowClear />
                        </div>
                    </div>
                </div>
                <div className="but-div">
                    <div className="but-class">
                        <Button type="primary" size='large' onClick={() => this.commit(1)}>保存</Button>
                        <Button type="primary" size='large' onClick={() => this.commit(2)}>提交</Button>
                    </div>
                </div>
            </div>
        )
    }
}
