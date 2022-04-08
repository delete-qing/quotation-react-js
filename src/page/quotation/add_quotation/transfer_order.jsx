import React, { Component } from 'react';
import { Table, Button, message, InputNumber, Select } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import common from '../../common/common'
import http from '../../../http/index'
import api from '../../../http/httpApiName'



class transfer_order extends Component {
    state = {
        pageId: '',
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
                dataIndex: 'address',
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
                title: '报价金额（元）',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    < div >
                                        <span>
                                            {e.actual_quote}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div >
                )
            },
            {
                title: '报价单价（元）',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    < div >
                                        <span>
                                            {e.unitlPrice}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div >
                )
            },
        ],
        proList: [],
        showData: {
            inquiry_order: {},
            attaches: [],
            order_id: ''
        },

        selectProductList: [],
        selectedRowKeys: [],
        minNum: 0,
        selectMin: {},
        descriptionName: '',
    }
    componentDidMount() {
        let data = common.common.getQueryVariable('id')
        this.setState({ pageId: data })
        if (data) {
            this.getData(data)
        }
    }
    getData(id) {
        http.get(api.quoteGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.getSettlement(data.inquiry_order.settlement_id)
                this.getQuotationOrder(data.inquiry_order_id)
                this.setState({
                    showData: data,
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
                data.forEach(e => {
                    e.checked = false
                    e.check_price_order_details = e.check_price_order_details.filter(i => {
                        i.unitlPrice = i.actual_quote / i.quantity
                        i.show = 0
                        return true
                    }).sort((a, b) => {
                        return a.quantity - b.quantity
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

    getSettlement(id) {
        http.get(api.settlementGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.setState({ descriptionName: data.name })
            } else {
                message.warning(res.message)
            }
        })
    }

    downLoadFile = (id, storage_location) => {
        common.downFile.down(id, storage_location)
    }

    onChangeCheckbox(event, index) {
        const { proList, selectProductList } = this.state
        let sList = null
        proList.forEach((e, index1) => {
            if (index == index1) {
                e.checked = event.target.checked
                if (e.checked) {
                    sList = e
                }

            }
        })

        if (sList != null) {
            this.setState({
                selectProductList: [...selectProductList, sList],
                proList: [...proList],
            })
        }

    }

    // 这个方法研究下
    onSelectChange = (keys, rows) => {
        const { selectMin } = this.state
        let arr = []
        rows.forEach(e => {
            e.isShowQuantity = 1
            let min = 0
            e.selectUnitPrice = e.check_price_order_details[0].unitlPrice
            if (e.check_price_order_details.length > 1) {
                e.check_price_order_details.forEach((i, index) => {
                    arr.push(i.quantity)
                    if (!index) {
                        min = i.quantity
                    }
                })
                e.minQuantity = Math.min.apply(Math, arr)
            } else {
                e.check_price_order_details.forEach((i, index) => {
                    e.minQuantity = i.quantity
                    if (!index) {
                        min = i.quantity
                    }
                })
            }
            selectMin[e.id] = min
        })
        this.setState({
            selectedRowKeys: keys,
            selectProductList: [...rows],
        });
    };

    isShow = (data, index) => {
        const { selectProductList } = this.state
        let num = data.isShowQuantity
        if (num == 1) {
            num = 2
        } else {
            num = 1

        }
        data.isShowQuantity = num

        this.setState({ selectProductList })

    }

    changeaCtualQuote = (value, record) => {
        const { selectProductList } = this.state
        record.minQuantity = value
        let numArr = []
        let minData = value
        selectProductList.forEach(e => {
            e.check_price_order_details.forEach(i => {
                numArr.push(i)
                numArr.forEach((j) => {
                    if (j.quantity <= minData) {
                        e.selectUnitPrice = j.unitlPrice
                    }
                })
            })
        })
        this.setState({ selectProductList })
    }

    // 转订单

    creatOrder = () => {
        const { selectProductList, pageId, showData } = this.state
        let params = {
            id: Number(pageId),
            details: [],
        }
        selectProductList.forEach(e => {
            params.details.push(
                {
                    id: e.id,
                    quantity: e.minQuantity
                }
            )
        })

        http.post(api.orderTransfer, params).then(res => {
            if (res.code == 1) {
                message.success('创建成功')
                let history = this.props.history
                setTimeout(() => {
                    common.pathData.getPathData(
                        {
                            data: {
                                type: 1,
                                order_id: showData.order_id

                            },
                            history: history
                        }
                    )

                }, 1000);
            } else {
                message.warning(res.message)
            }
        })

    }

    handleChangeSelect = (value) => {
        const { selectProductList } = this.state
        let data = common.clone.deepClone(selectProductList)
        data.forEach(e => {
            e.check_price_order_details.forEach(i => {
                if (i.id == value) {
                    e.selectUnitPrice = i.unitlPrice
                    e.minQuantity = i.quantity
                    console.log('e.selectUnitPrice: ', e.selectUnitPrice);
                }
            })
        })
        this.setState({ selectProductList: data })

    }


    render() {
        const { columnsPro, proList, showData, selectProductList, selectedRowKeys, selectMin, descriptionName } = this.state

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { Option } = Select;
        const selectProduct = [
            {
                title: '产品名称',
                dataIndex: 'name'
            },
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品说明',
                dataIndex: 'address',
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
                title: '下单数量',
                render: (text, record, index) => {
                    let show
                    if (showData.inquiry_order.type == 2) {
                        show = <>
                            <Select defaultValue={record.check_price_order_details[0].id} style={{ width: '120px' }} onChange={this.handleChangeSelect}>
                                {record.check_price_order_details.map(item => (
                                    <Option key={item.id} value={item.id}>{item.quantity}{item.unit}</Option>
                                ))
                                }
                            </Select>
                        </>
                    } else {
                        show = <div>
                            {record.isShowQuantity == 1 &&
                                <div>
                                    {record.minQuantity}
                                    <EditTwoTone className="ml-10" onClick={() => this.isShow(record, index)} />
                                </div>
                            }
                            {record.isShowQuantity == 2 &&
                                <div>
                                    <InputNumber className="w120 mr-10" value={record.minQuantity} min={selectMin[record.id]}
                                        onChange={(event) => this.changeaCtualQuote(event, record)} onBlur={() => this.isShow(record, index)} />
                                </div>
                            }

                        </div>
                    }
                    return (
                        <div>{show}</div>
                    )

                }
            },
            {
                title: '单价(元)',
                dataIndex: 'selectUnitPrice',
            },
            {
                title: '下单金额(元)',
                render: (text, record, index) => (
                    <div>
                        {Number(record.minQuantity) * Number(record.selectUnitPrice)}
                    </div >
                )
            },
        ]

        return (
            <div className='page '>
                <div className='mb-15 fs'>
                    <span className='w300 db'>报价单号：{showData.number}</span>
                    <span className='w300 db'>报价人员：{showData.pricing_offer_name}</span>
                    <span className='w300 db'>创建时间：{showData.created_at}</span>
                </div>
                <div className='mb-15 fs'>
                    <span className='w300 db'>询价单号：{showData.related_number}</span>
                    <span className='w300 db'>询价人员：{showData.inquiry_order.customer_representative_name}</span>
                    <span className='w300 db'>询价时间：{showData.inquiry_order.created_at}</span>
                </div>
                <div className='mb-15 fs'>
                    <span className='w300 db'>询价类型：{showData.inquiry_order.type_desc}</span>
                    <span className='w300 db ellipsis-line'>客户名称：{showData.customer_name}</span>
                    <span className='w300 db'>联系电话：{showData.inquiry_order.customer_representative_contact}</span>

                </div>
                <div className='mb-15 fs'>
                    <span className='w300 db'>销售人员：{showData.inquiry_order.salesperson_name}</span>
                    <span className='w300 db'>交付方式：{showData.inquiry_order.delivery_mode_desc}</span>
                    <span className='w300 db'>交付期限：{showData.inquiry_order.delivery_at}</span>

                </div>
                <div className='mb-15 fs'>
                    <span className='w300 db'>交付地址：{showData.inquiry_order.address}</span>
                    <span className='w300 db'>运输方式：{showData.inquiry_order.transport_mode_desc}</span>
                    <span className='w300 db'>结算方式：{descriptionName}</span>
                </div>
                <div className='mb-15 fs'>
                    <span className='w300 db'>结算说明：{showData.inquiry_order.settlement_instr}</span>
                    <span className='w300 db'>报价备注：{showData.remark}</span>
                </div>
                <div className='mb-15'>
                    <span className='w300 db'>客户确认文件：</span>
                    <div>
                        {showData.attaches.length != 0 &&
                            showData.attaches.map(f => {
                                <div key={f.id} className='down-w '>
                                    <div className='fs-bw'>
                                        <a className='db' onClick={() => this.downLoadFile(f.file_id, f.storage_location)}>{f.filename}</a>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className='mb-15'>
                    <div>
                        <Table
                            rowKey={record => record.id}
                            title={() => '产品'}
                            bordered
                            columns={columnsPro}
                            dataSource={proList}
                            pagination={false}
                            rowSelection={rowSelection} />
                    </div>
                </div>

                <div className='mb-15'>
                    <div>
                        <Table
                            rowKey={record => record.id}
                            title={() => '已选下单产品'}
                            bordered
                            columns={selectProduct}
                            dataSource={selectProductList}
                            pagination={false} />
                    </div>
                </div>
                <div className='botton-quotation'>
                    <Button type="primary" size='large' onClick={this.creatOrder}>
                        创建订单
                    </Button>
                </div>
            </div>
        );
    }
}

export default transfer_order;
