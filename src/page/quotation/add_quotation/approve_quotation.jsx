import React, { Component } from 'react'
import { Table, Button, Select, message, Input } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import common from '../../common/common'
import http from '../../../http/index'
import api from '../../../http/httpApiName'
import '../quotation.css'



export default class approve_quotation extends Component {
    state = {
        pageId: '',
        showData: {
            inquiry_order: {
                number: '',
                customer_representative_name: '',
                salesperson_name: '',
                customer_representative_contact: '',
            }
        },
        columnsPro: [
            {
                title: '产品名称',
                dataIndex: 'name',
            },
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品说明',
                render: (text, record) => {
                    let show = []
                    record.options.forEach(e => {
                        show.push(
                            {
                                name: e.param.name,
                                pid: e.param.id,
                                child: [
                                    {
                                        name: e.name
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
                title: '产品规格',
                dataIndex: 'specification',
            },
            {
                title: '产品单位',
                dataIndex: 'unit',
            },
            {
                title: '核价有效期',
                dataIndex: 'name',
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
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {e.actual_quote}
                                </div>
                            ))
                        }
                    </div >
                )
            },
            {
                title: '利润率(%)',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {e.quote_discount_rate + '%'}
                                </div>
                            ))
                        }
                    </div>
                )
            },
        ],
        proList: [],
        result: 1,
        return_reason: '',
        type: '',
    }


    componentDidMount() {
        let dataId = common.common.getQueryVariable('id')
        let type = common.common.getQueryVariable('type')
        this.setState({
            pageId: dataId,
            type: type
        })
        if (dataId) {
            this.getShowData(dataId)
        }
    }

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
                    showData: data
                })
            } else {
                message.warning(res.message)
            }
        })
    }

    getQuotationOrder(id) {
        http.get(api.productList + id + '/product/list').then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({
                    proList: data
                })
            } else {
                message.warning(res.message)
            }
        })
    }

    changeRemark = (e) => {
        this.setState({ return_reason: e.target.value })
    }
    changOption = (value) => {
        this.setState({ result: value })
    }

    commit = () => {
        const { pageId, result, return_reason } = this.state
        let params = {
            id: Number(pageId),
            result: result == 1 ? true : false,
            return_reason: return_reason
        }
        if (!params.result && params.return_reason == '') {
            message.warning('请填写退回原因')
        }
        http.post(api.quoteApprove, params).then(res => {
            if (res.code == 1) {
                message.success('提交成功')
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
            } else {
                message.warning(res.message)
            }
        })
    }

    render() {
        const { showData, columnsPro, proList, result, type } = this.state
        const { Option } = Select;
        const { TextArea } = Input;
        const option = [
            {
                id: 1,
                name: '同意'
            },
            {
                id: 2,
                name: '退回'
            }
        ]
        return (
            <div className="page">
                <div className="fs mb-15">
                    <span className="w300">报价单号：{showData.number}</span>
                    <span className="w300">报价人员：{showData.pricing_offer_name}</span>
                    <span className="w300">创建时间：{showData.created_at}</span>
                </div>
                <div className="fs  mb-15">
                    <span className="w300">询价单号：{showData.inquiry_order.number}</span>
                    <span className="w300">询价人员：{showData.inquiry_order.customer_representative_name}</span>
                    <span className="w300">询价时间：{showData.inquiry_date}</span>
                </div>
                <div className="fs  mb-15">
                    <span className="w300">销售人员：{showData.inquiry_order.salesperson_name}</span>
                    <span className="w300">联系电话：{showData.inquiry_order.customer_representative_contact}</span>
                    <span className="">客户名称：{showData.customer_name}</span>
                </div>
                <div className="mb-15">
                    <Table rowKey={record => record.id} columns={columnsPro} dataSource={proList}
                        bordered title={() => '产品'} pagination={false} />
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
                            交付地址：{showData.inquiry_order.address}
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
                {type != 5 &&
                    <>
                        <div>
                            <div className="mb-15">
                                <span className="inl-block">
                                    审批意见：
                                </span>
                                <Select style={{ width: 200 }} placeholder="请选择" onChange={this.changOption}>
                                    {option.map(e => (
                                        <Option key={e.id} value={e.id}>{e.name}</Option>
                                    ))
                                    }
                                </Select>
                            </div>
                            {result == 2 &&
                                <div className="fs">
                                    <span className="inl-block">
                                        退回原因：
                                    </span>
                                    <TextArea className="w450" onChange={this.changeRemark} placeholder="请输入退回原因" allowClear />
                                </div>
                            }
                        </div>
                        <div className="but-class-center">
                            <Button type="primary" onClick={this.commit}>提交</Button>
                        </div>
                    </>
                }
            </div>
        )
    }
}
