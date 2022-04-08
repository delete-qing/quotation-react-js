import React, { Component } from 'react';
import { Table, message, Pagination, Input, Button, Select, Divider } from 'antd';
import common from '../common/common';
import http from '../../http/index'
import api from "../../http/httpApiName";
import './product_price.css'



class index extends Component {

    state = {
        columns: [
            {
                title: '核价单号',
                dataIndex: 'number',
                width: 150,
                fixed: true,
            },
            {
                title: '询价单号',
                dataIndex: 'related_number',
                width: 150,
                fixed: true,
            },
            {
                title: '产品编号',
                render: (text, record) => (
                    <>
                        {
                            record.product != null &&
                            <span>{record.product.number}</span>
                        }
                    </>
                ),

                width: 150
            },
            {
                title: '产品名称',
                width: 130,
                render: (text, record) => (
                    <>
                        {
                            record.product != null &&
                            <span>{record.product.name}</span>
                        }
                    </>
                ),
            },
            {
                title: '产品说明',
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
                                remark: e.remark,
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
                width: 300
            },
            {
                title: '产品规格',
                render: (text, record) => (
                    <>
                        {
                            record.product != null &&
                            <span>{record.product.specification}</span>
                        }
                    </>
                ),
                width: 180
            },
            {
                title: '计数单位',
                width: 100,
                render: (text, record) => (
                    <>
                        {
                            record.product != null &&
                            <span>{record.product.unit}</span>
                        }
                    </>
                ),
            },
            {
                title: '核价状态',
                dataIndex: 'status_desc',
                width: 150,
            },
            {
                title: 'PE人员',
                dataIndex: 'pe_person_name',
                width: 150,
            },
            {
                title: '包装要求',
                width: 400,
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.pack_units.map((e, index) => (
                                    <div key={index}>
                                        <span style={{ display: 'inline-block', marginRight: '10px' }}>{index + 1}级包装单位：{e.name}</span>，
                                        {e.pack_material != null &&
                                            <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                                包装材质：{e.pack_material.name}，
                                            </span>
                                        }
                                        <span style={{ display: 'inline-block', marginRight: '10px' }}> 包装容量：{e.capacity_type_desc}</span>，

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
                title: '核价数量',
                dataIndex: 'age',
                width: 200,
                render: (text, record) => (
                    <>
                        {record.product != null &&
                            <div>
                                {record.product.quantities.map(e => (
                                    <div key={e.id}>
                                        {e.quantity}{e.unit}
                                    </div>
                                ))

                                }
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
                title: '相关类型',
                dataIndex: 'related_type_desc',
                width: 150,
            },
            {
                title: '匹配物料编号',
                render: (text, record) => (
                    <>
                        <span>{record.product.show_material_sku_number}</span>
                    </>
                ),
            },
            {
                title: '匹配UOM编号',
                render: (text, record) => (
                    <>
                        <a style={{ color: 'red' }}>后端，暂无字段</a>
                    </>
                ),
            },
            {
                title: '来源属性',

                render: (text, record) => (
                    <>
                        {
                            record.product != null &&
                            <span>{record.product.source_attribute_desc}</span>
                        }
                    </>
                ),
                width: 150,
            },

            {
                title: '核价时间',
                dataIndex: 'created_at',
                width: 200,
            },
            {
                title: '核价有效期(天)',
                dataIndex: 'valid_period_day',
                width: 150,
            },
            {
                title: '操作',
                width: 150,
                fixed: 'right',
                render: (text, record) => {
                    let look
                    let config
                    let check
                    let analyze
                    look = <a onClick={() => this.goPriceList(record.id)}>查看</a>
                    analyze = <a onClick={() => this.goAnalyze(record.id)}>成本分析</a>

                    if (record.status == 3 || record.status == 4) {
                        config = <a onClick={() => this.goBomPage()}>配置BOM</a>
                    } else {
                        config = <a style={{ color: '#ccc' }}>配置BOM</a>
                    }

                    if (record.status == 5 || record.status == 6) {
                        check = <a onClick={() => this.goPriceList(record.id)}>核价</a>
                    } else {
                        check = <a style={{ color: '#ccc' }}>核价</a>
                    }


                    return (
                        <div>
                            <div className='mb-5'>
                                {look}
                                < Divider type="vertical" />
                                {config}
                            </div>
                            <div>
                                {check}
                                < Divider type="vertical" />
                                {analyze}
                            </div>


                        </div >
                    )

                }

            },
        ],
        listData: [],
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
        },
        pageSizeOptions: [5, 10, 15, 20],
        serach: {
            number: '',
            related_number: '',
            status: '',
            related_type: '',
            customer_name: '',
            product_name: '',
            product_number: '',
            pe_person_name: '',
        },
        statuslist: [],
        relatedTypeOption: [
            {
                id: '',
                name: '全部'
            },
            {
                id: 1,
                name: '意向询价'
            },
            {
                id: 2,
                name: '精准询价 '
            }
        ],
        type: 1,
    }
    componentDidMount() {
        this.getList()
        this.getStatus()
    }

    getList(type = 1) {
        const { pagination, serach } = this.state
        http.get(api.checkList[type], {
            params: {
                per_page: pagination.pageSize,
                page: pagination.current,
                number: serach.number,
                related_number: serach.related_number,
                status: serach.status,
                related_type: serach.related_type,
                product_name: serach.product_name,
                customer_name: serach.customer_name,
                product_number: serach.product_number,
                pe_person_name: serach.pe_person_name
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                pagination.total = res.data.total
                this.setState({ listData: data })
            } else {
                message.warning(res.message);
            }
        })
    }
    goPriceList = (id) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/priceList?id=' + id,
                data: {
                    type: 1,
                    id: id
                },
                history: history
            }
        )
    }
    onChangePage = (page, pageSize) => {
        const { pagination, type } = this.state
        pagination.current = page
        pagination.pageSize = pageSize
        this.setState({ pagination })
        this.getList(type)
    }
    changeSerachInput = (e) => {
        const { serach } = this.state
        serach[e.target.name] = e.target.value
        this.setState({ serach })
    }
    serchIt = (type) => {
        const { pagination } = this.state
        pagination.current = 1
        this.setState({ pagination, type })
        this.getList(type)
    }
    // 获取状态
    getStatus() {
        http.get(api.checkStatus).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.setState({ statuslist: data })
            } else {
                message.warning(res.message)
            }
        })
    }
    handleChangeOption = (value) => {
        const { serach } = this.state
        serach.status = value
        this.setState({ serach })
        this.getList()
    }
    handleChangeRelatedTypeOption = (value) => {
        const { serach } = this.state
        serach.related_type = value
        this.setState({ serach })
        this.getList()
    }
    goBomPage = () => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/QuotationForm',
                data: {
                    type: 2,
                },
                history: history
            }
        )
    }
    goAnalyze = (id) => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/analyze?id=' + id,
                data: {
                    id: id,
                    type: 3,
                },
                history: history
            }
        )
    }

    render() {
        const { listData, columns, pagination, pageSizeOptions, statuslist, relatedTypeOption } = this.state
        const { Option } = Select;
        return (
            <div className="page">
                <div className='mb-15 fs'>
                    <div className='mr-15'>
                        <span>核价单号：</span>
                        <Input name='number' onChange={this.changeSerachInput} className="w200" placeholder="请输入核价单号" />
                    </div>
                    <div className='mr-15'>
                        <span>询价单号：</span>
                        <Input name='related_number' onChange={this.changeSerachInput} className="w200" placeholder="请输入询价单号" />
                    </div>
                    <div className='mr-15'>
                        <span>客户名称：</span>
                        <Input name='customer_name' onChange={this.changeSerachInput} className="w200" placeholder="请输入客户名称" />
                    </div>
                    <div className='mr-15'>
                        <span>产品编号：</span>
                        <Input name='product_number' onChange={this.changeSerachInput} className="w200" placeholder="请输入产品编号" />
                    </div>
                </div>
                <div className='mb-15 fs'>

                    <div className='mr-15'>
                        <span>核价状态：</span>
                        <Select style={{ width: 200 }} onChange={this.handleChangeOption} placeholder="请选择">
                            {statuslist.map(e => (
                                <Option key={e.id} value={e.id}>{e.name}</Option>
                            ))
                            }
                        </Select>
                    </div>
                    <div className='mr-15'>
                        <span>相关类型：</span>
                        <Select style={{ width: 200 }} onChange={this.handleChangeRelatedTypeOption} placeholder="请选择">
                            {relatedTypeOption.map(e => (
                                <Option key={e.id} value={e.id}>{e.name}</Option>
                            ))
                            }
                        </Select>
                    </div>
                    <div className='mr-15'>
                        <span>P&nbsp;E&nbsp;&nbsp;人&nbsp;员：</span>
                        <Input name='pe_person_name' onChange={this.changeSerachInput} className="w200" placeholder="请输入PE人员" />
                    </div>
                    <div className='mr-15'>
                        <span>产品名称：</span>
                        <Input name='product_name' onChange={this.changeSerachInput} className="w200" placeholder="请输入产品名称" />
                    </div>
                    <div>
                        <Button type="primary" onClick={() => this.serchIt(1)}>搜索</Button>
                        <Button type="primary" className='ml-15' onClick={() => this.serchIt(2)}>搜索公司全部相关信息</Button>
                    </div>
                </div>
                <Table rowKey={record => record.id} columns={columns} dataSource={listData} scroll={{ x: 3500 }} pagination={false} />
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
                    <Pagination current={pagination.current} total={pagination.total}
                        pageSize={pagination.pageSize} onChange={this.onChangePage} pageSizeOptions={pageSizeOptions} showSizeChanger />
                </div>
            </div >
        );
    }
}

export default index;