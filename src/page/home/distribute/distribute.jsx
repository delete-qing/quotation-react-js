import React, { Component } from 'react'
import { Table, Button, Modal, Select, message } from 'antd';
import common from '../../../../public/common'
import http from '../../../http'
import api from '../../../http/httpApiName'
import '../index.css'
export default class index extends Component {
    state = {
        pageId: "",
        columns: [
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品名称',
                dataIndex: 'name',
            },
            {
                title: '产品说明',
                width: 400,
                render: (text, record) => {
                    let resultMap = {};
                    record.options.forEach(option => {
                        if (typeof resultMap[option.param.id] === 'undefined') {
                            resultMap[option.param.id] = {
                                name: option.param.name,
                                remark: option.pivot.remark,
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
                    record.show = resutlList
                    return (
                        <div>
                            {record.show.map((e, index) => (
                                <div key={index}>
                                    {e.name}
                                    {e.remark != '' &&
                                        <>
                                            （{e.remark}）
                                        </>

                                    }：（{e.child.join('，')}）
                                </div>
                            ))}
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
                width: 450,
                render: (text, record) => (
                    <div>
                        {
                            record.pack_units.map((e, index) => (
                                <div key={index}>
                                    <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                        {index + 1}级包装单位：{e.name}，
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
                )
            },
            {
                title: '询价数量',
                render: (text, record) => (
                    <div>
                        {
                            record.quantities.map((e, index) => (
                                <div key={index}>
                                    {e.quantity}{e.unit}
                                </div>
                            ))
                        }
                    </div>
                )

            },
            {
                title: '样品编号',
                dataIndex: 'sample_number',
            },
            {
                title: '附件',
                render: (text, record) => (
                    <div>
                        {record.attaches.length != 0 &&
                            record.attaches.map((e, index) => (
                                <a className='tab-dowon' key={index} onClick={() => this.tabDownLoad(e.file_id, e.storage_location)}>
                                    {e.filename}
                                </a>
                            ))
                        }
                    </div>
                )
            },
            {
                title: '来源属性',
                render: (text, record) => (
                    <div>
                        <div>{record.source_attribute_desc}</div>
                        <a onClick={() => this.setSourcetAtribute(record.id)}>设置</a>
                    </div>
                )
            }
        ],
        list: [],
        showData: {
            delivery_address: {
                province: '',
                city: '',
                district: '',
                detail: ''
            }
        },

        isModalVisible: false,
        productShow: {
            options: [],
            pack_units: [],
            show: [],
            quantity: []
        },
        assign: [
            {
                id: 1,
                name: '自制'
            },
            {
                id: 2,
                name: '自制&外购（该选项在询价阶段将当做【外购】）'
            },
            {
                id: 3,
                name: '外购'
            }
        ]

    }

    componentDidMount() {
        let num = common.common.getQueryVariable('id')
        this.setState({ pageId: num })
        this.getData(num)
    }

    getData(id) {
        http.get(api.orderGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.getCheckOrderProduct(data.id)

                this.setState(
                    {
                        showData: data,
                    }
                )
            } else {
                message.warning(res.message);
            }
        })
    }

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
    // 设置来源属性
    setSourcetAtribute = (id) => {
        http.get(api.productGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                let resultMap = {};
                console.log('data: ', data);

                data.options.forEach(option => {
                    if (typeof resultMap[option.param.id] === 'undefined') {
                        resultMap[option.param.id] = {
                            name: option.param.name,
                            remark: option.pivot.remark,
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
                data.show = resutlList

                let quantityList = []
                data.quantities.forEach(q => {
                    q.unitQuantity = q.quantity + q.unit
                    quantityList.push(q.unitQuantity)

                })
                data.quantity = quantityList
                console.log('data: ', data);

                this.setState({
                    isModalVisible: true,
                    productShow: data,
                })
            } else {
                message.warning(res.message);
            }
        })

    }
    handleOk = () => {
        const { pageId, productShow } = this.state
        let params = {
            id: Number(pageId),
            products: [
                {
                    id: productShow.id,
                    source_attribute: productShow.source_attribute
                }
            ]
        }
        http.post(api.orderAssign, params).then(res => {
            console.log(res);
            if (res.code == 1) {
                message.success('设置成功')
                this.setState({ isModalVisible: false })
                this.getData(pageId)
            } else {
                message.warning(res.message);
            }
        })


    }

    handleCancel = () => {
        this.setState({ isModalVisible: false })
    }
    handleChangeAssign = (value) => {
        const { productShow } = this.state
        productShow.source_attribute = value
        this.setState({ productShow })
    }

    saveIt = () => {
        const { confirm } = Modal;
        const { pageId } = this.state
        let history = this.props.history
        confirm({
            title: '您确定要提交当前询价单么？提交之后将不可再次分配当前询价单。',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                http.get(api.assignConfirm, {
                    params: {
                        id: pageId
                    }
                }).then(res => {
                    if (res.code == 1) {
                        message.success('提交成功')
                        setTimeout(function () {
                            common.pathData.getPathData(
                                {
                                    path: '/productPrice',
                                    data: {
                                        type: 1
                                    },
                                    history: history
                                }
                            )
                        }, 500)
                    } else {
                        message.warning(res.message);
                    }
                })
            },
        });
    }

    tabDownLoad(id, storage_location) {
        common.downFile.down(id, storage_location)
    }

    render() {
        const { columns, list, showData, isModalVisible, productShow, assign } = this.state
        const { Option } = Select;
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

                    <div className="mt-15">
                        <Table rowKey={record => record.id} columns={columns} dataSource={list} pagination={false} />
                    </div>
                    <div>
                        <div className="mt-15">
                            <div className="mt-15 fs">
                                <span className="db w300">交付方式：{showData.delivery_mode_desc}</span>
                                <span className="db w300">运输方式：{showData.transport_mode_desc}</span>
                            </div>
                            <div className="mt-15 fs">
                                <span className="db w300">结算方式：{showData.settlement_mode_desc}</span>
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
                    <div className="footer-flex">
                        <Button type="primary" onClick={this.saveIt}>提交</Button>
                    </div>
                    <div>
                        <Modal title="设置" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} cancelText="取消" okText="确定" width='800px' maskClosable={false}>
                            <div>
                                <div className="model-title">
                                    <span>产品名称：{productShow.name}</span>
                                    <span>产品规格：{productShow.specification}</span>
                                    <span>产品附件：</span>
                                </div>
                                <div className="model-title mt-15">
                                    <span>产品编号：{productShow.number}</span>
                                    <span>产品单位：{productShow.unit}</span>
                                    <span>样品编号：{productShow.sample_number}</span>
                                </div>
                                <div className=" mt-15">
                                    <span>询价数量：{productShow.quantity.join('，')}</span>
                                </div>
                                <div className="mt-15" style={{ display: 'flex' }}>
                                    <div>询价选项：</div>

                                    <div>
                                        {productShow.show.length != 0 &&
                                            productShow.show.map((e, index) => (
                                                <div key={index} className='mb-15'>
                                                    {e.name}
                                                    {
                                                        e.remark != '' &&

                                                        <>
                                                            （{e.remark}）
                                                        </>

                                                    }
                                                    ：（{e.child.join('，')}）
                                                </div>
                                            ))

                                        }
                                    </div>
                                </div>
                                <div>
                                </div>
                                <div style={{ display: 'flex', marginBottom: 15 }}>
                                    <div>包装单位：</div>
                                    {productShow.pack_units.map((k, index) => (
                                        <div key={index} style={{ marginBottom: '15px', display: 'flex' }}>
                                            <span>{index + 1}级包装单位：{k.name}</span>，
                                            <span>
                                                {k.pack_material != null &&
                                                    <span>包装材质：{k.pack_material.name}，</span>
                                                }
                                                <span>包装要求：{k.capacity_type_desc}</span>，
                                                <span >包装容量：{k.capacity_value}</span>
                                            </span>
                                        </div>
                                    ))
                                    }
                                </div>
                                <div>
                                    <span>来源属性：</span>
                                    <Select style={{ width: 400 }} onChange={this.handleChangeAssign} value={productShow.source_attribute}>
                                        {assign.map(e => (
                                            <Option key={e.id} value={e.id}>
                                                {e.name}
                                            </Option>
                                        ))
                                        }
                                    </Select>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div >
        )
    }
}
