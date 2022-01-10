import React, { Component } from 'react';
import { Select, Input, Button, Modal, Table, Divider, DatePicker, message, Cascader, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import http from '../../../../http/index'
import api from '../../../../http/httpApiName'
import common from '../../../../../public/common';
import '../../index.css'

class add_list extends Component {

    state = {
        company_id: '',
        pageId: '',
        options: [
            {
                id: 1,
                name: '意向询价'
            },
            {
                id: 2,
                name: '精准询价 '
            }
        ],
        type: '',
        paymentMethod: [
            {
                id: 1,
                name: '国内仓交货'
            },
            {
                id: 2,
                name: '出口FOB'
            },
            {
                id: 3,
                name: '出口CIF'
            },
            {
                id: 4,
                name: '出口保税仓交货'
            },
            {
                id: 5,
                name: '工厂取货'
            },
        ],
        transportationMethod: [
            {
                id: 1,
                name: '陆运'
            },
            {
                id: 2,
                name: '空运'
            },
            {
                id: 3,
                name: '海运'
            },
        ],
        settlementMethod: [],
        columnsIndependence: [
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品名称',
                dataIndex: 'name',
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
                                        {e.level}级包装单位：{e.name}，
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
                width: 200,
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
                title: '操作',
                render: (text, record) => (
                    <div>
                        {record.status == 1 &&
                            <div>
                                <a onClick={() => this.editPro(record)}>编辑</a>
                                <Divider type="vertical" />
                                <a style={{ color: 'red' }} onClick={() => this.deletePro(record.id)}>删除</a>
                            </div>
                        }
                        {record.status != 1 &&
                            <div>
                                <a style={{ color: '#ccc' }}>编辑</a>
                                <Divider type="vertical" />
                                <a style={{ color: '#ccc' }} >删除</a>
                            </div>
                        }

                    </div >
                )
            }

        ],
        customerData: [],
        customerId: '',
        adminList: [],
        salespersonId: '',
        telephone: '',
        showData: {
            delivery_mode: '',
            delivery_at: null,
            transport_mode: '',
            remark: '',
            settlement_mode: '',
            settlement_id: '',
            settlement_instr: '',
            delivery_address: {
                province: '',
                city: '',
                district: '',
                detail: '',
            }
        },
        adressData: [],
        disabledButAdd: true,
        saveData: {
            customer_representative_name: '',
            customer_representative_contact: '',
            customer_representative_email: '',
        }

    }
    componentDidMount() {
        let data = common.common.getQueryVariable('id')
        if (data) {
            this.setState({
                pageId: data,
                disabledButAdd: false
            })
            this.getShowData(data)
        }
        this.getCustomerList()
        this.getAdminList()
        this.getAdressData()
        let height = document.getElementById('currentPage').clientHeight
    }

    // 获取询价单详情
    getShowData(data) {
        http.get(api.orderGet, {
            params: {
                id: data
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                data.created_at = moment(data.created_at).format('YYYY/MM/DD')
                if (data.delivery_mode == 0) {
                    data.delivery_mode = ''
                }
                if (data.transport_mode == 0) {
                    data.transport_mode = ''
                }
                data.single_products.forEach(e => {
                    e.status = data.status
                })

                if (data.delivery_address == null) {
                    data.delivery_address = {
                        province: '',
                        city: '',
                        district: '',
                        detail: '',
                    }
                }
                if (data.settlement_id == 0 && data.status == 1) {
                    data.settlement_instr = '100%现付'
                }
                this.getsettlementType(data.customer_id)
                console.log('data.customer_id: ', data.customer_id);
                this.setState({
                    showData: data,
                    company_id: data.company_id
                })
            } else {
                message.warning(res.message);
            }
        })

    }
    // 获取结算方式
    getsettlementType(id) {
        http.get(api.settlementList, {
            params: {
                customer_id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                this.setState({ settlementMethod: data })
            } else {
                message.warning(res.message)
            }
        })

    }
    // 获取客户名称
    getCustomerList() {
        http.get(api.customerList).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ customerData: data })
            } else {
                message.warning(res.message);
            }
        })
    }
    // 改变客户名称
    handleChangeCustomer = (value) => {
        this.setState({ customerId: value })
    }
    // 获取销售人员列表
    getAdminList() {
        http.get(api.adminList).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ adminList: data })
            } else {
                message.warning(res.message);
            }
        })
    }
    // 改变销售人员
    handleChangeAdmin = (value) => {
        this.setState({ salespersonId: value })
    }
    // 改变询价类型
    handleChangeOption = (value) => {
        this.setState({ type: value })
    }
    // 改变电话号码
    handleChangeTelephone = (e) => {
        const { saveData } = this.state
        saveData[e.target.name] = e.target.value
        this.setState({ saveData })
    }
    // 头部保存
    showConfirm = () => {
        const { confirm } = Modal;
        let _that = this
        let { customerId, salespersonId, type, telephone, pageId, saveData } = this.state
        let params = {
            customer_id: customerId,
            type: type,
            salesperson_id: salespersonId,
            customer_representative_name: saveData.customer_representative_name,
            customer_representative_contact: saveData.customer_representative_contact,
            customer_representative_email: saveData.customer_representative_email

        }

        confirm({
            title: '您确定要保存么？保存之后信息不可修改。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                http.post(api.orderSetBasic, params).then(res => {
                    if (res.code == 1) {
                        message.success('添加成功');
                        let history = _that.props.history
                        setTimeout(function () {
                            common.pathData.getPathData(
                                {
                                    path: '/addList?id=' + res.data,
                                    data: {
                                        type: 1,
                                        id: res.data
                                    },
                                    history: history
                                }
                            )
                        }, 1000)
                        _that.setState({
                            pageId: res.data,
                            disabledButAdd: false
                        })
                        _that.getShowData(res.data)

                    } else {
                        message.warning(res.message);
                    }
                })
            },
        });
    }
    // 改变时间
    onChangeTime = (date, dateString) => {
        const { showData } = this.state
        showData.delivery_at = dateString
        this.setState({ showData })
    }
    // 修改运输方式
    changTransport = (value) => {
        const { showData } = this.state
        showData.transport_mode = value
        this.setState({ showData })
    }
    // 修改结算方式
    changSettlement = (value) => {
        const { showData, settlementMethod } = this.state
        showData.settlement_id = value
        settlementMethod.forEach(e => {
            if (e.id == value) {
                showData.settlement_instr = e.description
                showData.settlement_mode = e.type
            }
        })

        this.setState({ showData })
    }
    // 修改备注
    onChangeRemark = (e) => {
        const { showData } = this.state
        showData.remark = e.target.value
        this.setState({ showData })

    }
    // 结算说明
    onChangeInstr = (e) => {
        const { showData } = this.state
        showData.settlement_instr = e.target.value
        this.setState({ showData })
    }
    // 添加产品
    addProduct = () => {
        const { company_id } = this.state
        // this.props.history.push('/IndependenceProduct?id=' + this.state.pageId)
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/IndependenceProduct?id=' + this.state.pageId + '&company_id=' + company_id,
                data: {
                    id: this.state.pageId,
                    company_id: company_id,
                    type: 2,
                },
                history: history
            }
        )
    }
    // 编辑产品
    editPro = (data) => {
        // this.props.history.push('/IndependenceProduct?pid=' + data.id)

        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/IndependenceProduct?pid=' + data.id,
                data: {
                    pid: data.id,
                    type: 3
                },
                history: history
            }
        )


    }
    // 删除产品
    deletePro = (id) => {
        const { pageId } = this.state
        http.get(api.productDelete, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('删除成功');
                this.getShowData(pageId)
            } else {
                message.warning(res.message);
            }
        })
        // 
    }
    // 获取地址
    getAdressData() {
        // 'http://test.pods.maikeos.com/api/getProvinceCityCounty'

        http.get(import.meta.env.VITE_APP_PODS_HOST + '/api/getProvinceCityCounty').then(res => {
            let data = res.data
            this.setState({ adressData: data })
        })
    }
    // 交付方式
    changePaymentMethod = (value) => {
        const { showData } = this.state
        showData.delivery_mode = value
        this.setState({ showData })

    }
    onChangeAds = (value) => {
        const { showData } = this.state
        let address = {
            province: '',
            city: '',
            district: '',
            detail: '',
        }
        if (showData.delivery_address == null) {
            showData.delivery_address = address
        }
        showData.delivery_address.province = value[0]
        showData.delivery_address.city = value[1]
        showData.delivery_address.district = value[2]
        this.setState({ showData })
    }
    changeDetail = (e) => {
        const { showData } = this.state
        showData.delivery_address.detail = e.target.value
        this.setState({ showData })
    }

    typeSave = (type) => {
        const { pageId, showData } = this.state
        let adsData = {
            province: showData.delivery_address.province,
            city: showData.delivery_address.city,
            district: showData.delivery_address.district,
            detail: showData.delivery_address.detail
        }
        let params = {
            id: Number(pageId),
            delivery_mode: showData.delivery_mode,
            delivery_at: showData.delivery_at,
            transport_mode: showData.transport_mode,
            remark: showData.remark,
            settlement_mode: showData.settlement_mode,
            settlement_id: showData.settlement_id,
            settlement_instr: showData.settlement_instr,
            delivery_address: adsData
        }

        if (params.delivery_mode == '') {
            message.warning('请选择交付方式')
            return
        } else if (params.settlement_id == '') {
            message.warning('请选择结算方式')
            return
        } else if (params.transport_mode == '') {
            message.warning('请选择运输方式')
            return
        } else if (params.delivery_at == null) {
            message.warning('请选择交付时间')
            return
        }

        http.post(api.orderSetDetail, params).then(res => {
            if (res.code == 1) {
                if (type == 1) {
                    this.PageSaveIt()
                } else if (type == 2) {
                    this.PageSubmit()
                }
            } else {
                message.warning(res.message);
            }
        })


    }

    // 页面保存
    PageSaveIt = () => {
        const { pageId } = this.state
        http.get(api.orderSave, {
            params: {
                id: pageId
            }
        }).then(res => {
            if (res.code == 1) {
                // 并发事件没有
                message.success('保存成功')
                this.getShowData(pageId)
            } else {
                message.warning(res.message);
            }
        })

    }
    PageCancel = () => {
        const { pageId } = this.state
        const { confirm } = Modal;
        let _that = this
        confirm({
            title: '您确定要取消该询价单么？取消之后将无法对该询价单进行任何操作。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                http.get(api.ordeCancel, {
                    params: {
                        id: pageId
                    }
                }).then(res => {
                    if (res.code == 1) {
                        message.success('取消成功');
                        _that.getShowData(pageId)

                    } else {
                        message.warning(res.message);
                    }
                })
            },
        });

    }

    PageSubmit = () => {
        const { pageId } = this.state
        const { confirm } = Modal;
        let _that = this
        confirm({
            title: '您确定要提交该询价单么？提交之后不可修改当前询价单的信息。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                http.get(api.orderCommit, {
                    params: {
                        id: pageId
                    }
                }).then(res => {
                    if (res.code == 1) {
                        message.success('提交成功');
                        _that.getShowData(pageId)
                        let history = _that.props.history
                        setTimeout(function () {
                            common.pathData.getPathData(
                                {
                                    path: '/Home',
                                    data: {
                                        type: 4,

                                    },
                                    history: history
                                }
                            )
                        }, 1000)
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
        // 选择器
        const { options, paymentMethod, transportationMethod, settlementMethod, adressData,
            columnsIndependence, customerData, adminList, pageId,
            showData, disabledButAdd } = this.state
        const Option = Select.Option;
        const { TextArea } = Input;

        const dateFormat = 'YYYY/MM/DD';


        return (
            <div id="currentPage" className="page">
                {pageId == '' &&
                    <div>

                        <div className='fs mb-15'>
                            <div className="title-input">
                                <span>客户名称：</span>
                                <Select style={{ width: 200 }} onChange={this.handleChangeCustomer} placeholder="请选择">
                                    {customerData.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                                </Select>
                                <Button className="ml-10"><PlusOutlined /></Button>
                            </div>
                        </div>
                        <div className='fs mb-15'>

                            <div className="title-input">
                                <span>询价类型：</span>
                                <Select style={{ width: 200 }} onChange={this.handleChangeOption} placeholder="请选择">
                                    {options.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                                </Select>
                            </div>
                            <div className="title-input">
                                <span>销售人员：</span>
                                <Select style={{ width: 200 }} onChange={this.handleChangeAdmin} placeholder="请选择">
                                    {adminList.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                                </Select>
                            </div>
                        </div>


                        <div className='fs mb-15'>
                            <div className="title-input">
                                <span>询价人员：</span>
                                <Input name="customer_representative_name" onChange={this.handleChangeTelephone} style={{ width: 200 }}
                                    placeholder="请输询价人员" />
                            </div>
                            <div className="title-input">
                                <span>联系电话：</span>
                                <Input name="customer_representative_contact" onChange={this.handleChangeTelephone} style={{ width: 200 }}
                                    placeholder="请输联系电话" />
                            </div>
                            <div className="title-input">
                                <span>邮箱地址：</span>
                                <Input name="customer_representative_email" onChange={this.handleChangeTelephone} style={{ width: 200 }}
                                    placeholder="请输邮箱地址" />
                            </div>
                            <div className="title-input">
                                <Button type="primary" onClick={this.showConfirm}>
                                    保存
                                </Button>
                            </div>
                        </div>


                    </div>
                }

                {pageId != '' &&
                    <div>
                        <div className='mb-15 fs'>
                            <span>
                                客户名称：
                                <Tooltip placement="bottomLeft" title={showData.customer_name}>
                                    {showData.customer_name}
                                </Tooltip>
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
                                询价人员：{showData.customer_representative_name}
                            </span>
                        </div>
                        <div className='mb-15'>
                            <span className="title-block w300">
                                销售人员：{showData.salesperson_name}
                            </span>

                            <span className="title-block w300">
                                联系电话：{showData.customer_representative_contact}
                            </span>
                            <span className="title-block w300">
                                邮箱地址：{showData.customer_representative_email}
                            </span>
                        </div>
                    </div>
                }

                <div className="min-block mt-15">


                    <div>

                        {showData.status == 1 &&
                            <div>
                                <span>
                                    添加产品：
                                </span>
                                <Button type="primary" onClick={this.addProduct} disabled={disabledButAdd}>添加</Button>
                            </div>
                        }
                        <div className="mt-15">
                            <Table rowKey={record => record.id} columns={columnsIndependence}
                                dataSource={showData.single_products} bordered pagination={false} />
                        </div>
                    </div>
                </div>
                <div className="min-block mt-15">
                    <div className="title">
                        <div className="mr-30">
                            <span>交付方式：</span>
                            <Select style={{ width: 300 }} onChange={this.changePaymentMethod} value={showData.delivery_mode}>
                                {paymentMethod.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                            </Select>
                        </div>

                        <div className="mr-30">
                            <span>运输方式：</span>
                            <Select style={{ width: 300 }} onChange={this.changTransport} value={showData.transport_mode}>
                                {transportationMethod.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                            </Select>
                        </div>
                    </div>

                    <div className="title mt-15">
                        <div className="mr-30">
                            <span>结算方式：</span>
                            <Select style={{ width: 300 }} onChange={this.changSettlement} value={showData.settlement_id} >
                                {settlementMethod.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                            </Select>
                        </div>
                        <div className="mr-30">
                            <span>交付期限：</span>
                            <DatePicker onChange={this.onChangeTime} value={showData.delivery_at == null ? showData.delivery_at : moment(showData.delivery_at, dateFormat)}
                                format={dateFormat} style={{ width: "300px" }} placeholder="请选择日期" />
                        </div>
                    </div>
                    <div className="title mt-15">
                        <div className="mr-30">
                            <span>交付地址：</span>
                            <Cascader
                                fieldNames={{ label: 'name', value: 'name', children: 'child' }}
                                options={adressData}
                                style={{ width: "300px" }}
                                placeholder="请选择"
                                onChange={this.onChangeAds}
                                value={showData.delivery_address == null ? '' : [showData.delivery_address.province, showData.delivery_address.city, showData.delivery_address.district]}
                            />
                            <Input style={{ width: "385px", marginLeft: '15px' }}
                                value={showData.delivery_address == null ? '' : showData.delivery_address.detail} onChange={this.changeDetail} placeholder="请输去详细地址" />
                        </div>
                    </div>
                    <div className="mt-15 title">
                        <div>
                            <span style={{ lineHeight: '32px' }}>结算说明：</span>
                        </div>
                        <div>
                            <TextArea
                                style={{ width: "800px" }}
                                placeholder="请输入结算说明"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                onChange={this.onChangeInstr}
                                value={showData.settlement_instr}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="mt-15 title">
                        <div>
                            <span style={{ lineHeight: '32px' }}>询价备注：</span>
                        </div>
                        <div>
                            <TextArea
                                style={{ width: "800px" }}
                                placeholder="请输入备注说明"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                onChange={this.onChangeRemark}
                                value={showData.remark}
                            />
                        </div>

                    </div>
                </div>

                {showData.status == 1 &&
                    <div className="title min-block mt-100 footer-button">
                        <div>
                            <Button type="primary" size='large' onClick={this.PageCancel}>取消</Button>
                            <Button style={{ margin: '0 100px 0 100px' }} size='large' type="primary" onClick={() => this.typeSave(1)}>保存</Button>
                            <Button type="primary" size='large' onClick={() => this.typeSave(2)}>提交</Button>
                        </div>
                    </div>
                }

            </div >
        );
    }
}

export default add_list;