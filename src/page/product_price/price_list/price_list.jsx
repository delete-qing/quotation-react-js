import React, { Component } from 'react';
import $ from 'jquery'
import { Table, message, Tabs, Button, Input, Modal, Tag, Tooltip } from 'antd';
import { EditTwoTone, LeftOutlined, DownOutlined } from '@ant-design/icons';
import http from '../../../http'
import api from '../../../http/httpApiName'
import common from '../../../../public/common'
import TreeTag from '../../common/tree'
import '../product_price.css'



class index extends Component {

    state = {
        pageId: '',
        pods_bom_id: '',
        size: 'large',
        status: '',
        showData: {
            valid_period_day: 30,
            product: {}
        },
        columns: [
            {
                title: '核价单号',
                dataIndex: 'number',
            },
            {
                title: '产品编号',
                render: (text, record) => <span>
                    {record.product.number}
                </span>,
            },
            {
                title: '产品名称',
                render: (text, record) => <span>{record.product.name}</span>,
            },
            {
                title: '询价单号',
                dataIndex: 'related_number',
            },
            {
                title: '客户名称',
                dataIndex: 'customer_name',
            },
            {
                title: '联系人',
                render: (text, record) => <span>{record.inquiry_order.customer_representative_name}</span>,
            },
            {
                title: '联系电话',
                render: (text, record) => <span>{record.inquiry_order.customer_representative_contact}</span>,
            },
            {
                title: '邮箱',
                render: (text, record) => <span>{record.inquiry_order.customer_representative_email}</span>,
            },
            {
                title: '交付方式',
                render: (text, record) => <span>{record.inquiry_order.delivery_mode_desc}</span>,
            },
            {
                title: '运输方式',
                render: (text, record) => <span>{record.inquiry_order.transport_mode_desc}</span>,
            },
        ],
        listData: [],
        columnsPro: [
            {
                title: '产品名称',
                dataIndex: 'name',
                width: 200,
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
                title: '询价数量',
                render: (text, record) => (
                    <div>
                        {record.quantities.map(e => (
                            <div key={e.id}>
                                {e.quantity}{e.unit}
                            </div>
                        ))

                        }
                    </div>
                ),
            },
            {
                title: '包装要求',
                width: 300,
                render: (text, record) => (
                    <div>
                        {record.pack_units.map((e, index) => (
                            <div key={index}>
                                <span style={{ display: 'inline-block', marginRight: '10px' }}>{index + 1}级包装单位：{e.name}</span>，
                                {e.pack_material != null &&
                                    <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                        包装材质：{e.pack_material.name}，
                                    </span>
                                },
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
                ),
            },
            {
                title: '来源属性',
                dataIndex: 'source_attribute_desc',
            },
            {
                title: '文件',
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
                title: '样品编号',
                dataIndex: 'sample_number',
            },

            {
                title: 'BOM工单号',
                dataIndex: 'work_order_number',
            },
        ],
        listPro: [],
        // 展示询价数量
        option: [],
        columnsMaterial: [
            {
                title: '工件版式',
                render: (text, record) => (
                    <div>
                        <span> {record.component_name}（{record.format_name}）</span>
                    </div>
                )
            },
            {
                title: '主材名称',
                dataIndex: 'name',
                width: 300
            },
            {
                title: '物料编号',
                dataIndex: 'show_sku_number',
            },
            {
                title: '主材规格',
                dataIndex: 'specification',
            },
            {
                title: '计数单位',
                dataIndex: 'counting_unit',
            },
            {
                title: '计量单位',
                dataIndex: 'measurement_unit',
            },
            {
                title: '理论数量(不含损耗)',
                dataIndex: 'theory_measure_quantity',
            },
            {
                title: '用料数量(计数单位)',
                width: 100,
                render: (text, record) => (
                    <div>
                        <span>{record.usage_counting_quantity}{record.counting_unit}</span>
                    </div>
                ),
            },
            {
                title: '用料数量(计量单位)',
                render: (text, record) => (
                    <div>
                        <span>{record.usage_measure_quantity}{record.measurement_unit}</span>
                    </div>
                ),
                dataIndex: 'usage_measure_quantity',
            },


            {
                title: '单位成本',
                dataIndex: 'unit_measure_cost',
            },
            {
                title: '主材成本(元)',
                render: (text, record) => {
                    let editIt
                    const { status } = this.state
                    if (status == 5 || status == 6) {
                        editIt = <div>
                            <a onClick={() => this.ingredientsMaterial(record)}>{record.measure_cost}</a>
                        </div>
                    } else {
                        editIt = <div>
                            {record.measure_cost}
                        </div>
                    }
                    return (
                        <>
                            {editIt}
                        </>
                    )

                }
            },
        ],
        // 主料
        materialList: [],
        // 辅料
        columnsAccessories: [
            {
                title: '工件版式',
                render: (text, record) => (
                    <div>
                        <span>{record.component_name}（{record.format_name}）</span>
                    </div>
                ),

            },
            {
                title: '工艺名称',
                dataIndex: 'tech_name',
            },
            {
                title: '辅料/模具名称',
                dataIndex: 'name',
            },
            {
                title: '说明',
                dataIndex: 'remark',
            },
            {
                title: '物料编号',
                dataIndex: 'show_sku_number',
            },
            {
                title: '计量单位',
                dataIndex: 'measurement_unit',
            },
            {
                title: '用量',
                dataIndex: 'usage_measure_quantity',
            },
            {
                title: '单位成本',
                dataIndex: 'unit_measure_cost',
            },
            {
                title: '辅料成本(元)',
                render: (text, record) => {
                    let editIt
                    const { status } = this.state
                    if (status == 5 || status == 6) {
                        editIt = <div>
                            <a onClick={() => this.accessoriesCost(record)}>{record.measure_cost}</a>
                        </div>
                    } else {
                        editIt = <div>
                            {record.measure_cost}
                        </div>
                    }
                    return (
                        <>
                            {editIt}
                        </>
                    )

                }



            },
        ],
        accessoriesList: [],
        // 人工
        columnsArtificial: [
            {
                title: '工件版式',
                render: (text, record) => (
                    <div>
                        <span> {record.component_name}（{record.format_name}）</span>
                    </div>
                ),
            },
            {
                title: '工艺名称',
                dataIndex: 'name',
            },
            {
                title: '加工时长(小时)',
                dataIndex: 'process_hour',
            },
            {
                title: '费率(元/小时)',
                dataIndex: 'total_rate',
            },
            {
                title: '制造人工成本',
                render: (text, record) => {
                    let editIt
                    const { status } = this.state
                    if (status == 5 || status == 6) {
                        editIt = <div>
                            <a onClick={() => this.artificialCost(record)}>{record.process_cost}</a>
                        </div>
                    } else {
                        editIt = <div>
                            {record.process_cost}
                        </div>
                    }
                    return (
                        <>
                            {editIt}
                        </>
                    )

                }
            },
        ],
        artificialList: [],
        // 运费

        freightList: [],
        // 核价

        nuclearPricelist: [],
        list: [],
        isVisibleIngredientsMaterial: false,
        isVisibleAccessoriesCost: false,
        isVisibleArtificialCost: false,
        showIngredientsMaterial: {},
        columnsTechList: [
            {
                title: '工件版式',
                dataIndex: 'format_name',
            },
            {
                title: '工艺名称',
                dataIndex: 'tech_name',
            },
            {
                title: '计数单位',
                dataIndex: 'counting_unit',
            },
            {
                title: '机型',
                dataIndex: 'settings_machine_name',
            },
            {
                title: '开数',
                dataIndex: 'open_number',
            },
            {
                title: '辅料数量',
                dataIndex: 'supplementary_quantity',
            },
            {
                title: '工艺难度',
                dataIndex: 'difficulty ',
            },
            {
                title: '大小墨位',
                dataIndex: 'ink_value',
            },
            {
                title: '辅料名称',
                render: (text, record) => (
                    <div>
                        {record.supplementary_list.length != 0 &&
                            record.supplementary_list.map((e, index) => (
                                <div key={index}>{e.comsumable_name}</div>
                            ))
                        }
                    </div >
                ),
            },
            {
                title: '覆盖率',
                render: (text, record) => (
                    <div>
                        {record.supplementary_list.length != 0 &&
                            record.supplementary_list.map((e, index) => (
                                <div key={index}>{e.area_value}</div>
                            ))
                        }
                    </div >
                ),
            },
            {
                title: '固定损',
                render: (text, record) => (
                    <div>
                        {record.supplementary_list.length != 0 &&
                            record.supplementary_list.map((e, index) => (
                                <div key={index}>{e.static_loss}</div>
                            ))
                        }
                    </div >
                ),
            },
            {
                title: '累计固定损',
                dataIndex: 'total_static_loss',
            },

            {
                title: '变动损',
                dataIndex: 'change_loss',
            },

            {
                title: '放数',
                dataIndex: 'reserved',
            },
        ],
        techList: [],
        showAccessories: [
            {
                title: '辅料名称',
                dataIndex: 'name',
            },
            {
                title: '辅料说明',
                dataIndex: 'remark',
            },
            {
                title: '用量计算方式',
                dataIndex: 'consumption_type_desc',
            },
            {
                title: '物料编号',
                dataIndex: 'show_sku_number',
            },
            {
                title: '物料名称',
                dataIndex: 'material_name',
            },
            {
                title: '物料特性',
                dataIndex: 'character',
            },
            {
                title: '物料规格',
                dataIndex: 'specifications',
            },
            {
                title: '计量单位',
                dataIndex: 'measurement_unit',
            },
            {
                title: '单位用量',
                dataIndex: 'unit_consumption',
            },
            {
                title: '理论用量',
                dataIndex: 'theory_measure_quantity',
            },
            {
                title: '放数',
                dataIndex: 'reserved',
            },
            {
                title: '辅料用量  ',
                dataIndex: 'usage_measure_quantity',
            },
            {
                title: '单位成本',
                dataIndex: 'unit_measure_cost',
            },
            {
                title: '辅料成本  ',
                dataIndex: 'measure_cost',
            },
        ],
        showAccessoriesList: [],
        showListData: {
            ingredient_list: [],
            format_quantity: '',
            unit_format_quantity: '',
            key: '',
            usage_measure_quantity: '',
        },
        isShowUsageCountingQuantity: 1,
        isShowformatQuantity: 1,
        isUnitFormatQuantity: 1,
        isShowTheoryMeasureQuantity: 1,
        isShowLossQuantity: 1,
        isshowComponent: false,
        showMould: [
            {
                title: '模具名称',
                dataIndex: 'name',
            },
            {
                title: '物料编号',
                dataIndex: 'show_sku_number',
            },
            {
                title: '物料名称',
                dataIndex: 'material_name',
            },
            {
                title: '物料特性',
                dataIndex: 'character',
            },
            {
                title: '物料规格',
                dataIndex: 'specifications',
            },
            {
                title: '计量单位',
                dataIndex: 'measurement_unit',
            },
            {
                title: '物料用量',
                dataIndex: 'usage_measure_quantity',
            },
            {
                title: '计量成本',
                dataIndex: 'unit_measure_cost',
            },
            {
                title: '模具成本(元)',
                dataIndex: 'measure_cost',
            },
        ],
        showMouldList: [],
        keyId: '',
        editArr: [],
        isShowFlag: 1,
        isShowTotalRate: 1,
    }
    componentDidMount() {
        let id = common.common.getQueryVariable('id')
        this.setState({ pageId: id })
        this.getData(id)
    }

    tabDownLoad(id, storage_location) {
        common.downFile.down(id, storage_location)
    }

    getData(id) {
        const { nuclearPricelist } = this.state
        http.get(api.checkGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let optionData = []
                let listData = []
                let proData = []
                let data = res.data
                let bomId = res.data.pods_bom_id
                let status = res.data.status
                listData.push(data)
                proData.push(data.product)
                let detail = res.data.details
                detail.forEach(e => {
                    e.source_attribute = data.product.source_attribute
                    if (status == 5 || status == 6) {
                        e.isShowDetail = 1
                        e.isShowGrossMarginRate = 1
                        e.isShowTaxRate = 1
                        e.totalCost = 1
                    } else {
                        e.isShowDetail = 3
                        e.isShowGrossMarginRate = 3
                        e.isShowTaxRate = 3
                        e.totalCost = 3
                    }

                })
                // 获取询价数量列表信息
                optionData = res.data.product.quantities
                optionData.forEach(j => {
                    j.name = '询价数量：' + j.quantity + j.unit
                });
                let proName = data.product.name
                if (optionData.length != 0) {
                    let temQuantity = optionData[0].quantity
                    this.getListData(id, bomId, temQuantity, status)
                }

                if (data.product.source_attribute != 3) {
                    this.bom(bomId, proName)
                }


                this.setState(
                    {
                        listData: listData,
                        option: optionData,
                        showData: data,
                        nuclearPricelist: detail,
                        listPro: proData,
                        pods_bom_id: bomId,
                        status: status
                    }
                )
            } else {
                message.warning(res.message);
            }
        })
    }

    // 根据id获取信息
    getListData(pid, bid, num, status) {
        http.get(api.checkCost, {
            params: {
                pods_bom_id: bid,
                quantity: num,
                check_price_order_id: pid,
            }
        }).then(res => {
            let ingredientList = res.data.ingredient_list
            let supplementary = res.data.supplementary_and_mold_list
            let techList = res.data.tech_list
            let deliveryInfo = res.data.delivery_list
            deliveryInfo.forEach(e => {
                if (status == 5 || status == 6) {
                    e.isVolumeCostRate = 1
                    e.isWeightCostRate = 1
                } else {
                    e.isVolumeCostRate = 3
                    e.isWeightCostRate = 3

                }
            })
            this.setState(
                {
                    materialList: ingredientList,
                    accessoriesList: supplementary,
                    artificialList: techList,
                    freightList: deliveryInfo,
                }
            )
        })
    }

    callback = (e) => {
        const { option, pageId, pods_bom_id, status } = this.state
        let num = ''
        option.forEach(item => {
            if (e == item.id) {
                num = item.quantity
            }
        })
        this.getListData(pageId, pods_bom_id, num, status)
    }
    changeDay = (e) => {
        const { showData } = this.state
        showData.valid_period_day = e.target.value
        this.setState({ showData })
    }
    // 这些方法记得要封装起来 ！！！
    // 修改管理费率
    editManageRate(index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                if (e.isShowDetail == 1) {
                    e.isShowDetail = 2
                } else {
                    e.isShowDetail = 1
                }
            }
        })
        this.setState({ nuclearPricelist })
    }

    changeManageRateInput(event, index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                e.manage_rate = event.target.value
            }
        })
        this.setState({ nuclearPricelist })
    }
    // 修改总成本
    editTotalCost(index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                if (e.totalCost == 1) {
                    e.totalCost = 2
                } else {
                    e.totalCost = 1
                }
            }
        })
        this.setState({ nuclearPricelist })
    }
    changeTotalCostInput(event, index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                e.total_cost = event.target.value
            }
        })
        this.setState({ nuclearPricelist })
    }
    // 修改体积费率(元/立方米)
    editisVolumeCostRate(index) {
        const { freightList } = this.state
        freightList.forEach((e, index1) => {
            if (index == index1) {
                if (e.isVolumeCostRate == 1) {
                    e.isVolumeCostRate = 2
                } else {
                    e.isVolumeCostRate = 1
                    this.saveFreight(e)
                }
            }
        })
        this.setState({ freightList })
    }
    changeVolumeCostRateInput(event, index) {
        const { freightList } = this.state
        freightList.forEach((e, index1) => {
            if (index == index1) {
                e.volume_cost_rate = event.target.value
            }
        })
        this.setState({ freightList })
    }
    // 重量运费
    editisWeightCostRate(index) {
        const { freightList } = this.state
        freightList.forEach((e, index1) => {
            if (index == index1) {
                if (e.isWeightCostRate == 1) {
                    e.isWeightCostRate = 2
                } else {
                    e.isWeightCostRate = 1
                    this.saveFreight(e)
                }
            }
        })
        this.setState({ freightList })
    }
    changeisWeightCostRate(event, index) {
        const { freightList } = this.state
        freightList.forEach((e, index1) => {
            if (index == index1) {
                e.weight_cost_rate = event.target.value
            }
        })
        this.setState({ freightList })
    }
    // 修改毛利率
    editGrossMarginRate(index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                if (e.isShowGrossMarginRate == 1) {
                    e.isShowGrossMarginRate = 2
                } else {
                    e.isShowGrossMarginRate = 1
                }
            }
        })
        this.setState({ nuclearPricelist })
    }
    changeGrossMarginRate(event, index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                e.gross_margin_rate = event.target.value
            }
        })
        this.setState({ nuclearPricelist })
    }
    // 修改税率
    editTaxRate(index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                if (e.isShowTaxRate == 1) {
                    e.isShowTaxRate = 2
                } else {
                    e.isShowTaxRate = 1
                }
            }
        })
        this.setState({ nuclearPricelist })

    }
    changeTaxRate(event, index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist.forEach((e, index1) => {
            if (index == index1) {
                e.tax_rate = event.target.value
            }
        })
        this.setState({ nuclearPricelist })
    }

    // 保存运费
    saveFreight = (data) => {
        const { pageId } = this.state
        let params = {
            id: data.key,
            type: 1,
            data: {
                usage_measure_quantity: '',
                format_quantity: '',
                unit_format_quantity: '',
                volume_cost_rate: Number(data.volume_cost_rate),
                weight_cost_rate: Number(data.weight_cost_rate)
            }

        }
        http.post(api.bomCostDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    // 保存
    saveIt = () => {
        const { pageId, showData, nuclearPricelist } = this.state
        let params = {
            id: Number(pageId),
            valid_period_day: Number(showData.valid_period_day),
            details: []
        }
        nuclearPricelist.forEach(i => {
            params.details.push(
                {
                    id: i.id,
                    manage_rate: i.manage_rate,
                    gross_margin_rate: i.gross_margin_rate,
                    tax_rate: i.tax_rate,
                    total_cost: i.total_cost
                }
            )
        })
        http.post(api.checkSave, params).then(res => {
            if (res.code == 1) {
                message.success('保存成功')
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    commitIt = () => {
        const { pageId, showData, nuclearPricelist } = this.state
        let that = this
        const { confirm } = Modal;
        let params = {
            id: Number(pageId),
            valid_period_day: Number(showData.valid_period_day),
            details: []
        }
        nuclearPricelist.forEach(i => {
            params.details.push(
                {
                    id: i.id,
                    manage_rate: i.manage_rate,
                    gross_margin_rate: i.gross_margin_rate,
                    tax_rate: i.tax_rate,
                    total_cost: i.total_cost
                }
            )
        })
        confirm({
            title: '您确定要提交当前核价单么？提交之后当前核价单状态将变为【已核价】。',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                http.post(api.checkCommit, params).then(res => {
                    if (res.code == 1) {
                        message.success('提交成功')
                        that.getData(pageId)
                        let history = that.props.history
                        setTimeout(function () {
                            common.pathData.getPathData(
                                {
                                    path: '/Quotation',
                                    data: {
                                        type: 2,
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
        });
    }

    bom(id, proName) {
        http.get(import.meta.env.VITE_APP_PODS_HOST + api.bomGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.data.status == 1) {

                let resData = res.data.data.engineering_data
                let component_list = [];

                resData.component_list.forEach(component => {

                    let material_list = [];
                    component.material_list.forEach(material => {
                        material_list.push({
                            id: material.id,
                            name: material.name
                        });
                    });

                    let tech_list = [];
                    component.tech_list.forEach(tech => {

                        let techInfo = this.getTech(tech);

                        tech_list.push({
                            id: tech.id,
                            sort: tech.sort,
                            name: tech.settings_tech_options_name,
                            comsumable_list: techInfo.comsumable_list,
                            mould_list: techInfo.mould_list,
                            options: techInfo.options
                        });
                    });

                    component_list.push({
                        ...component,
                        material_list: material_list,
                        tech_list: tech_list.sort(this.compare)
                    });
                });

                let pre_component_list = [];
                resData.pre_component_list.forEach(pre => {

                    let tech_list = [];
                    pre.tech_list.forEach(tech => {

                        let techInfo = this.getTech(tech);

                        tech_list.push({
                            id: tech.id,
                            sort: tech.sort,
                            name: tech.settings_tech_options_name,
                            comsumable_list: techInfo.comsumable_list,
                            mould_list: techInfo.mould_list,
                            options: techInfo.options
                        });
                    });

                    pre_component_list.push({
                        ...pre,
                        id: pre.id,
                        name: pre.name,
                        tech_list: tech_list.sort(this.compare)
                    });
                });

                let combination_list = [];
                resData.combination_list.forEach(combination => {

                    // 子件
                    combination.component_ids = combination.component_ids == '' ? [] : combination.component_ids.split('_');
                    // 组件
                    combination.component_combination_ids = combination.component_combination_ids == '' ? [] : combination.component_combination_ids.split('_');

                    let tech_list = [];
                    combination.tech_list.forEach(tech => {

                        let techInfo = this.getTech(tech);

                        tech_list.push({
                            id: tech.id,
                            sort: tech.sort,
                            name: tech.settings_tech_options_name,
                            comsumable_list: techInfo.comsumable_list,
                            mould_list: techInfo.mould_list,
                            options: techInfo.options
                        });
                    });

                    combination_list.push({
                        ...combination,
                        id: combination.id,
                        name: combination.name,
                        tech_list: tech_list.sort(this.compare)
                    });
                });

                let u_tech_list = [];
                let p_tech_list = [];
                let product_tech_list = [];
                resData.product_tech_list.forEach(tech => {

                    let techInfo = this.getTech(tech);

                    if (tech.type == 0) {
                        product_tech_list.push({
                            id: tech.id,
                            name: tech.settings_tech_options_name,
                            comsumable_list: techInfo.comsumable_list,
                            mould_list: techInfo.mould_list,
                            options: techInfo.options
                        });
                    } else if (tech.type == 1) {
                        u_tech_list.push({
                            id: tech.id,
                            name: tech.settings_tech_options_name,
                            comsumable_list: techInfo.comsumable_list,
                            mould_list: techInfo.mould_list,
                            options: techInfo.options
                        });
                    } else if (tech.type == 2) {
                        p_tech_list.push({
                            id: tech.id,
                            name: tech.settings_tech_options_name,
                            comsumable_list: techInfo.comsumable_list,
                            mould_list: techInfo.mould_list,
                            options: techInfo.options
                        });
                    }
                });

                let uom_unit_list = [];
                if (resData.sku_unit !== '') {
                    let name = resData.sku_unit + '(' + resData.sku_capacity + ')';
                    uom_unit_list.push({
                        name: name,
                        tech_list: u_tech_list
                    });
                }

                let packing_unit_list = [];
                if (resData.outer_packaging_sku_unit !== '') {

                    let sku_capacity = '';
                    if (resData.outer_packaging_capacity_type == 1) {
                        sku_capacity = resData.outer_packaging_sku_capacity;
                    }
                    let name = resData.outer_packaging_sku_unit + '(' + sku_capacity + ')';

                    packing_unit_list.push({
                        name: name,
                        sku_unit: resData.outer_packaging_sku_unit,
                        sku_capacity: sku_capacity,
                        tech_list: p_tech_list
                    });
                }

                let product_list = [];
                if (product_tech_list.length || uom_unit_list.length) {
                    product_list = [
                        {
                            name: '产品工序',
                            product_tech_list: product_tech_list,
                            uom_unit_list: uom_unit_list,
                            packing_unit_list: packing_unit_list
                        }
                    ];
                }

                let data = [{
                    id: resData.id,
                    name: proName || '产品名称',
                    component_list: component_list,
                    pre_component_list: pre_component_list,
                    combination_list: combination_list,
                    product_list: product_list
                }];

                this.setState({ list: data })

            } else {
                message.warning(res.data.msg)

            }
        })
    }
    compare(a, b) {
        return a.sort - b.sort;
    }

    getTech(tech) {

        let resultMap = {};

        let comsumable_list = [];
        tech.comsumable_list.forEach(comsumable => {
            comsumable_list.push({
                id: comsumable.id,
                comsumable_name: comsumable.comsumable_name,
                quantity: comsumable.quantity
            });
        });
        resultMap.comsumable_list = comsumable_list;

        let mould_list = [];
        if (tech.settings_tech_mould_id != 0) {
            mould_list.push({
                id: tech.settings_tech_mould_id,
                mould_name: tech.settings_tech_mould_name
            });
        }
        resultMap.mould_list = mould_list;

        let options = [];
        tech.options.forEach(option => {
            options.push({
                id: option.id,
                option_name: option.options_name
            });
        });
        resultMap.options = options;

        return resultMap;
    }

    tree = (event) => {
        let $parentLi = $(event.target).closest('li.parent_li');

        let $li = $parentLi.find('ul > li');
        this.visible($li, 'fast');

        let $operate = $parentLi.find(' > .operate');
        this.visible($operate);
    }
    visible(children, fast) {
        if (children.is(":visible")) {
            children.hide(fast);
        } else {
            children.show(fast);
        }
    }
    // 获取列表封装方法
    getEncapsulatio(key) {
        http.get(api.costDetail, {
            params: {
                id: key
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                console.log('data: ', data);
                let dataFlag = 1
                if (data.calculate_process_list) {
                    data.calculate_process_list.forEach(e => {
                        e.isShow = 1
                        e.isShowSM = 1
                        e.preKey = data.key
                        if (e.sk != 1) {
                            dataFlag = 2
                        } else {
                            dataFlag = 1
                        }
                    })
                }


                let dataList = []
                // 子件工艺 为拼版  大于1
                if (data.component_type == 2 && data.component_quantity > 1 && data.imposition_settings == 1) {
                    data.flag == 1
                }

                //    组件/产品工艺
                if (data.type == 5 || data.type == 0) {
                    data.flag = 4
                }

                dataList.push(res.data)
                dataList.forEach((e, index) => {
                    e.key = index
                })
                this.setState({
                    showListData: data,
                    showAccessoriesList: dataList,
                    keyId: key,
                    isShowFlag: dataFlag
                })

            } else {
                message.warning(res.message)
            }
        })
    }
    // 查看主料
    ingredientsMaterial = (data) => {
        this.getEncapsulatio(data.key)
        this.setState({
            isVisibleIngredientsMaterial: true,
        })
    }

    handleCancelIngredientsMaterial = () => {
        this.setState({ isVisibleIngredientsMaterial: false })
    }
    // 辅料成本
    accessoriesCost = (data) => {
        this.getEncapsulatio(data.key)
        this.setState({ isVisibleAccessoriesCost: true })
    }
    handleOkAccessoriesCost = () => {
        this.setState({ isVisibleAccessoriesCost: false })
    }
    handleCancelAccessoriesCost = () => {
        this.setState({ isVisibleAccessoriesCost: false })
    }
    // 制造人工成本
    artificialCost = (data) => {
        this.getEncapsulatio(data.key)
        this.setState({
            isVisibleArtificialCost: true,
        })
    }
    handleCancelArtificialCost = () => {
        this.setState({ isVisibleArtificialCost: false })
    }
    changeFormatQutity = (e) => {
        const { showListData } = this.state
        showListData.format_quantity = e.target.value
        this.setState({
            isShowformatQuantity: 2,
            showListData
        })
        this.setState({ isShowformatQuantity: 2 })
    }
    blurFormatQutityInput = () => {
        this.setState({
            isShowformatQuantity: 1,
            isUnitFormatQuantity: 1
        })
    }
    changeUnitFormatQuantity = (e) => {
        const { showListData } = this.state
        showListData.unit_format_quantity = e.target.value
        this.setState({
            isUnitFormatQuantity: 2,
            showListData
        })
    }

    changeIsShowUsageCountingQuantity = () => {
        const { isShowUsageCountingQuantity } = this.state
        let data = 1
        if (isShowUsageCountingQuantity == 1) {
            data = 2
        } else {
            data = 1
            this.saveTitle()
        }
        this.setState({ isShowUsageCountingQuantity: data })
    }

    // 理论数量
    changeIsShowTheoryMeasureQuantity = () => {
        const { isShowTheoryMeasureQuantity } = this.state
        let data = 1
        if (isShowTheoryMeasureQuantity == 1) {
            data = 2
        } else {
            data = 1
            this.saveTitle()
        }
        this.setState({ isShowTheoryMeasureQuantity: data })
    }

    // 损耗总数
    changeIsShowLossQuantity = () => {
        const { isShowLossQuantity } = this.state
        let data = 1
        if (isShowLossQuantity == 1) {
            data = 2
        } else {
            data = 1
            this.saveTitle()
        }
        this.setState({ isShowLossQuantity: data })
    }

    changeQuantityInput = (e) => {
        const { showListData } = this.state
        showListData[e.target.name] = e.target.value
        console.log('showListData: ', showListData);
        this.setState({ showListData })
    }

    editSK = (data) => {
        const { showListData } = this.state
        if (data.isShow == 1) {
            data.isShow = 2
        } else {
            data.isShow = 1
            this.skInputCommit(data)
        }
        this.setState({ showListData })

    }
    changeSKInput = (e, data) => {
        const { showListData } = this.state
        data.sk = e.target.value
        this.setState({ showListData })
    }

    editSM = (data) => {
        const { showListData } = this.state
        if (data.isShowSM == 1) {
            data.isShowSM = 2
        } else {
            data.isShowSM = 1
            this.skInputCommit(data)
        }
        this.setState({ showListData })

    }
    changeSMInput = (e, data) => {
        const { showListData } = this.state
        data.sm = e.target.value
        this.setState({ showListData })
    }
    // 表格头部保存
    saveTitle = () => {
        const { showListData, keyId, pageId } = this.state
        let params = {
            id: keyId,
            type: 2,
            data: {
                usage_measure_quantity: Number(showListData.usage_measure_quantity),
                theory_measure_quantity: showListData.theory_measure_quantity,
                loss_quantity: showListData.loss_quantity,
                format_quantity: '',
                unit_format_quantity: '',
                volume_cost_rate: '',
                weight_cost_rate: '',
            }
        }

        http.post(api.bomCostDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    skInputCommit(data) {
        let params = {
            key: data.key,
            index: data.index,
            data: {
                sk: Number(data.sk),
                sm: Number(data.sm),
            }
        }

        http.post(api.techDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getEncapsulatio(data.preKey)
            } else {
                message.warning(res.message)
            }
        })

    }

    // 主料保存
    handleOkIngredientsMaterial = () => {
        this.setState({ isVisibleIngredientsMaterial: false })
    }

    // 拉线编辑
    changeIsShowTotalRate = () => {
        const { isShowTotalRate } = this.state
        let data = 1
        if (isShowTotalRate == 1) {
            data = 2
        } else {
            data = 1

        }
        this.setState({ isShowTotalRate: data })
    }

    changeTotalRateInput = (e) => {
        const { showListData } = this.state
        showListData.total_rate = e.target.value
        this.setState({ showListData })

    }

    // 制造人工成本保存
    handleOkArtificialCost = (data) => {
        const { showListData, pageId, keyId } = this.state
        let params = {
            id: keyId,
            type: 3,
            data: {
                format_quantity: Number(showListData.format_quantity),
                unit_format_quantity: Number(showListData.unit_format_quantity),
                total_rate: Number(showListData.total_rate),
            }
        }
        http.post(api.bomCostDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getData(pageId)
                this.setState({ isVisibleArtificialCost: false })
            } else {
                message.warning(res.message)
            }
        })

    }

    render() {
        const {
            option, size, showData, columns, listData, columnsMaterial, materialList, columnsAccessories, accessoriesList,
            columnsArtificial, artificialList, freightList, nuclearPricelist, columnsPro, listPro, list,
            isVisibleIngredientsMaterial, isVisibleAccessoriesCost, isVisibleArtificialCost, showAccessories, showAccessoriesList,
            showListData, isShowformatQuantity, isUnitFormatQuantity, columnsTechList, showMould, isShowUsageCountingQuantity, status,
            isShowTheoryMeasureQuantity, isShowLossQuantity, isShowFlag, isShowTotalRate
        } = this.state
        const { TabPane } = Tabs;
        let flagIsShowCommit = 1
        if (status == 5 || status == 6) {
            flagIsShowCommit = 2
        }
        // 运费
        const columnsFreight = [
            {
                title: '运程',
                dataIndex: 'name',
            },
            {
                title: '每包装单位体积(立方米/包装单位)',
                dataIndex: 'unit_volume',
            },
            {
                title: '每包装单位重量(公斤/包装单位)',
                dataIndex: 'unit_weight',
            },
            {
                title: '总体积(立方米)',
                dataIndex: 'volume',
            },
            {
                title: '体积费率(元/立方米)',
                render: (text, record, index) => (
                    <div>
                        {record.isVolumeCostRate == 1 &&
                            <>
                                <a>{record.volume_cost_rate}</a>
                                <EditTwoTone onClick={() => this.editisVolumeCostRate(index)} />
                            </>
                        }
                        {record.isVolumeCostRate == 2 &&
                            <Input value={record.volume_cost_rate} className="w100"
                                onChange={(event) => this.changeVolumeCostRateInput(event, index)} onBlur={() => this.editisVolumeCostRate(index)} />
                        }
                        {record.isVolumeCostRate == 3 &&
                            <span>{record.volume_cost_rate}</span>
                        }
                    </div>
                ),
            },
            {
                title: '总重量(公斤)',
                dataIndex: 'weight',
            },

            {
                title: '重量费率(元/公斤)',
                render: (text, record, index) => (
                    <div>
                        {record.isWeightCostRate == 1 &&
                            <>
                                <a>{record.weight_cost_rate}</a>
                                <EditTwoTone onClick={() => this.editisWeightCostRate(index)} />
                            </>
                        }
                        {record.isWeightCostRate == 2 &&
                            <Input value={record.weight_cost_rate} className="w100"
                                onChange={(event) => this.changeisWeightCostRate(event, index)} onBlur={() => this.editisWeightCostRate(index)} />
                        }
                        {record.isWeightCostRate == 3 &&
                            <>
                                <span>{record.weight_cost_rate}</span>
                            </>
                        }
                    </div>
                )

            },
            {
                title: '计体积运费(元)',
                dataIndex: 'volume_cost',
            },
            {
                title: '计重量运费(元)',
                dataIndex: 'weight_cost',
            }
        ]

        const columnsNuclearPrice = [
            {
                title: '询价数量',
                dataIndex: 'quantity',
            },
            {
                title: '总计成本',
                // dataIndex: 'total_cost',
                render: (text, record, index) => {
                    if (record.source_attribute == 3) {
                        return (
                            <div>
                                {record.totalCost == 1 &&
                                    <>
                                        <a>{record.total_cost}</a>
                                        <EditTwoTone onClick={() => this.editTotalCost(index)} />
                                    </>
                                }
                                {record.totalCost == 2 &&
                                    <Input value={record.total_cost} className="w100"
                                        onChange={(event) => this.changeTotalCostInput(event, index)} onBlur={() => this.editTotalCost(index)} />
                                }
                            </div>
                        )

                    }


                    if (record.source_attribute != 3) {
                        return (
                            <div>{record.total_cost}</div>
                        )
                    }

                }
            },
            {
                title: '单位成本(元/计数单位)',
                dataIndex: 'unit_cost',
            },
            {
                title: '管理费率(%)',
                render: (text, record, index) => (
                    <div>
                        {record.isShowDetail == 1 &&
                            <>
                                <a>{record.manage_rate}</a>
                                <EditTwoTone onClick={() => this.editManageRate(index)} />
                            </>
                        }
                        {record.isShowDetail == 2 &&
                            <Input value={record.manage_rate} className="w100"
                                onChange={(event) => this.changeManageRateInput(event, index)} onBlur={() => this.editManageRate(index)} />
                        }
                        {record.isShowDetail == 3 &&
                            <span>{record.manage_rate}</span>
                        }
                    </div>
                ),
            },
            {
                title: '毛利率(%)',
                render: (text, record, index) => (
                    <div>
                        {record.isShowGrossMarginRate == 1 &&
                            <>
                                <a>{record.gross_margin_rate}</a>
                                <EditTwoTone onClick={() => this.editGrossMarginRate(index)} />
                            </>
                        }
                        {record.isShowGrossMarginRate == 2 &&
                            <Input value={record.gross_margin_rate} className="w100"
                                onChange={(event) => this.changeGrossMarginRate(event, index)} onBlur={() => this.editGrossMarginRate(index)} />
                        }
                        {record.isShowDetail == 3 &&
                            <span>{record.gross_margin_rate}</span>
                        }
                    </div>
                ),
                // dataIndex: 'gross_margin_rate',
            },
            {
                title: '税率(%)',
                render: (text, record, index) => (
                    <div>
                        {record.isShowTaxRate == 1 &&
                            <>
                                <a>{record.tax_rate}</a>
                                <EditTwoTone onClick={() => this.editTaxRate(index)} />
                            </>
                        }
                        {record.isShowTaxRate == 2 &&
                            <Input value={record.tax_rate} className="w100"
                                onChange={(event) => this.changeTaxRate(event, index)} onBlur={() => this.editTaxRate(index)} />
                        }
                        {record.isShowDetail == 3 &&
                            <span>{record.tax_rate}</span>
                        }
                    </div>
                ),
                // dataIndex: 'tax_rate',
            },
            {
                title: '核价价格(元)',
                dataIndex: 'total_quote',
            },
            {
                title: '含税单价(元/计数单位)',
                dataIndex: 'unit_quote',
            }
        ]


        const columnsCalculateProcessList = [
            {
                title: '产品数量PN',
                dataIndex: 'pn',
            },
            {
                title: '子件数量CN',
                dataIndex: 'cn',
            },
            {
                title: '进料开数SK(指本工艺制成品与进料比例)',
                render: (text, record) => {
                    let show
                    if (isShowFlag == 1) {

                        show = <div>
                            {record.isShow == 1 &&
                                <>
                                    <a>{record.sk}</a>
                                    <EditTwoTone onClick={() => this.editSK(record)} />
                                </>
                            }
                            {record.isShow == 2 &&
                                <>
                                    <Input value={record.sk} className="w100"
                                        onChange={(event) => this.changeSKInput(event, record)} onBlur={() => this.editSK(record)} />
                                </>
                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.sk}</span>
                        </>
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                }
            },
            {
                title: '展示开数SM(指本工艺制成品上的模数)',
                dataIndex: 'sm',
                render: (text, record) => {
                    let show
                    if (record.is_first_imposition_tech) {
                        show = <div>
                            {record.isShowSM == 1 &&
                                <>
                                    <a>{record.sm}</a>
                                    <EditTwoTone onClick={() => this.editSM(record)} />
                                </>
                            }
                            {record.isShowSM == 2 &&
                                <>
                                    <Input value={record.sm} className="w100"
                                        onChange={(event) => this.changeSMInput(event, record)} onBlur={() => this.editSM(record)} />
                                </>
                            }
                        </div>
                    } else {
                        show = <span>{record.sm}</span>
                    }

                    return (
                        <div>
                            {show}
                        </div>
                    )

                }
            },
            {
                title: '工艺使用材料理论数量IN',
                dataIndex: 'in',
            },
            {
                title: '制成品理论数量ON',
                dataIndex: 'on',
            },
            {
                title: '累计进料开数TK',
                dataIndex: 'tk',
            },
            {
                title: '固定损Gm',
                dataIndex: 'gm',
            },
            {
                title: '变动损Bm',
                dataIndex: 'bm',
            },
            {
                title: '进料损耗数量Jm',
                dataIndex: 'jm',
            },
            {
                title: '换算成原料损耗数量Wm',
                dataIndex: 'wm',
            },
            {
                title: '实际进料量IP',
                dataIndex: 'ip',
            },
            {
                title: '实际制成数量OP',
                dataIndex: 'op',
            },
            {
                title: '实际加工数PR',
                dataIndex: 'pr',
            },
        ]
        return (
            <div className="fs" >

                {/* 树 */}
                {showData.product.source_attribute != 3 &&
                    <div className="header">
                        <div className="title">
                            <span style={{ lineHeight: '50px', marginLeft: 16 }}>工程结构</span>
                        </div>
                        <div className="page tree">
                            <ul>
                                {
                                    list.map((item, i) => (
                                        <li className="parent_li" style={{ padding: 0 }} key={i}>
                                            <Tag color="purple">
                                                <div className="dib wEllipsis">
                                                    <Tooltip placement="topLeft" title={item.name}>
                                                        <span>{item.name}</span>
                                                    </Tooltip>
                                                </div>
                                            </Tag>
                                            <ul>
                                                {
                                                    item.component_list.map((component, e) => (
                                                        <li className="parent_li" name='data_id' key={e}>
                                                            <Tag color="orange" onClick={this.tree}>
                                                                <div className="dib wEllipsis">
                                                                    <Tooltip placement="topLeft" title={component.name}>
                                                                        <span>{component.name}</span>
                                                                    </Tooltip>
                                                                </div>
                                                            </Tag>
                                                            <ul>
                                                                {
                                                                    component.material_list.map((material, s) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" name='data_id' key={s}>
                                                                            <Tag color="green" onClick={this.tree}>
                                                                                <div className="dib wEllipsis">
                                                                                    <Tooltip placement="topLeft" title={material.name}>
                                                                                        <span>{material.name}</span>
                                                                                    </Tooltip>
                                                                                </div>
                                                                            </Tag>
                                                                        </li>
                                                                    ))

                                                                }

                                                                {
                                                                    component.tech_list.map((tech, t1) =>
                                                                    (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={t1}>
                                                                            <TreeTag parent={tech} />
                                                                        </li>
                                                                    ))
                                                                }

                                                            </ul>
                                                        </li>
                                                    ))
                                                }


                                                {
                                                    item.pre_component_list.map((pre, p) => (
                                                        <li className="parent_li" key={p}>
                                                            <Tag color="cyan" onClick={this.tree}>
                                                                <div className="dib wEllipsis">
                                                                    <span>{pre.name}</span>
                                                                </div>
                                                            </Tag>
                                                            <ul>
                                                                {
                                                                    pre.material_list.map((material, s) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={s}>
                                                                            <Tag color="green" onClick={this.tree}>
                                                                                <div className="dib wEllipsis">
                                                                                    <span>{material.name}</span>
                                                                                </div>
                                                                            </Tag>
                                                                        </li>
                                                                    ))
                                                                }
                                                                {
                                                                    pre.tech_list.map((tech, t2) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={t2}>
                                                                            <TreeTag parent={tech} />
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </li>
                                                    ))

                                                }

                                                {
                                                    item.combination_list.map((combination, z) => (
                                                        <li className="parent_li" key={z}>
                                                            <Tag color="blue" onClick={this.tree}>
                                                                <div className="dib wEllipsis">
                                                                    <span>{combination.name}</span>
                                                                </div>
                                                            </Tag>
                                                            <ul>
                                                                {
                                                                    combination.tech_list.map((tech, t3) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={t3}>
                                                                            <TreeTag parent={tech} />
                                                                        </li>
                                                                    ))

                                                                }
                                                            </ul>
                                                        </li>
                                                    ))
                                                }


                                                {
                                                    item.product_list.map((product, p) => (
                                                        <li className="parent_li" key={p}>
                                                            <Tag size="purple" onClick={this.tree}>{product.name}</Tag>
                                                            <ul style={{ marginTop: 6 }}>

                                                                {
                                                                    product.product_tech_list.map((pTech, t4) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={t4}>
                                                                            <TreeTag parent={pTech} />
                                                                        </li>
                                                                    ))
                                                                }
                                                                {
                                                                    product.uom_unit_list.map((uom, u) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={u}>
                                                                            <Tag color="red" onClick={this.tree}>
                                                                                <div className="dib wEllipsis">
                                                                                    <span>{uom.name}</span>
                                                                                </div>
                                                                            </Tag>
                                                                            <ul>
                                                                                {
                                                                                    uom.tech_list.map((uTech, ut) => (
                                                                                        <li style={{ display: 'none' }} className="parent_li" key={ut}>
                                                                                            <TreeTag parent={uTech} />
                                                                                        </li>
                                                                                    ))
                                                                                }

                                                                            </ul>
                                                                        </li>
                                                                    ))
                                                                }


                                                                {
                                                                    product.packing_unit_list.map((packing, p) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={p}>
                                                                            <Tag color="pink" onClick={this.tree}>
                                                                                <div className="dib wEllipsis">
                                                                                    <span>{packing.name}</span>
                                                                                </div>
                                                                            </Tag>
                                                                            <ul>
                                                                                {
                                                                                    packing.tech_list.map((pTech, pt) => (
                                                                                        <li style={{ display: 'none' }} className="parent_li" key={pt}>
                                                                                            <TreeTag parent={pTech} />
                                                                                        </li>
                                                                                    ))
                                                                                }

                                                                            </ul>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </li >
                                                    ))
                                                }

                                            </ul >
                                        </li >
                                    ))

                                }

                            </ul >
                        </div >
                    </div>
                }

                {/* 列表 */}
                <div className="page calc-width" >
                    <div className="mb-15">
                        <div className="mb-15">
                            <Table rowKey={record => record.id} columns={columns} dataSource={listData} pagination={false} bordered
                                title={() => '核价单'} />
                        </div>
                        <div className="mb-15">
                            <Table rowKey={record => record.id} columns={columnsPro} dataSource={listPro} pagination={false} bordered
                                title={() => '产品信息'} />
                        </div>
                    </div>
                    <div className="mb-15">
                        <Tabs onChange={this.callback} type="card">
                            {
                                option.map((e, index) => (
                                    <TabPane tab={e.name} key={e.id}>
                                        {showData.product.source_attribute != 3 &&
                                            <>
                                                <div>
                                                    <Table rowKey={record => record.key} columns={columnsMaterial} dataSource={materialList}
                                                        bordered title={() => '主料成本合计（元）'} pagination={false} />
                                                </div>
                                                <div className="mt-15">
                                                    <Table rowKey={record => record.key} columns={columnsAccessories} dataSource={accessoriesList}
                                                        bordered title={() => '辅料模具成本合计（元）'} pagination={false} />
                                                </div>
                                                <div className="mt-15">
                                                    <Table rowKey={record => record.key} columns={columnsArtificial} dataSource={artificialList}
                                                        bordered title={() => '制造及人工成本合计（元）'} pagination={false} />
                                                </div>
                                            </>
                                        }
                                        <div className="mt-15">
                                            <Table rowKey={record => record.key} columns={columnsFreight} dataSource={freightList}
                                                bordered title={() => '运费合计（元）'} pagination={false} />
                                        </div>
                                    </TabPane>
                                ))
                            }
                        </Tabs>
                    </div>
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>
                            核价：
                        </div>
                        <Table rowKey={record => record.id} style={{ marginBottom: '50PX' }} columns={columnsNuclearPrice} dataSource={nuclearPricelist} pagination={false} />
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                            <span style={{ lineHeight: '32px' }}>
                                核价有效期：
                            </span>
                            <Input onChange={this.changeDay} style={{ width: '300px' }} placeholder="请输入有效期数" value={showData.valid_period_day} addonAfter="天" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>

                            {flagIsShowCommit == 2 &&
                                <>
                                    <Button style={{ marginRight: '20px' }} type="primary" size={size} onClick={this.saveIt}>保存</Button>
                                    <Button style={{ marginLeft: '20px' }} type="primary" size={size} onClick={this.commitIt}>提交</Button>
                                </>

                            }

                        </div>
                    </div>
                </div>
                {/* 弹出框 */}
                {/* 主料成本 */}
                <div>
                    <Modal title="主料成本" visible={isVisibleIngredientsMaterial} onOk={this.handleOkIngredientsMaterial}
                        onCancel={this.handleCancelIngredientsMaterial} cancelText="取消" okText="确定" width="1500px">
                        <div className='modalHeiht'>
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300 ellipsis-line">主料名称：
                                        <Tooltip placement="topLeft" title={showListData.name}>
                                            <span>{showListData.name}</span>
                                        </Tooltip>
                                    </div>
                                    <div className="w300">物料编号：{showListData.show_sku_number}</div>
                                    <div className="w300">计数单位：{showListData.counting_unit}</div>
                                    <div className="w300">计量单位：{showListData.measurement_unit}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">理论数量({showListData.counting_unit})：
                                        {
                                            isShowTheoryMeasureQuantity == 1 &&
                                            <span>
                                                {showListData.theory_measure_quantity}
                                                <EditTwoTone onClick={this.changeIsShowTheoryMeasureQuantity} />
                                            </span>
                                        }
                                        {
                                            isShowTheoryMeasureQuantity == 2 &&
                                            <span>
                                                <Input name='theory_measure_quantity' className='w100' onChange={this.changeQuantityInput}
                                                    onBlur={this.changeIsShowTheoryMeasureQuantity} value={showListData.theory_measure_quantity} />
                                            </span>
                                        }

                                    </div>
                                    <div className="w300">损耗数量：
                                        {
                                            isShowLossQuantity == 1 &&
                                            <span>
                                                {showListData.loss_quantity}
                                                <EditTwoTone onClick={this.changeIsShowLossQuantity} />
                                            </span>
                                        }
                                        {
                                            isShowLossQuantity == 2 &&
                                            <span>
                                                <Input name='loss_quantity' className='w100' onChange={this.changeQuantityInput}
                                                    onBlur={this.changeIsShowLossQuantity} value={showListData.loss_quantity} />
                                            </span>
                                        }
                                    </div>
                                    <div className="w300">用料数量({showListData.counting_unit})：{showListData.usage_counting_quantity}</div>
                                    <div className="w300">用料数量({showListData.measurement_unit})：
                                        {
                                            isShowUsageCountingQuantity == 1 &&
                                            <span>
                                                {showListData.usage_measure_quantity}
                                                <EditTwoTone onClick={this.changeIsShowUsageCountingQuantity} />
                                            </span>
                                        }
                                        {
                                            isShowUsageCountingQuantity == 2 &&
                                            <span>
                                                <Input name='usage_measure_quantity' className='w100' onChange={this.changeQuantityInput}
                                                    onBlur={this.changeIsShowUsageCountingQuantity} value={showListData.usage_measure_quantity} />
                                            </span>
                                        }
                                    </div>


                                </div>

                                <div className="fs mb-15">
                                    <div className="w300">单位成本：{showListData.unit_measure_cost}</div>
                                    <div className="w200">主料成本：{showListData.measure_cost}</div>
                                </div>
                            </div>
                            <div className='mb-15'>
                                <Table bordered rowKey={record => record.id} columns={columnsTechList} dataSource={showListData.tech_list} title={() => '主料工艺数据'} pagination={false} />
                            </div>
                            <div>
                                <Table bordered rowKey={record => record.index} columns={columnsCalculateProcessList} dataSource={showListData.calculate_process_list} title={() => '主料经历数据'} pagination={false} />
                            </div>
                        </div>
                    </Modal>
                </div >

                {/* 辅料成本 */}
                < div >
                    <Modal title="辅料成本" visible={isVisibleAccessoriesCost} onOk={this.handleOkAccessoriesCost}
                        onCancel={this.handleCancelAccessoriesCost} cancelText="取消" okText="确定" width="1300px">
                        <div>
                            {showListData.record_type == 2 &&
                                <div className='mb-15'>
                                    <Table bordered rowKey={record => record.key} columns={showAccessories} title={() => '辅料'} dataSource={showAccessoriesList} pagination={false} />
                                </div>

                            }
                            {showListData.record_type == 3 &&
                                <div className='mb-15'>
                                    <Table bordered rowKey={record => record.key} columns={showMould} title={() => '模具'} dataSource={showAccessoriesList} pagination={false} />
                                </div>
                            }
                        </div>
                    </Modal>
                </div >
                {/* 制造及人工成
                 */}
                < div >
                    <Modal title="制造及人工成" visible={isVisibleArtificialCost} onOk={this.handleOkArtificialCost}
                        onCancel={this.handleCancelArtificialCost} cancelText="取消" okText="确定" width="1000px">
                        {/* 子件数量>1 */}
                        <h3>工艺：{showListData.component_type_desc}/{showListData.type_desc}</h3>
                        {/* 子件工艺 */}
                        {showListData.component_type == 2 &&
                            <>
                                <div className="fs mb-15">
                                    <div className="w300">工件名称：{showListData.component_name}</div>
                                    <div className="w300">工件数量：{showListData.component_quantity}</div>
                                    <div className="w300">主料编号：
                                        {showListData.ingredient_list != null &&
                                            showListData.ingredient_list.map(e => (
                                                <span key={e.sku_number}>{e.show_sku_number}</span>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">筛选条件：{showListData.measurement_unit}</div>
                                    {/* todo */}
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                    <div className="w300">工艺面：{showListData.tech_side}</div>
                                </div>

                                <div className="fs mb-15">
                                    <div className="w300">加工机型：{showListData.settings_machine_name}</div>
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                    <div className="w300">进料开数：{showListData.open_number}</div>

                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">模数：{showListData.modulus}</div>
                                    <div className="w300">准备时长：{showListData.standard_prepare_time}</div>
                                    <div className="w300">能效( {showListData.counting_unit} /小时)：{showListData.standard_efficiency}</div>
                                </div>
                            </>
                        }
                        {/* 为拼版 大于1  */}
                        {showListData.flag == 1 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300">版数：
                                        {isShowformatQuantity == 1 &&
                                            <>
                                                {showListData.format_quantity}
                                                <EditTwoTone onClick={this.changeFormatQutity} />
                                            </>

                                        }
                                        {isShowformatQuantity == 2 &&
                                            <>
                                                <Input className="w200" value={showListData.format_quantity} onChange={this.changeFormatQutity}
                                                    onBlur={this.blurFormatQutityInput} />
                                            </>

                                        }
                                    </div>


                                    <div className="w300">每版份数：
                                        {isUnitFormatQuantity == 1 &&
                                            <>
                                                {showListData.unit_format_quantity}
                                                <EditTwoTone onClick={this.changeUnitFormatQuantity} />
                                            </>

                                        }
                                        {isUnitFormatQuantity == 2 &&
                                            <>
                                                <Input className="w200" value={showListData.unit_format_quantity} onChange={this.changeUnitFormatQuantity}
                                                    onBlur={this.blurFormatQutityInput} />
                                            </>

                                        }
                                    </div>
                                    <div className="w300">加工时长：{showListData.process_hour}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">费率：{showListData.total_rate}</div>
                                    <div className="w300">制造工时成本：{showListData.process_cost}</div>
                                </div>
                            </div>
                        }
                        {/* 等于1其他工艺 */}
                        {showListData.component_type == 2 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300">加工数量：{showListData.format_quantity}</div>
                                    <div className="w300">加工时长：{showListData.process_hour}</div>
                                    <div className="w300">费率：{showListData.total_rate}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">制造工时成本：{showListData.process_cost}</div>
                                </div>
                            </div>
                        }
                        {/* 组件工艺 */}
                        {showListData.flag == 4 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300">工件名称：{showListData.component_name}</div>
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                    <div className="w300">加工机型：{showListData.settings_machine_name}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                    <div className="w300">计数单位：{showListData.counting_unit}</div>
                                    <div className="w300">准备时长(小时)：{showListData.standard_prepare_time}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">效能({showListData.counting_unit}/小时)：{showListData.standard_efficiency}</div>
                                    <div className="w300">加工时长：{showListData.process_hour}</div>
                                    <div className="w300">费率(元/小时)：{showListData.total_rate}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">制造工时成本(元)：{showListData.process_cost}</div>
                                </div>
                            </div>
                        }
                        {/* 拉线工艺 */}
                        {showListData.type == 6 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300">工件名称：{showListData.component_name}</div>
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                    <div className="w300">计数单位：{showListData.counting_unit}</div>
                                    <div className="w300">UPH：{showListData.uph}</div>

                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">加工数量({showListData.component_unit})：{showListData.process_quantity}</div>
                                    <div className="w300">加工时长：{showListData.process_hour}</div>
                                    <div className="w300">费率(元/小时)：
                                        {isShowTotalRate == 1 &&
                                            <span>
                                                {showListData.total_rate}
                                                <EditTwoTone onClick={this.changeIsShowTotalRate} />
                                            </span>
                                        }
                                        {isShowTotalRate == 2 &&
                                            <span>
                                                <Input name='total_rate' className='w100' onChange={this.changeTotalRateInput}
                                                    onBlur={this.changeIsShowTotalRate} value={showListData.total_rate} />
                                            </span>
                                        }

                                    </div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">制造工时成本(元)：{showListData.process_cost}</div>
                                </div>
                            </div>
                        }
                        {/* uom工艺 */}
                        {showListData.type == 1 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                    <div className="w300">加工机型：{showListData.settings_machine_name}</div>
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">UOM单位：{showListData.uom_unit}</div>
                                    <div className="w300">UOM容量：{showListData.uom_capacity}</div>
                                    <div className="w300">UOM规格：{showListData.standard_prepare_time}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">准备时长(小时)：{showListData.standard_prepare_time}</div>
                                    <div className="w300">效能({showListData.uom_unit}/小时)：{showListData.tech_side}</div>
                                    <div className="w300">加工数量({showListData.uom_unit})：{showListData.process_quantity}</div>

                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">加工时长(小时)：{showListData.process_hour}</div>
                                    <div className="w300">费率(元/小时)：{showListData.total_rate}</div>
                                    <div className="w300">制造工时成本(元)：{showListData.process_cost}</div>
                                </div>
                            </div>
                        }
                        {/* 包装工艺 */}
                        {showListData.type == 2 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                    <div className="w300">加工机型：{showListData.settings_machine_name}</div>
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">包装单位：{showListData.package_unit}</div>
                                    <div className="w300">包装容量：{showListData.package_capacity}</div>
                                    <div className="w300">加工数量({showListData.product_counting_unit})：{showListData.process_quantity}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">准备时长(小时)：{showListData.standard_prepare_time}</div>
                                    <div className="w300">加工时长(小时)：{showListData.process_hour}</div>
                                    <div className="w300">效能({showListData.product_counting_unit}/小时)：{showListData.standard_efficiency}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">费率(元/小时)：{showListData.total_rate}</div>
                                    <div className="w300">制造工时成本(元)：{showListData.process_cost}</div>
                                </div>
                            </div>
                        }
                    </Modal>
                </div >
            </div >
        );
    }
}

export default index;