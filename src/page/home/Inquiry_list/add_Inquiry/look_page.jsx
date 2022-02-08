import React, { Component } from 'react';
import { Table, message, Tooltip } from 'antd';
import http from '../../../../http/index'
import api from '../../../../http/httpApiName'
import common from '../../../../../public/common';

class lookPage extends Component {

    state = {
        pageId: '',
        showData: {},
        columns: [
            {
                title: '核价单号',
                fixed: true,
                render: (text, record) => {
                    let show = []
                    record.check_price_orders.forEach(e => {
                        show = <>
                            <div>
                                {e.number}
                            </div>
                        </>
                    })
                    return (
                        <div>
                            {show}
                        </div>
                    )
                },
            },
            {
                title: '产品编号',
                dataIndex: 'number',

            },
            {
                title: '产品名称',
                width: 280,
                dataIndex: 'name',

            },
            {
                title: '产品说明',
                width: 400,
                render: (text, record) => {
                    let show = []
                    record.options.forEach(e => {
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
                }
            },

            {
                title: '产品规格',
                dataIndex: 'specification',
            },
            {
                title: '计数单位',
                dataIndex: 'unit',
            },
            {
                title: '包装要求',
                width: 500,
                render: (text, record) => {
                    let show = []
                    show = record.pack_units
                    return (
                        <div>
                            {
                                show.map((e, index) => (
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
                                            包装容量：{e.capacity_type_desc}，
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
                    )
                }
            },
            {
                title: '询价数量',
                render: (text, record) => {
                    let show = []
                    show = record.quantities
                    return (
                        <div>
                            {show.map((i, index) => (
                                <div key={index}>
                                    <div>
                                        {i.quantity}{i.unit}
                                    </div>
                                </div>
                            ))

                            }

                        </div>
                    )
                }
            },
            {
                title: '样品编号',
                dataIndex: 'sample_number',
            },
            {
                title: '附件',
                render: (text, record) => {
                    let show = []
                    show = record.attaches

                    return (
                        <div>
                            {
                                show.map((e, index) => (
                                    <a key={index} className='tab-dowon' key={index} onClick={() => this.tabDownLoad(e.file_id, e.storage_location)}>
                                        {e.name}
                                    </a>
                                ))
                            }
                        </div>
                    )
                }
            },
            {
                title: '状态',
                render: (text, record) => {
                    let show
                    if (record.check_price_orders.length != 0) {
                        show = record.check_price_orders[0].status_desc
                    }
                    return (
                        <div>{show}</div>
                    )

                }

            },
            {
                title: '来源属性',
                dataIndex: 'source_attribute_desc',

            },
            {
                title: 'BOM工单号',
                width: 180,
                dataIndex: 'work_order_number',
            },
            {
                title: '采购询价单号',
                render: (text, record) => (
                    <div>
                        <a style={{ color: 'red' }}>后端，暂无数据</a>
                    </div>
                ),
                // TODO
            },
            {
                title: '操作',
                width: 100,
                fixed: 'right',
                render: (text, record) => (
                    <div>
                        <a onClick={() => this.goLookProductPage(record)} >查看</a>
                    </div>
                )
            }
        ],
        list: [],
        quoteColumns: [
            {
                title: '报价单号',
                dataIndex: 'number',
            },
            {
                title: '报价日期',
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
                    if (record.approve_logs.length != 0) {
                        show = record.approve_logs
                    }
                    return (
                        <div>
                            {show.map((i, index) => (
                                <div key={index}>
                                    <div>
                                        {i.approver_name}
                                    </div>
                                </div>
                            ))

                            }

                        </div>
                    )
                }
            },
        ],
        quoteList: [],
        descriptionName: '',
    }

    componentDidMount() {
        let data = common.common.getQueryVariable('id')
        this.setState({ pageId: data })
        if (data) {
            this.getShowData(data)
        }
    }

    getShowData(data) {
        http.get(api.orderGet, {
            params: {
                id: data
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.getCheckOrderProduct(data.id)
                this.getQuoteOrderProduct(data.id)
                this.getSettlement(data.settlement_id)
                this.setState({
                    showData: data,
                })
            } else {
                message.warning(res.message);
            }
        })

    }

    getSettlement(id) {
        http.get(api.settlementGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.setState({ descriptionName: data.name })
                console.log('data: ====', data);
            } else {
                message.warning(res.message)
            }
        })
    }


    // 询价单
    getCheckOrderProduct(id) {
        http.get('/inquiry/order/get/' + id + '/product/list').then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ list: data })
            } else {
                message.warning(res.message);
            }
        })
    }
    // 查看报价
    getQuoteOrderProduct(id) {
        http.get('/inquiry/order/get/' + id + '/quote/list').then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ quoteList: data })
            } else {
                message.warning(res.message);
            }
        })
    }
    // 查看产品
    goLookProductPage(data) {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/lookProduct?id=' + data.id,
                data: {
                    type: 1,
                    id: data.id
                },
                history: history
            }
        )

    }
    render() {
        const { showData, columns, list, quoteColumns, quoteList, descriptionName } = this.state
        return (
            <div className="page">
                <div>
                    <div className='mb-15 fs'>
                        <span>
                            客户名称： {showData.customer_name}
                        </span>
                    </div>
                    <div className='mb-15 fs'>
                        <span className="title-block w300">
                            询价单号：{showData.number}
                        </span>
                        <span className="title-block w300">
                            询价类型：{showData.type_desc}
                        </span>
                        <span className="title-block w300">
                            销售人员：{showData.salesperson_name}
                        </span>
                    </div>
                    <div className='mb-15'>
                        <span className="title-block w300">
                            询价人员：{showData.customer_representative_name}
                        </span>
                        <span className="title-block w300">
                            联系电话：{showData.customer_representative_contact}
                        </span>
                        <span className="title-block w300">
                            邮箱地址：{showData.customer_representative_email}
                        </span>
                    </div>
                </div>
                <div className='mb-15'>
                    <Table rowKey={record => record.id} columns={columns} dataSource={list} pagination={false} scroll={{ x: 3000 }} bordered title={() => '产品'} />
                </div>
                <div className='mb-15'>
                    <Table rowKey={record => record.id} columns={quoteColumns} dataSource={quoteList} pagination={false} bordered title={() => '报价记录'} />
                </div>
                <div>
                    <div className="mt-15">
                        <div className="mt-15 fs">
                            <span className="db w300">交付方式：{showData.delivery_mode_desc}</span>
                            <span className="db w300">运输方式：{showData.transport_mode_desc}</span>
                        </div>
                        <div className="mt-15 fs">
                            <span className="db w300">结算方式：{descriptionName}</span>
                            <span className="db w300">交付期限：{showData.delivery_at}</span>
                        </div>
                        <div className="mt-15">
                            <span className="">交付地址：{showData.address}</span>
                        </div>
                        <div className="mt-15">
                            <span className="mr-100">结算说明：{showData.settlement_instr}</span>
                        </div>
                        <div className="mt-15">
                            <span className="mr-100">询价备注：{showData.remark}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default lookPage;