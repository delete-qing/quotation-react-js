import React, { Component } from 'react'
import { Table, Button, Modal, Divider, Select, message, Input, Tabs } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import urlId from '../../../../public/common'
import http from '../../../http'
import api from '../../../http/httpApiName'
import '../index.css'


export default class index extends Component {
    state = {
        pageId: '',
        showData: {
            inquiry_order: {
                delivery_address: {}
            }
        },
        columnsPro: [
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品名称',
                dataIndex: 'name',
            },
            {
                title: '产品特性',
                dataIndex: 'feature',
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
                title: 'UOM单位',
                dataIndex: 'address',
            },
            {
                title: '询价数量',
                render: (text, record) => (
                    <div>
                        {
                            record.quantities.map((e, index) => (
                                <div key={index}>
                                    {e.quantity}
                                </div>
                            ))
                        }
                    </div>
                )
            },
            {
                title: '产品文件',
                dataIndex: 'money',
            },
            {
                title: '物料编号',
                dataIndex: 'address',
            },
        ],
        proList: [],
        columnsVersion: [
            {
                title: 'MON版本号',
                dataIndex: 'version',
            },
            {
                title: '版本说明',
                dataIndex: 'version_instr',
            },
            {
                title: '修订类型',
                dataIndex: 'revision_type_desc',
            },
            {
                title: '修订时间',
                dataIndex: 'updated_at',
            },
            {
                title: '修订人',
                dataIndex: 'creator_name',
            },
            {
                title: '备注',
                dataIndex: 'remark',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <div>
                        <a onClick={() => this.ProComponent(record)}>添加子件</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.addAssembly(record)}>添加组件</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.addPreAssembly(record)}>添加预组件</a>
                    </div>
                ),
            }
        ],
        versionList: [],
        isModalVersion: false,
        remark: '',
        isModalComponent: false,
        rocessingMethods: [
            {
                id: 1,
                name: '仅规格改变'
            },
            {
                id: 2,
                name: '规格不变'
            },
            {
                id: 3,
                name: '形态改变'
            },
            {
                id: 4,
                name: '无工艺'
            },
        ],
        isSingleMaterial: [
            {
                id: 1,
                name: '单物料'
            },
            {
                id: 2,
                name: '多物料'
            }
        ],
        // 组件
        assembly: {
            name: '',
            bom_id: '',
        },
        bomIdArr: [],
        isModalAssembly: false,
        isModalPreAssembly: false,
        directionType: [
            {
                id: 0,
                name: '无'
            },
            {
                id: 1,
                name: '出标方向'
            },
            {
                id: 2,
                name: '丝向'
            },
        ],
        direction: [
            {
                id: 1,
                name: '上'
            },
            {
                id: 2,
                name: '下'
            },
            {
                id: 3,
                name: '左'
            },
            {
                id: 4,
                name: '右'
            },
        ],
        // 子件
        componentData: {
            name: '',
            counting_unit: '',
            quantity: '',
            tolerance: '',
            is_single_material: '',
            processing_method: '',
            height: '',
            width: '',
            specification: '',
            direction_type: '',
            direction: '',
            disabled: false,
            bom_id: '',
        },
        componentList: [],
        productTotle: [
            {
                id: 1,
                name: '预组件',
                list: []
            },
            {
                id: 2,
                name: '子件',
                list: []
            },
            {
                id: 3,
                name: '组件',
                list: []
            },
            {
                id: 4,
                name: '产品',
                list: []
            },

        ],
        // 工序
        columnsProcedure: [
            {
                title: '工艺名称',
                dataIndex: 'name',
            },
            {
                title: '工艺面',
                dataIndex: 'money',
            },
            {
                title: '计算方式',
                dataIndex: 'address',
            },
            {
                title: '计数单位',
                dataIndex: 'name',
            },
            {
                title: '加工机型',
                dataIndex: 'money',
            },
            {
                title: '开数',
                dataIndex: 'address',
            },
            {
                title: '模数',
                dataIndex: 'name',
            },
            {
                title: '进料规格',
                dataIndex: 'money',
            },
            {
                title: '拼版规格',
                dataIndex: 'address',
            },
            {
                title: '操作',
                dataIndex: 'address',
            },
        ],
        // 辅料
        columnsAccessories: [
            {
                title: '工艺名称',
                dataIndex: 'name',
            },
            {
                title: '机型名称',
                dataIndex: 'money',
            },
            {
                title: '辅料名称',
                dataIndex: 'address',
            },
            {
                title: '辅料说明',
                dataIndex: 'name',
            },
            {
                title: '辅料覆盖面积',
                dataIndex: 'money',
            },
            {
                title: '物料编号',
                dataIndex: 'address',
            },
            {
                title: '物料名称',
                dataIndex: 'name',
            },
            {
                title: '计数单位',
                dataIndex: 'money',
            },
            {
                title: '操作',
                dataIndex: 'address',
            },
        ],
        // 模具
        columnsMould: [
            {
                title: '工艺名称',
                dataIndex: 'name',
            },
            {
                title: '机型名称',
                dataIndex: 'money',
            },
            {
                title: '模具名称',
                dataIndex: 'address',
            },
            {
                title: '辊简规格',
                dataIndex: 'name',
            },

            {
                title: '物料编号',
                dataIndex: 'address',
            },
            {
                title: '物料名称',
                dataIndex: 'name',
            },
            {
                title: '计数单位',
                dataIndex: 'money',
            },
            {
                title: '操作',
                dataIndex: 'address',
            },
        ],
        // 主料
        columnsMainMaterial: [
            {
                title: '材料名称',
                dataIndex: 'name',
            },
            {
                title: '材料特性',
                dataIndex: 'money',
            },
            {
                title: '物料编号',
                dataIndex: 'address',
            },
            {
                title: '物料名称',
                dataIndex: 'name',
            },
            {
                title: '计数单位',
                dataIndex: 'money',
            },
            {
                title: '操作',
                dataIndex: 'address',
            },
        ],
        // 预组件
        preCombinationData: {
            pre_combination_type: '',
            combination_method: '',
            components: [
                {
                    preId: '',
                    width: '',
                    height: ''
                }
            ],
            pre_width: '',
            pre_heigth: '',
            bomId: '',

        },
        preCombinationType: [
            {
                id: 1,
                name: '通用'
            },
            {
                id: 2,
                name: '软包'
            },

        ],
        combinationMethod: [
            {
                id: 1,
                name: '对称'
            },
            {
                id: 2,
                name: '成组'
            },
        ],

    }
    componentDidMount() {
        let data = urlId.common.getQueryVariable('id')
        this.setState({ pageId: data })
        this.getData(data)
        this.getVersionList()
        this.getComponentList()
    }
    // 获取头部信息
    getData(id) {
        http.get(api.bomGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                let list = []
                list.push(res.data.product)
                this.setState({
                    showData: data,
                    proList: list
                })
            } else {
                message.warning(res.message)
            }
        })
    }

    // 获取版本信息
    getVersionList() {
        http.get(api.versionList).then(res => {
            if (res.code == 1) {
                let data = []
                data.push(res.data)
                this.setState({ versionList: data })
            } else {
                message.warning(res.message)
            }
        })
    }
    // 新建版本
    addVersion = () => {
        this.setState({ isModalVersion: true })
    }
    handleOkVersion = () => {
        const { remark } = this.state
        let params = {
            remark: remark
        }
        http.post(api.versionCreate, params).then(res => {
            if (res.code == 1) {
                message.success('新建版本成功')
                this.getVersionList()
            } else {
                message.warning(res.message)
            }
        })
        this.setState({ isModalVersion: false })

    }
    handleCancelVersion = () => {
        this.setState({ isModalVersion: false })
    }
    onChangeVersionInput = (e) => {
        this.setState({ remark: e.target.value })
    }
    callback = () => {

    }

    // 子件
    getComponentList() {
        http.get(api.componentList).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ componentList: data })
            } else {
                message.warning(res.message)
            }
        })
    }
    ProComponent = (data) => {
        const { componentData } = this.state
        componentData.bom_id = data.id
        this.setState({
            isModalComponent: true,
            componentData
        })
    }
    chengeComponentInput = (e) => {
        const { componentData } = this.state
        componentData[e.target.name] = e.target.value
        this.setState({ componentData })
    }
    handleOkComponent = () => {
        const { componentData } = this.state
        let data = ''
        if (componentData.processing_method == 2 || componentData.processing_method == 4) {
            data = '与材料规格相同'
        } else {
            data = componentData.specification
        }
        let params = {
            name: componentData.name,
            quantity: componentData.quantity,
            counting_unit: componentData.counting_unit,
            specification: data,
            tolerance: componentData.tolerance,
            processing_method: componentData.processing_method,
            is_single_material: componentData.is_single_material,
            direction_type: componentData.direction_type,
            direction: componentData.direction,
            width: componentData.width,
            height: componentData.height,
            bom_id: componentData.bom_id,

        }
        http.post(api.componentCreate, params).then(res => {
            if (res.code == 1) {
                message.success('添加成功')
                this.getVersionList()
            } else {
                message.warning(res.message)
            }
        })
        this.setState({ isModalComponent: false })

    }
    handleCancelComponent = () => {
        this.setState({ isModalComponent: false })
    }
    // 物料限制
    changeIsSingleMaterial = (value) => {
        const { componentData } = this.state
        if (value == 1) {
            componentData.is_single_material = true
        } else {
            componentData.is_single_material = false
        }
        this.setState({ componentData })
    }
    // 改变加工方式
    chengeProcessingMethod = (value) => {
        const { componentData } = this.state
        componentData.processing_method = value
        this.setState({ componentData })
    }
    chengeDirectionType = (value) => {
        const { componentData } = this.state
        componentData.direction_type = value
        if (value != 0) {
            componentData.disabled = false
        } else {
            componentData.disabled = true
        }
        this.setState({ componentData })
    }
    chengeDirection = (value) => {
        const { componentData } = this.state
        componentData.direction = value
        this.setState({ componentData })
    }



    // 组件
    addAssembly = (data) => {
        const { assembly } = this.state
        assembly.bom_id = data.id
        this.setState({ isModalAssembly: true })
    }
    chengeAssembly = (e) => {
        const { assembly } = this.state
        assembly.name = e.target.value
        this.setState({ assembly })
    }
    handleOkAssembly = () => {
        const { assembly, bomIdArr } = this.state
        let data = []
        console.log(bomIdArr, '999');
        bomIdArr.forEach(j => {
            data.push(
                {
                    id: j
                }
            )
        })
        let params = {
            name: assembly.name,
            component: data,
            bom_id: assembly.bom_id
        }

        http.post(api.combinationCreate, params).then(res => {
            if (res.code == 1) {
                message.success('添加成功')
                this.setState({ isModalAssembly: false })
            } else {
                message.warning(res.message)
            }
        })
    }
    handleAssemblOption = (value) => {
        this.setState({ bomIdArr: value })
    }
    handleCancelAssembly = () => {
        this.setState({ isModalAssembly: false })
    }


    // 预组件
    addPreAssembly = (data) => {
        const { preCombinationData } = this.state
        preCombinationData.bomId = data.id
        this.setState({ isModalPreAssembly: true })
    }
    onChangePreComponentInput = (e) => {
        const { preCombinationData } = this.state
        preCombinationData[e.target.name] = e.target.value
        this.setState({ preCombinationData })
    }
    changePreCombinationType = (value) => {
        const { preCombinationData } = this.state
        preCombinationData.pre_combination_type = value
        this.setState({ preCombinationData })
    }
    changeCombinationMethod = (value) => {
        const { preCombinationData } = this.state
        preCombinationData.combination_method = value
        this.setState({ preCombinationData })
    }

    cutComponents = (index) => {
        const { preCombinationData } = this.state
        preCombinationData.components.splice(index, 1)
        this.setState({ preCombinationData })
    }



    addComponents = () => {
        const { preCombinationData } = this.state
        preCombinationData.components.push(
            {
                preId: '',
                width: '',
                height: ''
            }
        )
        this.setState({ preCombinationData })
    }
    onChangePreComponenArrtInput = (e, index) => {
        const { preCombinationData } = this.state
        preCombinationData.components.forEach((item, index1) => {
            if (index == index1) {
                item[e.target.name] = e.target.value
            }
        })
        this.setState({ preCombinationData })

    }
    handlePreComponenOption = (event, index) => {
        const { preCombinationData } = this.state
        preCombinationData.components.forEach((item, index1) => {
            if (index == index1) {
                item.preId = event
            }
        })
        this.setState({ preCombinationData })

    }
    handleOkPreAssembly = () => {
        const { preCombinationData } = this.state
        let data = []
        preCombinationData.components.forEach(e => {
            data.push(
                {
                    id: e.preId,
                    width: e.width,
                    height: e.height
                }
            )
        })
        let params = {
            name: preCombinationData.name,
            pre_combination_type: preCombinationData.pre_combination_type,
            combination_method: preCombinationData.combination_method,
            height: preCombinationData.pre_heigth,
            width: preCombinationData.pre_width,
            components: data,
            bom_id: preCombinationData.bomId
        }
        http.post(api.preComponentCreate, params).then(res => {
            if (res.code == 1) {
                message.success('添加成功')
                this.setState({ isModalPreAssembly: false })
            } else {
                message.warning(res.message)
            }
        })
    }
    handleCancelPreAssembly = () => {
        this.setState({ isModalPreAssembly: false })
    }

    render() {
        const { showData, columnsPro, proList, columnsVersion, versionList, isModalVersion,
            isModalComponent, rocessingMethods, isSingleMaterial, isModalAssembly, isModalPreAssembly,
            preCombinationType, combinationMethod, directionType, direction, componentData, productTotle,
            columnsProcedure, columnsAccessories, columnsMould, columnsMainMaterial, componentList,
            preCombinationData } = this.state
        const { TextArea } = Input;
        const { Option } = Select;
        const { TabPane } = Tabs;
        return (
            <div>
                <div className="page">
                    <div className="mb-15">
                        <span className="title-span">任务编号：{showData.number}</span>
                        <span className="title-span">询价单号：{showData.inquiry_order.number}</span>
                        <span >客户名称：{showData.inquiry_order.customer_name}</span>
                    </div>
                    <div className="mb-15">
                        <span className="title-span">创建人员：{showData.creator_name}</span>
                        <span className="title-span">交付方式：{showData.inquiry_order.delivery_mode_desc}</span>
                        <span>交付地址：
                            {showData.inquiry_order.delivery_address != null &&
                                <>
                                    {showData.inquiry_order.delivery_address.country}
                                    {showData.inquiry_order.delivery_address.province}
                                    {showData.inquiry_order.delivery_address.city}
                                    {showData.inquiry_order.delivery_address.district}
                                    {showData.inquiry_order.delivery_address.detail}
                                </>
                            }
                        </span>
                    </div>
                    <div className="mb-15">
                        <span className="title-span">创建时间：{showData.created_at}</span>
                        <span className="title-span">结算方式：{showData.inquiry_order.settlement_mode_desc}</span>
                        <span className="title-span">交付期限：{showData.pe_finish_duration}</span>
                    </div>
                    <div className="mb-15">
                        <span className="title-span">结算说明：{showData.inquiry_order.settlement_instr}</span>
                        <span className="title-span">询价备注：{showData.inquiry_order.remark}</span>
                    </div>
                    <div className="mb-15">
                        <Table rowKey={record => record.id} columns={columnsPro} dataSource={proList} bordered title={() => '产品信息'} pagination={false} />
                    </div>
                    <div className="mb-15">
                        <Button type="primary" className="mr-15" onClick={this.addVersion}>新建版本信息</Button>
                        <Button type="primary" className="mr-15">更换版本信息</Button>
                        <div className="mt-15">
                            <Table rowKey={record => record.id} columns={columnsVersion} dataSource={versionList} bordered title={() => 'BOM版本信息'} pagination={false} />
                        </div>
                    </div>
                    {/* 表格 */}
                    <div>
                        <Tabs onChange={this.callback} type="card">
                            {productTotle.map((e, index) => (
                                <TabPane key={e.id} tab={e.name}>
                                    <div>
                                        <Table
                                            className="mb-15"
                                            rowKey={record => record.id}
                                            columns={columnsProcedure}
                                            dataSource={e.list}
                                            bordered
                                            title={() => '机加工工序'}
                                        />
                                        <Table
                                            className="mb-15"
                                            rowKey={record => record.id}
                                            columns={columnsAccessories}
                                            dataSource={e.list}
                                            bordered
                                            title={() => '辅料'}
                                        />
                                        <Table
                                            className="mb-15"
                                            rowKey={record => record.id}
                                            columns={columnsMould}
                                            dataSource={e.list}
                                            bordered
                                            title={() => '模具'}
                                        />
                                        <Table
                                            className="mb-15"
                                            rowKey={record => record.id}
                                            columns={columnsMainMaterial}
                                            dataSource={e.list}
                                            bordered
                                            title={() => '主料'}
                                        />

                                    </div>

                                </TabPane>
                            ))
                            }
                        </Tabs>
                    </div>
                    {/* 弹窗 */}
                    <div>
                        <div>
                            <Modal title="新建版本" visible={isModalVersion} onOk={this.handleOkVersion}
                                onCancel={this.handleCancelVersion} cancelText='取消' okText='确定'>
                                <div className="fs">
                                    <span style={{ width: '50px' }}>备注：</span>
                                    <TextArea className="w300" placeholder="请输入备注" allowClear onChange={this.onChangeVersionInput} />
                                </div>
                            </Modal>
                        </div>
                        {/* 子件 */}
                        <div>
                            <Modal title="添加子件" visible={isModalComponent} onOk={this.handleOkComponent}
                                onCancel={this.handleCancelComponent} cancelText='取消' okText='确定' width="850px">
                                <div>
                                    <div className="fs">
                                        <div className="mb-15 mr-20">
                                            <span>子件名称：</span>
                                            <Input name='name' onChange={this.chengeComponentInput} className="w280" placeholder="请输入子件名称" />
                                        </div>
                                        <div className="mb-15">
                                            <span>物料限制：</span>
                                            <Select style={{ width: 280 }} onChange={this.changeIsSingleMaterial} placeholder="请选择">
                                                {isSingleMaterial.map(e => (
                                                    <Option key={e.id} value={e.id}>{e.name}</Option>
                                                ))
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="fs">
                                        <div className="mb-15 mr-20">
                                            <span>计数单位：</span>
                                            <Input name='counting_unit' onChange={this.chengeComponentInput} className="w280" placeholder="请输入计数单位" />
                                        </div>
                                        <div className="mb-15 mr-20">
                                            <span>加工方式：</span>
                                            <Select style={{ width: 280 }} placeholder="请选择" onChange={this.chengeProcessingMethod}>
                                                {rocessingMethods.map(e => (
                                                    <Option key={e.id} value={e.id}>{e.name}</Option>
                                                ))
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="fs">
                                        <div className="mb-15  mr-20">
                                            <span className="lh-32">子件数量：</span>
                                            <Input className="w280" name='quantity' onChange={this.chengeComponentInput} placeholder="请输入子件数量" addonAfter={componentData.counting_unit} />
                                        </div>

                                        <div className="mb-15 fs">
                                            <div>
                                                <span className="lh-32 ">子件规格：</span>
                                            </div>
                                            {(() => {
                                                if (componentData.processing_method == 4 || componentData.processing_method == 2) {
                                                    return <Input className="w280" placeholder="与材料规格相同" disabled />
                                                }
                                            })()
                                            }

                                            {(() => {
                                                if (componentData.processing_method == 3 || componentData.processing_method == '') {
                                                    return <Input onChange={this.chengeComponentInput} name='specification' className="w280" placeholder="请输入规格" />
                                                }
                                            })()

                                            }

                                            {componentData.processing_method == 1 &&
                                                <div className="fs">
                                                    <div className="mr-15">
                                                        <span>宽：</span>
                                                        <Input onChange={this.chengeComponentInput} name='width' className="small-input" />
                                                    </div>
                                                    <div>
                                                        <span>高：</span>
                                                        <Input onChange={this.chengeComponentInput} name='height' className="small-input" />
                                                    </div>
                                                </div>
                                            }

                                        </div>
                                    </div>
                                    <div className="fs">
                                        <div className="mb-15 mr-20">
                                            <span className="lh-32">公差出血：</span>
                                            <Input className="w280" name='tolerance' onChange={this.chengeComponentInput} placeholder="请输入公差出血" addonAfter="mm" />
                                        </div>
                                        <div className="mb-15 mr-20">
                                            <span>子件要求：</span>
                                            <Select style={{ width: 150 }} placeholder="请选择" onChange={this.chengeDirectionType}>
                                                {directionType.map(e => (
                                                    <Option key={e.id} value={e.id}>{e.name}</Option>
                                                ))
                                                }
                                            </Select>

                                            <Select style={{ width: '120px', marginLeft: '10px' }} placeholder="请选择"
                                                disabled={componentData.disabled} onChange={this.chengeDirection}>
                                                {direction.map(e => (
                                                    <Option key={e.id} value={e.id}>{e.name}</Option>
                                                ))
                                                }
                                            </Select>
                                        </div>

                                    </div>

                                </div>
                            </Modal>
                        </div>
                        {/* 组件 */}
                        <div>
                            <Modal title="添加组件" visible={isModalAssembly} onOk={this.handleOkAssembly}
                                onCancel={this.handleCancelAssembly} cancelText='取消' okText='确定'>
                                <div className='assembly'>
                                    <div className="mb-15">
                                        <span style={{ display: 'inline-block', width: '102px', textAlign: 'end' }}>组件名称：</span>
                                        <Input onChange={this.chengeAssembly} className="w300" placeholder="请输入组件名称" />
                                    </div>
                                    <div>
                                        <span>选择子件/组件：</span>
                                        <Select mode="multiple" style={{ width: '300px' }} placeholder="请选择" onChange={this.handleAssemblOption} allowClear>
                                            {componentList.map(e => (
                                                <Option key={e.id} value={e.id} >{e.name}</Option>
                                            ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                        {/* 预组件 */}
                        <div>
                            <Modal title="添加预组件" visible={isModalPreAssembly} onOk={this.handleOkPreAssembly}
                                onCancel={this.handleCancelPreAssembly} cancelText='取消' okText='确定' width="900px">
                                <div>
                                    <div className="fs">
                                        <div className="mb-15">
                                            <span className="w90">预组件名称：</span>
                                            <Input name="name" onChange={this.onChangePreComponentInput} className="w300" placeholder="请输入子件名称" />
                                        </div>
                                        <div className="mb-15 fs ml-15">
                                            <span className="lh-32 w90">预组类型：</span>
                                            <Select style={{ width: 145 }} onChange={this.changePreCombinationType} placeholder="请选择">
                                                {preCombinationType.map(e => (
                                                    <Option key={e.id} value={e.id}>{e.name}</Option>
                                                ))
                                                }
                                            </Select>
                                            <Select style={{ width: '145px', marginLeft: '10px' }} onChange={this.changeCombinationMethod} placeholder="请选择">
                                                {combinationMethod.map(e => (
                                                    <Option key={e.id} value={e.id}>{e.name}</Option>
                                                ))
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="fs">
                                        {(() => {
                                            // 成组
                                            if (preCombinationData.combination_method != 2) {
                                                return <>
                                                    <div className="mb-15">
                                                        <span className="w90">选择子件：</span>
                                                        <Select mode="multiple" style={{ width: '300px' }} placeholder="请选择" onChange={this.handleAssemblOption} allowClear>
                                                            {componentList.map(e => (
                                                                <Option key={e.id} value={e.id} >{e.name}</Option>
                                                            ))
                                                            }
                                                        </Select>
                                                    </div>
                                                </>
                                            }

                                        })()
                                        }

                                        {(() => {
                                            if (preCombinationData.combination_method == 1) {
                                                return <div className="mb-15">
                                                    <span className="w90">预组规格：</span>
                                                    <Input name='pre_width' onChange={this.onChangePreComponentInput} className="w145" placeholder="边长" addonAfter="mm" />
                                                    <Input name='pre_heigth' onChange={this.onChangePreComponentInput} className="w145 ml-10" placeholder="门幅边" addonAfter="mm" />
                                                </div>
                                            }
                                        })()
                                        }

                                    </div>

                                    {(() => {
                                        if (preCombinationData.combination_method == 2) {
                                            return <>
                                                <div className="mb-15">
                                                    {preCombinationData.components.map((item, index) => (
                                                        <div className="fs mb-15" key={index}>
                                                            <div>
                                                                <span className="w90">成组子件：</span>
                                                                <Select style={{ width: '300px' }} placeholder="请选择" onChange={(event) => this.handlePreComponenOption(event, index)} allowClear>
                                                                    {componentList.map(e => (
                                                                        <Option key={e.id} value={e.id} >{e.name}</Option>
                                                                    ))
                                                                    }
                                                                </Select>
                                                            </div>
                                                            <div className="fs">
                                                                <span className="w90">预组规格：</span>
                                                                <Input name='width' onChange={(e) => this.onChangePreComponenArrtInput(e, index)} className="w145 mr-10" placeholder="边长" addonAfter="mm" />
                                                                <Input name='height' onChange={(e) => this.onChangePreComponenArrtInput(e, index)} className="w145 mr-10" placeholder="门幅边" addonAfter="mm" />
                                                                <MinusCircleOutlined onClick={() => this.cutComponents(index)} style={{ fontSize: '20px', marginRight: '10px', lineHeight: '32px' }} />
                                                                <PlusCircleOutlined onClick={this.addComponents} style={{ fontSize: '20px', marginRight: '10px', lineHeight: '32px' }} />
                                                            </div>
                                                        </div>
                                                    ))
                                                    }
                                                </div>
                                            </>
                                        }
                                    })()
                                    }
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}
