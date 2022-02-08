import React, { Component } from 'react';
import { Table, Button, Select, message, Input } from 'antd';
import http from '../../../http/index'
import api from '../../../http/httpApiName'
import common from '../../../../public/common';


class down_quotation_order extends Component {
    state = {
        proList: [],
        pageId: '',
        checkDay: '',
        showData: {
            attaches: [],
            inquiry_order: {}
        }
    }

    componentDidMount() {
        let dataId = common.common.getQueryVariable('id')
        this.setState({ pageId: dataId })
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
                this.getCheckData(id)
                this.setState({
                    showData: data,

                })
            } else {
                message.warning(res.message)
            }
        })
    }


    // 询价单详情  记得做笔记
    getQuotationOrder(id) {
        http.get(api.productList + id + '/product/list').then(res => {
            if (res.code == 1) {
                let data = res.data.items.filter(item => {
                    let resultMap = {};
                    item.options.forEach(option => {
                        if (typeof resultMap[option.param.id] === 'undefined') {
                            resultMap[option.param.id] = {
                                name: option.param.name,
                                child: [option.name]
                            }
                        } else {
                            resultMap[option.param.id]['child'].push(option.name)
                        }
                    })

                    let resutlList = [];
                    for (let key in resultMap) {
                        resutlList.push(resultMap[key]);
                    }

                    item.resutlList = resutlList

                    return true
                })


                this.setState({
                    proList: data
                })
            } else {
                message.warning(res.message)
            }
        })

    }


    getCheckData = (id) => {
        http.get('/quote/order/' + id + '/valid').then(res => {
            if (res.code == 1) {
                this.setState({ checkDay: res.data })
            } else {
                message.warning(res.message)
            }

        })
    }


    render() {
        const { proList, checkDay, showData } = this.state
        return (
            <div className='table-order'>
                <table id='order'>
                    <thead>
                        <tr >
                            <th colSpan="13" className='tab-title'>
                                <div className='text-all'>
                                    <div className='tab-text'>
                                        报价单
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='title-li'>
                            <td style={{ textAlign: 'end' }}>询价单位：</td>
                            <td colSpan="2">{showData.customer_name}</td>
                            <td colSpan="2"></td>
                            <td style={{ textAlign: 'end' }} colSpan="2">报价单位：</td>
                            <td colSpan="2"></td>
                            <td ></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'end' }}>询价人：</td>
                            <td colSpan="2">{showData.inquiry_order.customer_representative_name}</td>
                            <td colSpan="2"></td>
                            <td style={{ textAlign: 'end' }} colSpan="2">报价人：</td>
                            <td colSpan="2">{showData.pricing_offer_name}</td>
                            <td ></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'end' }}>电话：</td>
                            <td colSpan="2">{showData.inquiry_order.customer_representative_contact}</td>
                            <td colSpan="2"></td>
                            <td style={{ textAlign: 'end' }} colSpan="2">电话：</td>
                            <td colSpan="2"></td>
                            <td ></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'end' }}>email：</td>
                            <td colSpan="2">{showData.inquiry_order.customer_representative_email}</td>
                            <td colSpan="2"></td>
                            <td style={{ textAlign: 'end' }} colSpan="2">email：</td>
                            <td colSpan="2"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>序号</td>
                            <td colSpan="2">产品名称</td>
                            <td colSpan="2">产品编号</td>
                            <td colSpan="2">产品说明</td>
                            <td colSpan="2" style={{ width: 100 }}>产品规格</td>
                            <td>产品单位</td>
                            <td>询价数量</td>
                            <td style={{ width: 105 }}>
                                单价/RMB <br />
                                （含税含运价）
                            </td>
                            <td>    
                                报价合计<br />
                                （含税含运价）
                            </td>
                        </tr>

                        {/* 循环 */}
                        {proList.length != 0 &&
                            proList.map((e, index) => (
                                <tr key={index} className='tab-body'>
                                    <td>{index + 1}</td>
                                    <td colSpan="2">
                                        {e.name}
                                    </td>
                                    <td colSpan="2">
                                        {e.number}
                                    </td>
                                    <td colSpan="2">
                                        {
                                            e.resutlList.map(i => (
                                                <div>
                                                    {i.name}（{i.child.join(',')}）
                                                </div>
                                            ))
                                        }
                                    </td>
                                    <td colSpan="2" style={{ width: 100 }}>
                                        {e.specification}
                                    </td>
                                    <td>
                                        {e.unit}
                                    </td>
                                    <td>
                                        {e.check_price_order_details.map((i, index1) => (
                                            <div key={index1}>
                                                {i.quantity}
                                            </div>
                                        ))

                                        }
                                    </td>
                                    <td style={{ width: 105 }}>
                                        {e.check_price_order_details.map((i, index2) => (
                                            <div key={index2}>
                                                {i.unit_quote}
                                            </div>
                                        ))

                                        }
                                    </td>
                                    <td>
                                        {e.check_price_order_details.map((i, index3) => (
                                            <div key={index3}>
                                                {i.total_quote}
                                            </div>
                                        ))

                                        }
                                    </td>
                                </tr>
                            ))
                        }
                        <tr>
                            <td colSpan="13">
                                <div className='tab-foot'>
                                    备注：
                                    <div>
                                        1.以上报价为RMB含税价格；
                                    </div>
                                    <div className='fs'>
                                        2.报价有效期为
                                        <div className='check-day'>
                                            <span>{checkDay} </span>
                                        </div>
                                        天；
                                    </div>
                                    <div>
                                        3.付款方式：{showData.inquiry_order.settlement_mode_desc}
                                    </div>
                                    <div>
                                        4.品质标椎：以上报价均按照上述所列出的材料，规格，工艺，订单量及同类产品基本品质要求进行报价，如有任何不一致信息或其他特殊要求，敬请提出，我司将按照贵司更新后的信息重新报价。
                                    </div>
                                </div>
                            </td>

                        </tr>
                        <tr style={{ height: 80 }}>
                            <td>客户确认回签：</td>
                            <td colSpan="12"></td>
                        </tr>
                    </tbody>
                </table>
            </div >
        );
    }
}

export default down_quotation_order;