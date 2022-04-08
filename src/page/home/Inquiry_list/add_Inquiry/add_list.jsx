import React, { Component } from 'react';
import { Select, Input, Button, Modal, Table, Divider, DatePicker, message, Cascader } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import http from '../../../../http/index'
import api from '../../../../http/httpApiName'
import common from '../../../common/common';
import '../../index.css'

class add_list extends Component {

    state = {
        company_id: '',
        pageId: '',
        options: [
            {
                id: 1,
                name: '阶梯询价'
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
                width: 100,
                dataIndex: 'number',
            },
            {
                title: '产品说明',
                width: 200,
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
                }
            },
            {
                title: '产品名称',
                width: 200,
                dataIndex: 'name',
            },
            {
                title: '产品规格',
                width: 150,
                dataIndex: 'specification',
            },
            {
                title: '计数单位',
                width: 100,
                dataIndex: 'unit',
            },
            {
                title: '包装要求',
                width: 300,
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
                width: 100,
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
                width: 145,
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
                title: '操作',
                width: 165,
                render: (text, record) => (
                    <div className='fs'>
                        {record.type == 1 &&
                            <div>
                                <a onClick={() => this.editPro(record)}>编辑</a>
                                <Divider type="vertical" />
                                <a style={{ color: 'red' }} onClick={() => this.deletePro(record.id)}>删除</a>
                                <Divider type="vertical" />
                            </div>
                        }
                        {record.type != 1 &&
                            <div>
                                <a style={{ color: '#ccc' }}>编辑</a>
                                <Divider type="vertical" />
                                <a style={{ color: '#ccc' }} >删除</a>
                                <Divider type="vertical" />
                            </div>
                        }
                        <div>
                            <a onClick={() => this.copyPro(record)}>复制</a>
                        </div>

                    </div >
                )
            }

        ],
        customerData: [],
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
            delivery_address: null,
            single_products: [],
            customer_id: '',
            type: '',
            salesperson_id: '',
            customer_representative_name: '',
            customer_representative_contact: '',
            customer_representative_email: '',
            name: '',
            project_file_person_id: '',

        },
        adressData: [],
        disabledButAdd: true,
        isModalVisibleAddCustomer: false,
        projectData: []

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
                this.getCheckOrderProduct(data.id, data.status)

                this.setState({
                    showData: data,
                    company_id: data.company_id
                })
            } else {
                message.warning(res.message);
            }
        })
    }
    // 询价单产品
    getCheckOrderProduct(id, type) {
        http.get('/inquiry/order/get/' + id + '/product/list').then(res => {
            if (res.code == 1) {
                let data = res.data.items
                data.type = type
                this.setState({ list: data })
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
    // 获取销售人员列表
    getAdminList() {
        http.get(api.adminList).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                let projectData = common.clone.deepClone(data)

                projectData.push(
                    {
                        id: 0,
                        name: '忽略'
                    }
                )


                this.setState({
                    adminList: data,
                    projectData: projectData
                })
            } else {
                message.warning(res.message);
            }
        })
    }
    // 获取地址
    getAdressData() {
        http.get(import.meta.env.VITE_APP_PODS_HOST + '/api/getProvinceCityCounty').then(res => {
            let data = res.data
            this.setState({ adressData: data })
        })
    }
    // 改变头部下拉选择
    handleChangeCustomer = (value, key) => {
        const { showData } = this.state
        showData[key] = value
        this.setState({ showData })
    }
    // 改变输入框事件
    handleChangeTelephone = (e) => {
        const { showData } = this.state
        showData[e.target.name] = e.target.value
        this.setState({ showData })
    }
    // 头部保存
    showConfirm = () => {
        let { showData, pageId } = this.state
        let id = ''
        if (pageId == '') {
            id = 0
        } else {
            id = Number(pageId)
        }
        let params = {
            id: id,
            customer_id: showData.customer_id,
            type: showData.type,
            salesperson_id: showData.salesperson_id,
            customer_representative_name: showData.customer_representative_name,
            customer_representative_contact: showData.customer_representative_contact,
            customer_representative_email: showData.customer_representative_email,
            project_file_person_id: showData.project_file_person_id

        }

        console.log('params: ', params);
        if (params.customer_id == '') {
            message.warning('请选择客户名称')
            return
        } else if (params.type == '') {
            message.warning('请选择询价类型')
            return

        } else if (params.salesperson_id == '') {
            message.warning('请选择销售人员')
            return
        } else if (params.project_file_person_id === '') {
            message.warning('请选择工程配置人员')
            return
        } else if (params.customer_representative_name == '') {
            message.warning('请填写询价人员')
            return

        } else if (params.customer_representative_contact == '') {
            message.warning('请填写询价人联系电话')
            return

        } else if (params.customer_representative_email == '') {
            message.warning('请填写询价人邮箱地址')
            return
        }



        http.post(api.orderSetBasic, params).then(res => {
            if (res.code == 1) {
                message.success('保存成功');
                let history = this.props.history
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
                this.setState({
                    pageId: res.data,
                    disabledButAdd: false
                })
                this.getShowData(res.data)

            } else {
                message.warning(res.message);
            }
        })
    }
    // 改变时间
    onChangeTime = (date, dateString) => {
        const { showData } = this.state
        showData.delivery_at = dateString
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
        } else if (params.settlement_id === '') {
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

    copyPro = (data) => {
        const { pageId } = this.state
        http.get('/inquiry/product/copy/' + data.id).then(res => {
            if (res.code == 1) {
                message.success('复制成功');
                this.getShowData(pageId)
            } else {
                message.warning(res.message);
            }

        })
    }

    addCustomer = () => {
        this.setState({ isModalVisibleAddCustomer: true })
    }

    handleOkAddCustomer = () => {
        const { showData } = this.state
        let params = {
            customer_type: 2,
            name: showData.name,
            company_name: showData.name
        }
        http.post(import.meta.env.VITE_APP_PODS_HOST + '/customer/user/add', params).then(res => {
            if (res.data.status == 1) {
                message.success('保存成功')
                this.getCustomerList()
                this.setState({ isModalVisibleAddCustomer: false })
            } else {
                message.warning(res.data.msg);
            }
        })
    }

    handleCancelAddCustomer = () => {
        this.setState({ isModalVisibleAddCustomer: false })
    }

    render() {
        // 选择器
        const { options, paymentMethod, transportationMethod, settlementMethod, adressData,
            columnsIndependence, customerData, adminList, list, showData, disabledButAdd,
            isModalVisibleAddCustomer, projectData } = this.state
        const Option = Select.Option;
        const { TextArea } = Input;

        const dateFormat = 'YYYY/MM/DD';

        return (
            <div id="currentPage" className="page">
                <div>
                    <div className='fs mb-15'>
                        <div className="title-input">
                            <span className='w80'> <span className='c-red'>*</span> 客户名称：</span>
                            <Select
                                value={showData.customer_id}
                                style={{ width: 455 }}
                                onChange={(event) => this.handleChangeCustomer(event, 'customer_id')}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="请选择客户名称">
                                {customerData.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                            </Select>
                            <Button className="ml-10" onClick={this.addCustomer}><PlusOutlined /></Button>
                        </div>
                    </div>
                    <div className='fs mb-15'>
                        <div className="title-input">
                            <span className='w80'><span className='c-red'>*</span> 询价类型：</span>
                            <Select style={{ width: 200 }} onChange={(event) => this.handleChangeCustomer(event, 'type')}
                                value={showData.type} placeholder="请选择询价类型">
                                {options.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                            </Select>
                        </div>
                        <div className="title-input">
                            <span className='w80'><span className='c-red'>*</span> 销售人员：</span>
                            <Select
                                style={{ width: 200 }}
                                value={showData.salesperson_id}
                                onChange={(event) => this.handleChangeCustomer(event, 'salesperson_id')}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="请选择销售人员">
                                {adminList.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                            </Select>
                        </div>
                        <div className="title-input">
                            <span className='w80'><span className='c-red'>*</span> 工程配置：</span>
                            <Select
                                style={{ width: 200 }}
                                value={showData.project_file_person_id}
                                onChange={(event) => this.handleChangeCustomer(event, 'project_file_person_id')}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="请选工程配置人员">
                                {projectData.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                            </Select>
                        </div>
                    </div>


                    <div className='fs mb-15'>
                        <div className="title-input">
                            <span className='w80'><span className='c-red'>*</span> 询价人员：</span>
                            <Input name="customer_representative_name" value={showData.customer_representative_name} onChange={this.handleChangeTelephone} style={{ width: 200 }}
                                placeholder="请输询价人员" />
                        </div>
                        <div className="title-input">
                            <span className='w80'><span className='c-red'>*</span> 联系电话：</span>
                            <Input name="customer_representative_contact" value={showData.customer_representative_contact} onChange={this.handleChangeTelephone} style={{ width: 200 }}
                                placeholder="请输联系电话" />
                        </div>
                        <div className="title-input">
                            <span className='w80'><span className='c-red'>*</span> 邮箱地址：</span>
                            <Input name="customer_representative_email" value={showData.customer_representative_email} onChange={this.handleChangeTelephone} style={{ width: 200 }}
                                placeholder="请输邮箱地址" />
                        </div>
                        <div className="title-input">
                            <Button type="primary" onClick={this.showConfirm}>
                                保存
                            </Button>
                        </div>
                    </div>


                </div>

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
                                dataSource={list} bordered pagination={false} />
                        </div>
                    </div>
                </div>

                {showData.single_products.length > 0 &&
                    <div>
                        <div className="min-block mt-15">
                            <div className="title">
                                <div className="mr-30">
                                    <span className='w80'><span className='c-red'>*</span> 交付方式：</span>
                                    <Select
                                        style={{ width: 300 }}
                                        onChange={(event) => this.handleChangeCustomer(event, 'delivery_mode')}
                                        value={showData.delivery_mode}>
                                        {paymentMethod.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                                    </Select>
                                </div>

                                <div className="mr-30">
                                    <span className='w80'><span className='c-red'>*</span> 运输方式：</span>
                                    <Select
                                        style={{ width: 300 }}
                                        onChange={(event) => this.handleChangeCustomer(event, 'transport_mode')}
                                        value={showData.transport_mode}>
                                        {transportationMethod.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                                    </Select>
                                </div>
                            </div>

                            <div className="title mt-15">
                                <div className="mr-30">
                                    <span className='w80'><span className='c-red'>*</span> 结算方式：</span>
                                    <Select style={{ width: 300 }} onChange={this.changSettlement} value={showData.settlement_id} >
                                        {settlementMethod.map(e => (<Option key={e.id} value={e.id}>{e.name}</Option>))}
                                    </Select>
                                </div>
                                <div className="mr-30">
                                    <span className='w80'><span className='c-red'>*</span> 交付期限：</span>
                                    <DatePicker onChange={this.onChangeTime} value={showData.delivery_at == null ? showData.delivery_at : moment(showData.delivery_at, dateFormat)}
                                        format={dateFormat} style={{ width: "300px" }} placeholder="请选择日期" />
                                </div>
                            </div>
                            <div className="title mt-15">
                                <div className="mr-30">
                                    <span className='w80'>交付地址：</span>
                                    <Cascader
                                        fieldNames={{ label: 'name', value: 'name', children: 'child' }}
                                        options={adressData}
                                        style={{ width: "300px" }}
                                        placeholder="请选择"
                                        onChange={this.onChangeAds}
                                        value={showData.delivery_address == null ? [] : [showData.delivery_address.province, showData.delivery_address.city, showData.delivery_address.district]}
                                    />
                                    <Input style={{ width: "385px", marginLeft: '15px' }}
                                        value={showData.delivery_address == null ? '' : showData.delivery_address.detail} onChange={this.changeDetail} placeholder="请输入详细地址" />
                                </div>
                            </div>
                            <div className="mt-15 title">
                                <div>
                                    <span className='w80' style={{ lineHeight: '32px' }}>结算说明：</span>
                                </div>
                                <div>
                                    <TextArea
                                        style={{ width: "800px" }}
                                        placeholder="请输入结算说明"
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                        onChange={this.handleChangeTelephone}
                                        value={showData.settlement_instr}
                                        name='settlement_instr'
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="mt-15 title">
                                <div>
                                    <span className='w80' style={{ lineHeight: '32px' }}>询价备注：</span>
                                </div>
                                <div>
                                    <TextArea
                                        style={{ width: "800px" }}
                                        placeholder="请输入备注说明"
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                        onChange={this.handleChangeTelephone}
                                        name='remark'
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
                    </div>
                }

                <Modal title="添加临时客户" visible={isModalVisibleAddCustomer} onOk={this.handleOkAddCustomer}
                    onCancel={this.handleCancelAddCustomer} cancelText='取消' okText='确定'>
                    <div>
                        <div>
                            <span className='lh-32'>客户类型：临时客户</span>
                        </div>
                        <div className='fs'>
                            <span className='lh-32'>客户名称：</span>
                            <Input name='name' onChange={this.handleChangeTelephone} placeholder="请输入客户名称" className='w200' />
                        </div>

                    </div>
                </Modal >


            </div >
        );
    }
}

export default add_list;