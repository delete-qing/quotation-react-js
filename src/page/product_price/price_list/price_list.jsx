import React, { Component } from 'react';
import $ from 'jquery'
import { Table, message, Tabs, Button, Input, Modal, Tag, Tooltip } from 'antd';
import { EditTwoTone, LeftOutlined, DownOutlined } from '@ant-design/icons';
import http from '../../../http'
import api from '../../../http/httpApiName'
import common from '../../common/common'
import TreeTag from '../../common/tree'
import CategoryAndMaterial from '../../common/categoryAndMaterial'
import '../product_price.css'



class index extends Component {

    state = {
        pageId: '',
        pods_bom_id: '',
        size: 'large',
        status: '',
        showData: {
            valid_period_day: 7,
            product: {},
            manage_rate: 0,
            gross_margin_rate: 0,
            tax_rate: 0,
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
                width: 150,
                render: (text, record) => <span>{record.product.name}</span>,
            },
            {
                title: '询价单号',
                dataIndex: 'related_number',
            },
            {
                title: '客户名称',
                width: 100,
                dataIndex: 'customer_name',
            },
            {
                title: '联系人',
                width: 100,
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
                width: 90,
                render: (text, record) => <span>{record.inquiry_order.delivery_mode_desc}</span>,
            },
            {
                title: '运输方式',
                width: 90,
                render: (text, record) => <span>{record.inquiry_order.transport_mode_desc}</span>,
            },
            {
                title: '备注',
                width: 120,
                render: (text, record) => <span>{record.inquiry_order.remark}</span>,
            },

        ],
        listData: [],
        columnsPro: [
            {
                title: '产品名称',
                width: 150,
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
                width: 70,
                dataIndex: 'unit',
            },
            {
                title: '询价数量',
                width: 100,
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
                width: 260,
                render: (text, record) => {
                    let show
                    show = <>
                        {record.pack_units.map((e, index) => (
                            <div key={index}>
                                <span>{index + 1}级包装单位：{e.name}</span>，
                                {e.pack_material != null &&
                                    <span>
                                        包装材质：{e.pack_material.name}
                                    </span>
                                },
                                <span> 包装容量：{e.capacity_type_desc}</span>，
                                {e.capacity_type == 1 &&
                                    <span>
                                        固定数量：{e.capacity_value}
                                    </span>
                                }
                            </div>
                        ))
                        }
                    </>

                    return (
                        <div>
                            {show}
                        </div>
                    )

                }

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
                width: 150,
                dataIndex: 'sample_number',
            },

            {
                title: 'BOM工单号',
                width: 160,
                dataIndex: 'work_order_number',
            },
        ],
        listPro: [],
        // 展示询价数量
        option: [],
        columnsMaterial: [
            {
                title: '工件版式',
                width: 120,
                render: (text, record) => (
                    <div>
                        <span> {record.component_name}({record.format_name})</span>
                    </div>
                )
            },
            {
                title: '特性',
                width: 150,
                render: (text, record) => (
                    <div>
                        <span> {record.character}</span>
                    </div>
                )

            },
            {
                title: '主材名称',
                dataIndex: 'name',
                width: 180,
            },
            {
                title: '物料编号',
                width: 120,
                dataIndex: 'show_sku_number',
            },
            {
                title: '主材规格',
                width: 110,
                dataIndex: 'specification',
            },
            {
                title: '计数单位',
                width: 70,
                dataIndex: 'counting_unit',
            },
            {
                title: '计量单位',
                width: 70,
                dataIndex: 'measurement_unit',
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
                width: 100,
                render: (text, record) => (
                    <div>
                        <span>{record.usage_measure_quantity}{record.measurement_unit}</span>
                    </div>
                ),
            },

            {
                title: '单位成本(元/计量单位)',
                width: 115,
                render: (text, record) => (
                    <div>
                        <span>{record.unit_measure_cost}(元/{record.measurement_unit})</span>
                    </div>
                ),
            },
            {
                title: '主材成本(元)',
                render: (text, record) => (
                    <div>
                        <span>{record.measure_cost}元</span>
                    </div>
                ),
                width: 80,
            },
            {
                title: '操作',
                width: 70,
                render: (text, record) => {
                    let editIt
                    editIt = <div>
                        <a onClick={() => this.ingredientsMaterial(record)}>查看</a>
                    </div>
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
                        <span>{record.component_name}({record.format_name})</span>
                    </div>
                ),

            },
            {
                title: '工艺名称',
                dataIndex: 'tech_name',
            },
            {
                title: '辅料/模具名称',
                width: 95,
                dataIndex: 'name',
            },
            {
                title: '说明',
                dataIndex: 'remark',
            },
            {
                title: '特性',
                width: 150,
                render: (text, record) => (
                    <div>
                        <span>{record.class_manage_name}</span>
                        {record.feature_value &&
                            <span> 【{record.feature_value}】</span>
                        }
                    </div>
                ),

            },
            {
                title: '物料编号',
                width: 110,
                dataIndex: 'show_sku_number',
            },
            {
                title: '计数单位',
                width: 90,
                dataIndex: 'counting_unit',
            },
            {
                title: '计量单位',
                width: 90,
                dataIndex: 'measurement_unit',
            },
            {
                title: '用量',
                dataIndex: 'usage_measure_quantity',
            },
            {
                title: '单位成本',
                width: 90,
                dataIndex: 'unit_measure_cost',
            },
            {
                title: '辅料/模具成本(元)',
                width: 95,
                dataIndex: 'measure_cost',
            },
            {
                title: '操作',
                render: (text, record) => {
                    let editIt
                    editIt = <div>
                        <a onClick={() => this.accessoriesCost(record)}>查看</a>
                    </div>
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
                dataIndex: 'process_cost',
            },
            {
                title: '操作',
                render: (text, record) => {
                    let editIt
                    editIt = <div>
                        <a onClick={() => this.artificialCost(record)}>查看</a>
                    </div>
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
        visibleBack: false,
        showIngredientsMaterial: {},
        columnsTechList: [
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
                                <div key={index}>{e.name}</div>
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
        showAccessoriesList: [],
        showListData: {
            ingredient_list: [],
            format_quantity: '',
            unit_format_quantity: '',
            key: '',
            usage_measure_quantity: '',
            unit_measure_cost: '',
        },
        isShowUsageCountingQuantity: 1,
        isShowTheoryMeasureQuantity: 1,
        isShowLossQuantity: 1,
        isUnitMeasureCost: 1,
        isshowComponent: false,
        showMouldList: [],
        keyId: '',
        editArr: [],
        isShowFlag: 1,
        source_attribute: 1,
        isStandardPrepareTime: 1,
        // 准备时长
        isStandardEfficiency: 1,
        description: '',
        // 委外
        techOutsourcingList: [],
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
                let proBomData = data.product
                if (data.valid_period_day == 0) {
                    data.valid_period_day = 7
                }
                let bomId = res.data.pods_bom_id
                let status = res.data.status
                // 是否禁用费率输入框
                listData.push(data)
                proData.push(data.product)
                let detail = res.data.details
                let source_attribute = data.product.source_attribute
                detail.forEach(e => {
                    e.source_attribute = data.product.source_attribute
                    e.totalCost = 1
                })
                data.manage_rate = detail[0].manage_rate
                data.gross_margin_rate = detail[0].gross_margin_rate
                data.tax_rate = detail[0].tax_rate
                // 获取询价数量列表信息
                optionData = res.data.product.quantities
                optionData.forEach(j => {
                    j.name = '询价数量：' + j.quantity + j.unit
                });
                if (optionData.length != 0) {
                    let temQuantity = optionData[0].quantity
                    this.getListData(id, bomId, temQuantity, status)
                }
                if (data.product.source_attribute != 3) {
                    this.bom(bomId, proBomData)
                }
                this.setState(
                    {
                        listData: listData,
                        option: optionData,
                        showData: data,
                        nuclearPricelist: detail,
                        listPro: proData,
                        pods_bom_id: bomId,
                        status: status,
                        source_attribute,
                    }
                )
            } else {
                message.warning(res.message);
            }
        })
    }

    // 根据id获取信
    getListData(pid, bid, num) {
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
            let techOutsourcingList = res.data.tech_outsourcing_list
            techOutsourcingList.forEach(i => {
                i.unitMeasureCost = 1
            })
            // 运费
            deliveryInfo.forEach(e => {
                e.isShowUnitVolume = 1
                e.isShowUnitWeight = 1
                e.isVolumeCostRate = 1
                e.isWeightCostRate = 1
            })
            this.setState(
                {
                    materialList: ingredientList,
                    accessoriesList: supplementary,
                    artificialList: techList,
                    freightList: deliveryInfo,
                    techOutsourcingList
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

    bom(id, proData) {
        http.get(import.meta.env.VITE_APP_PODS_HOST + '/bom/get', {
            params: {
                id: id
            }
        }).then(res => {
            if (res.data.status == 1) {
                let resData = res.data.data
                let resultMap = this.initData(resData, proData);

                let data = [{
                    name: proData.name || '产品名称',
                    component_list: resultMap.component_list,
                    pre_component_list: resultMap.pre_component_list,
                    combination_list: resultMap.combination_list,
                    product_list: resultMap.product_list,
                    packing_list: resultMap.packing_list
                }];
                this.setState({ list: data })
            }
        })
    }

    initData(BOM, operate = false, proData) {

        let res = BOM.engineering_data;

        let componentIds = []; // 被预组件或组件使用的子件
        let pre_component_list = [];
        res.pre_component_list.forEach(pre => {

            if (pre.puzzle_plan == 1) {
                componentIds = componentIds.concat(common.getAsStringToArray.toArray(pre.contain_component_ids, '_'));
            } else {
                pre.group_list.forEach(group => {
                    componentIds = componentIds.concat(common.getAsStringToArray.toArray(group.contain_component_ids, '_'));
                });
            }

            let tech_list = [];
            pre.tech_list.forEach(tech => {

                tech.artifact_name = pre.name;
                let techInfo = this.getTech(tech);

                tech_list.push({
                    id: tech.id,
                    sort: tech.sort,
                    operate: operate,
                    name: tech.settings_tech_options_name,
                    comsumable_list: techInfo.comsumable_list,
                    mould_list: techInfo.mould_list,
                    options: techInfo.options,
                    result: common.clone.deepClone(tech)
                });
            });

            let categoryAndMaterial = this.getCategoryAndMaterial(pre.material_list, operate, 'pre');

            pre_component_list.push({
                ...pre,
                id: pre.id,
                name: pre.name,
                operate: operate,
                category_list: categoryAndMaterial.category_list,
                material_list: categoryAndMaterial.material_list,
                group_list: pre.group_list || [],
                tech_list: tech_list.sort(this.compare)
            });
        });

        let combination_list = [];
        res.combination_list.forEach(combination => {

            // 子件
            combination.component_ids = common.getAsStringToArray.toArray(combination.component_ids, '_');
            // 组件
            combination.component_combination_ids = common.getAsStringToArray.toArray(combination.component_combination_ids, '_');

            let tech_list = [];
            combination.tech_list.forEach(tech => {

                tech.artifact_name = combination.name;
                let techInfo = this.getTech(tech);

                tech_list.push({
                    id: tech.id,
                    sort: tech.sort,
                    operate: operate,
                    name: tech.settings_tech_options_name,
                    comsumable_list: techInfo.comsumable_list,
                    mould_list: techInfo.mould_list,
                    options: techInfo.options,
                    result: common.clone.deepClone(tech)
                });
            });

            let categoryAndMaterial = this.getCategoryAndMaterial(combination.material_list, operate, 'combination');

            combination_list.push({
                ...combination,
                operate: operate,
                id: combination.id,
                name: combination.name,
                category_list: categoryAndMaterial.category_list,
                material_list: categoryAndMaterial.material_list,
                tech_list: tech_list.sort(this.compare),
            });
        });

        let component_list = [];
        res.component_list.forEach(component => {

            let tech_list = [];
            component.tech_list.forEach(tech => {

                tech.artifact_name = component.name;
                let techInfo = this.getTech(tech);

                tech_list.push({
                    id: tech.id,
                    sort: tech.sort,
                    operate: operate,
                    name: tech.settings_tech_options_name,
                    comsumable_list: techInfo.comsumable_list,
                    mould_list: techInfo.mould_list,
                    options: techInfo.options,
                    result: common.clone.deepClone(tech)
                });
            });

            let categoryAndMaterial = this.getCategoryAndMaterial(component.material_list, operate, 'component');

            component.disabled = componentIds.includes(component.id);

            component_list.push({
                ...component,
                operate: operate,
                category_list: categoryAndMaterial.category_list,
                material_list: categoryAndMaterial.material_list,
                tech_list: tech_list.sort(this.compare)
            });
        });

        let u_tech_list = [];
        let product_tech_list = [];
        res.product_tech_list.forEach(tech => {

            tech.artifact_name = '';
            let techInfo = this.getTech(tech);

            if (tech.type == 0) {
                product_tech_list.push({
                    id: tech.id,
                    operate: operate,
                    name: tech.settings_tech_options_name,
                    comsumable_list: techInfo.comsumable_list,
                    mould_list: techInfo.mould_list,
                    options: techInfo.options,
                    result: common.clone.deepClone(tech)
                });
            } else if (tech.type == 1) {
                u_tech_list.push({
                    id: tech.id,
                    operate: operate,
                    name: tech.settings_tech_options_name,
                    comsumable_list: techInfo.comsumable_list,
                    mould_list: techInfo.mould_list,
                    options: techInfo.options,
                    result: common.clone.deepClone(tech)
                });
            }
        });

        let uom_unit_list = [];
        if (res.sku_unit !== '') {
            let name = res.sku_unit + '(' + res.sku_capacity + ')';
            uom_unit_list.push({
                name: name,
                tech_list: u_tech_list
            });
        }

        let packing_unit_list = [];
        res.packaging_list.forEach((packaging, p) => {

            let techList = []
            if (packaging.packaging_tech != null && packaging.packaging_tech.settings_tech_options_id != 0 && typeof packaging.packaging_tech.settings_tech_options_id !== 'undefined') {
                let techInfo = packaging.packaging_tech;
                techList = [
                    {
                        id: techInfo.id,
                        operate: operate,
                        name: techInfo.settings_tech_options_name,
                        comsumable_list: techInfo.comsumable_list,
                        mould_list: techInfo.mould_list,
                        options: techInfo.options,
                        result: deepClone(techInfo)
                    }
                ]
            }

            let unit;
            if (!p) {
                unit = this.$root.unit;
            } else {
                unit = res.packaging_list[p - 1]['unit'];
            }

            let name = packaging.unit;
            if (packaging.capacity_type == 1) {
                name = packaging.capacity + unit + '/' + packaging.unit;
            }

            packing_unit_list.push(
                {
                    name: name,
                    id: packaging.id,
                    unit: packaging.unit,
                    capacity_type: packaging.capacity_type,
                    capacity: packaging.capacity,
                    tech_list: techList,
                    packaging_tech: packaging.packaging_tech
                }
            );
        });

        let categoryAndMaterial = this.getCategoryAndMaterial(res.material_list, operate, 'product');

        let product_list = [
            {
                name: '产品工序',
                operate: false,
                category_list: categoryAndMaterial.category_list,
                material_list: categoryAndMaterial.material_list,
                product_tech_list: product_tech_list,
                uom_unit_list: uom_unit_list
            }
        ];

        let packing_list = [
            {
                name: '产品包装',
                operate: false,
                packing_unit_list: packing_unit_list
            }
        ];

        this.revision_note = BOM.revision_note;
        this.version_instructions = BOM.version_instructions;
        this.componentType = BOM.engineering_data.component_type;

        return {
            component_list: component_list,
            pre_component_list: pre_component_list,
            combination_list: combination_list,
            product_list: product_list,
            packing_list: packing_list
        }
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
        mould_list = tech.mould_list.filter(mould => {
            mould.mould_name = mould.settings_tech_mould_name;
            return true;
        });

        resultMap.mould_list = mould_list;

        let options = [];
        tech.options.forEach(option => {
            options.push({
                id: option.id,
                option_name: option.options_name
            });
        });
        resultMap.options = options;

        if (tech.processing_way == 2) {
            let techName = tech.settings_tech_options_name;
            tech.tech_name = techName;
            tech.settings_tech_options_name = techName + '(' + { 1: '简单', 2: '复杂' }[tech.complexity] + ')';
            tech.settings_tech_options_name_work = techName + '(' + { 1: '简单', 2: '复杂' }[tech.complexity] + '-' + tech.artifact_name + ')';
        }

        return resultMap;
    }



    getCategoryAndMaterial(materialList, operate, key) {
        let category_list = [];
        let material_list = [];
        materialList.forEach(material => {
            if (material.type == 1) {
                // 物料
                material_list.push({
                    ...material,
                    key: key,
                    operate: operate,
                    name: material.name,
                    del_id: material.id,
                    id: material.settings_material_id
                });
            } else if (material.type == 3) {
                material.key = key;
                material.del_id = material.id;

                let mList = [];
                if (material.material_sku_number != '' && material.material_sku_number != 0) {
                    mList = [
                        {
                            ...material,
                            key: key,
                            operate: operate,
                            name: material.name,
                            del_id: material.id,
                            id: material.settings_material_id
                        }
                    ];
                }

                category_list.push({
                    key: key,
                    id: material.class_manage_id,
                    name: material.class_manage_name,
                    del_id: material.id,
                    group_id: material.feature_value_group_id,
                    operate: operate,
                    material: material,
                    material_list: mList
                });
            }
        });

        return {
            category_list: category_list,
            material_list: material_list
        }
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
                if (data.calculate_process_list) {
                    data.calculate_process_list.forEach(e => {
                        e.preKey = data.key
                    })
                }
                let dataList = []
                // 子件工艺 为拼版  大于1
                if ((data.component_quantity > 1 && data.imposition_settings == 1) && (data.type == 4 || data.type == 3)) {
                    data.flag = 1
                } else if (data.type == 4 || data.type == 3) {
                    data.flag = 3
                } else if (data.type == 0 || data.type == 5) {
                    data.flag = 4
                }

                dataList.push(res.data)
                dataList.forEach((e, index) => {
                    e.keyIndex = index
                    e.isShowUsageMeasureQuantity = 1
                    e.isShowReservedQuantity = 1
                    e.isShowformatQuantity = 1
                    e.isUnitFormatQuantity = 1
                    e.isShowTotalRate = 1
                    e.isShowExcipientsTheoryMeasureQuantity = 1
                    e.isShowCountingQuantity = 1
                    e.isUnitMeasureCost = 1
                })

                this.setState({
                    showListData: data,
                    showAccessoriesList: dataList,
                    keyId: key,
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

    // 辅料成本
    accessoriesCost = (data) => {
        this.getEncapsulatio(data.key)
        this.setState({ isVisibleAccessoriesCost: true })
    }
    // 辅料保存
    handleOkAccessoriesCost = () => {
        let data = {}
        this.setState({
            isVisibleAccessoriesCost: false,
            showListData: data
        })
    }
    // 辅料取消
    handleCancelAccessoriesCost = () => {
        let data = {}
        this.setState({
            isVisibleAccessoriesCost: false,
            showListData: data
        })
    }

    // 制造人工成本
    artificialCost = (data) => {
        this.getEncapsulatio(data.key)
        this.setState({
            isVisibleArtificialCost: true,
        })
    }

    // 是否显示输入框
    changeFormatQutity = (key) => {
        const { isStandardPrepareTime, isStandardEfficiency } = this.state
        let standard_prepare_time_num = isStandardPrepareTime
        let standard_efficiency_num = isStandardEfficiency

        if (key == 'standard_prepare_time') {
            if (standard_prepare_time_num == 1) {
                standard_prepare_time_num = 2
            } else {
                standard_prepare_time_num = 1
                this.saveChangeIsShowTotalRate(key)
            }
        }

        if (key == 'standard_efficiency') {
            if (standard_efficiency_num == 1) {
                standard_efficiency_num = 2
            } else {
                standard_efficiency_num = 1
                this.saveChangeIsShowTotalRate(key)
            }
        }

        this.setState({
            isStandardPrepareTime: standard_prepare_time_num,
            isStandardEfficiency: standard_efficiency_num
        })
    }

    // 人工费率改变输入框
    changeFormatQutityInput = (e) => {
        const { showListData } = this.state
        showListData[e.target.name] = e.target.value
        this.setState({ showListData })

    }

    // 人工编辑保存刷新数据
    saveChangeIsShowTotalRate(keyName) {
        const { showListData, pageId, keyId } = this.state
        let dataMap = {}
        dataMap[keyName] = showListData[keyName]

        // 这里let dataMap是个对象  dataMap[keyName]是dataMap.a=showListData.b
        // if keyName = a
        //那么 就是这样执行的
        // dataMap:{
        // a:a
        // }
        // 所以下面传的是dataMap对象

        let params = {
            id: keyId,
            type: 3,
            data: dataMap
        }
        http.post(api.bomCostDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getEncapsulatio(keyId)
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }

    // 人工成本保存
    handleOkArtificialCost = () => {
        let data = {}
        this.setState({
            isVisibleArtificialCost: false,
            showListData: data

        })
    }
    // 人工成本保存取消
    handleCancelArtificialCost = () => {
        let data = {}
        this.setState({
            isVisibleArtificialCost: false,
            showListData: data
        })
    }

    // 主料是否显示
    changeIsShowUsageCountingQuantity = (key) => {
        const { isShowUsageCountingQuantity, isShowTheoryMeasureQuantity, isShowLossQuantity, isUnitMeasureCost } = this.state
        let usage_measure_quantity_num = isShowUsageCountingQuantity
        let theory_measure_quantity_num = isShowTheoryMeasureQuantity
        let loss_quantity_num = isShowLossQuantity
        let unit_measure_cost_num = isUnitMeasureCost

        if (key == 'usage_measure_quantity') {
            if (usage_measure_quantity_num == 1) {
                usage_measure_quantity_num = 2
            } else {
                usage_measure_quantity_num = 1
                this.saveTitle(key)
            }
        }
        if (key == 'theory_measure_quantity') {
            if (theory_measure_quantity_num == 1) {
                theory_measure_quantity_num = 2
            } else {
                theory_measure_quantity_num = 1
                this.saveTitle(key)
            }
        }

        if (key == 'loss_quantity') {
            if (loss_quantity_num == 1) {
                loss_quantity_num = 2
            } else {
                loss_quantity_num = 1
                this.saveTitle(key)
            }
        }


        if (key == 'unit_measure_cost') {
            if (unit_measure_cost_num == 1) {
                unit_measure_cost_num = 2
            } else {
                unit_measure_cost_num = 1
                this.saveTitle(key)
            }
        }

        this.setState({
            isShowUsageCountingQuantity: usage_measure_quantity_num,
            isShowTheoryMeasureQuantity: theory_measure_quantity_num,
            isShowLossQuantity: loss_quantity_num,
            isUnitMeasureCost: unit_measure_cost_num
        })
    }

    // 编辑输入框
    changeQuantityInput = (e) => {
        const { showListData } = this.state
        showListData[e.target.name] = e.target.value
        this.setState({ showListData })
    }

    // 主料编辑保存
    saveTitle = (key) => {
        const { showListData, keyId, pageId } = this.state
        let data = {}
        data[key] = showListData[key]
        let params = {
            id: keyId,
            type: 2,
            data: data
        }

        http.post(api.bomCostDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getEncapsulatio(keyId)
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    // 主料保存
    handleOkIngredientsMaterial = () => {
        let data = {}
        this.setState({
            isVisibleIngredientsMaterial: false,
            showListData: data
        })
    }
    // 主料取消
    handleCancelIngredientsMaterial = () => {
        let data = {}
        this.setState({
            isVisibleIngredientsMaterial: false,
            showListData: data
        })
    }

    // 编辑辅料
    editReservedQuantity = (key, type, index) => {
        const { showAccessoriesList } = this.state
        let num_theory_measure_quantity = showAccessoriesList[index].isShowExcipientsTheoryMeasureQuantity
        let num_loss_quantity = showAccessoriesList[index].isShowReservedQuantity
        let num_usage_measure_quantity = showAccessoriesList[index].isShowUsageMeasureQuantity
        let num_usage_counting_quantity = showAccessoriesList[index].isShowCountingQuantity
        let num_unit_measure_cost = showAccessoriesList[index].isUnitMeasureCost


        if (key == 'theory_measure_quantity') {
            if (num_theory_measure_quantity == 1) {
                num_theory_measure_quantity = 2
            } else {
                num_theory_measure_quantity = 1
                this.saveUsageMeasureQuantityInput(key, type, index)
            }
        }

        if (key == 'loss_quantity') {
            if (num_loss_quantity == 1) {
                num_loss_quantity = 2
            } else {
                num_loss_quantity = 1
                this.saveUsageMeasureQuantityInput(key, type, index)
            }
        }


        if (key == 'usage_measure_quantity') {
            if (num_usage_measure_quantity == 1) {
                num_usage_measure_quantity = 2
            } else {
                num_usage_measure_quantity = 1
                this.saveUsageMeasureQuantityInput(key, type, index)
            }
        }


        if (key == 'usage_counting_quantity') {
            if (num_usage_counting_quantity == 1) {
                num_usage_counting_quantity = 2
            } else {
                num_usage_counting_quantity = 1
                this.saveUsageMeasureQuantityInput(key, type, index)
            }
        }

        if (key == 'unit_measure_cost') {
            if (num_unit_measure_cost == 1) {
                num_unit_measure_cost = 2
            } else {
                num_unit_measure_cost = 1
                this.saveUsageMeasureQuantityInput(key, type, index)
            }
        }

        showAccessoriesList[index].isShowExcipientsTheoryMeasureQuantity = num_theory_measure_quantity
        showAccessoriesList[index].isShowReservedQuantity = num_loss_quantity
        showAccessoriesList[index].isShowUsageMeasureQuantity = num_usage_measure_quantity
        showAccessoriesList[index].isShowCountingQuantity = num_usage_counting_quantity
        showAccessoriesList[index].isUnitMeasureCost = num_unit_measure_cost

        this.setState({ showAccessoriesList })
    }

    editReservedQuantityInput = (e, index) => {
        const { showAccessoriesList } = this.state
        showAccessoriesList[index][e.target.name] = e.target.value
        this.setState({ showAccessoriesList })
    }

    saveUsageMeasureQuantityInput = (key, type, index) => {
        const { pageId, keyId, showAccessoriesList } = this.state
        let data = {}
        data[key] = showAccessoriesList[index][key]
        let params = {
            id: keyId,
            type: type,
            data: data
        }
        http.post(api.bomCostDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getEncapsulatio(keyId)
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    // 核价编辑
    onchangeNuclearPriceinput = (e) => {
        const { showData } = this.state
        showData[e.target.name] = e.target.value
        this.setState({ showData })
    }
    // 修改总成本
    editTotalCost(index) {
        const { nuclearPricelist } = this.state

        if (nuclearPricelist[index].totalCost == 1) {
            nuclearPricelist[index].totalCost = 2
        } else {
            nuclearPricelist[index].totalCost = 1
            this.saveIt()
        }

        this.setState({ nuclearPricelist })
    }
    changeTotalCostInput(event, index) {
        const { nuclearPricelist } = this.state
        nuclearPricelist[index].total_cost = event.target.value
        this.setState({ nuclearPricelist })
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
                    manage_rate: showData.manage_rate,
                    gross_margin_rate: showData.gross_margin_rate,
                    tax_rate: showData.tax_rate,
                    total_cost: i.total_cost
                }
            )
        })
        http.post(api.checkSave, params).then(res => {
            if (res.code == 1) {
                message.success('修改成功')
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    commitIt = () => {
        const { pageId, showData, nuclearPricelist, source_attribute } = this.state
        let that = this
        const { confirm } = Modal;
        let params = {
            id: Number(pageId),
            valid_period_day: Number(showData.valid_period_day),
            details: []
        }
        let flag = false
        nuclearPricelist.forEach(i => {
            if (!i.price_info.is_check_price && source_attribute != 1) {
                flag = true
            }
            params.details.push(
                {
                    id: i.id,
                    manage_rate: showData.manage_rate,
                    gross_margin_rate: showData.gross_margin_rate,
                    tax_rate: showData.tax_rate,
                    total_cost: i.total_cost
                }
            )
        })

        if (flag) {
            message.warning('当前物料尚未进行采购核价，核价完成后再进行操作！')
            return
        }
        confirm({
            title: '您确定要提交当前核价单么？提交之后当前核价单状态将变为【已核价】',
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
                                    path: '/productPrice',
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
        });
    }
    // 运费是否显示输入框
    isShowinput = (index, key) => {
        const { freightList } = this.state
        let data = freightList[index]
        let unit_volume_num = freightList[index].isShowUnitVolume
        let unit_weight_num = freightList[index].isShowUnitWeight
        let volume_cost_rate_num = freightList[index].isVolumeCostRate
        let weight_cost_rate_num = freightList[index].isWeightCostRate
        if (key == 'unit_volume') {
            if (unit_volume_num == 1) {
                unit_volume_num = 2
            } else {
                unit_volume_num = 1
                this.saveFreight(data, key)
            }
        }
        if (key == 'unit_weight') {
            if (unit_weight_num == 1) {
                unit_weight_num = 2
            } else {
                unit_weight_num = 1
                this.saveFreight(data, key)
            }
        }
        if (key == 'volume_cost_rate') {
            if (volume_cost_rate_num == 1) {
                volume_cost_rate_num = 2
            } else {
                volume_cost_rate_num = 1
                this.saveFreight(data, key)
            }
        }
        if (key == 'weight_cost_rate') {
            if (weight_cost_rate_num == 1) {
                weight_cost_rate_num = 2
            } else {
                weight_cost_rate_num = 1
                this.saveFreight(data, key)
            }
        }
        freightList[index].isShowUnitVolume = unit_volume_num
        freightList[index].isShowUnitWeight = unit_weight_num
        freightList[index].isVolumeCostRate = volume_cost_rate_num
        freightList[index].isWeightCostRate = weight_cost_rate_num
        this.setState({ freightList })
    }
    // 运费改变输入框
    changeUnitVolumeInput = (e, index) => {
        const { freightList } = this.state
        freightList[index][e.target.name] = e.target.value
        this.setState({ freightList })
    }
    // 保存运费
    saveFreight = (dataNum, keyName) => {
        const { pageId } = this.state
        let dataMap = {}
        dataMap[keyName] = dataNum[keyName]
        let params = {
            id: dataNum.key,
            type: 1,
            data: dataMap

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
    changeArtificialInput = (index, key) => {
        const { showAccessoriesList } = this.state
        let format_quantity_num = showAccessoriesList[index].isShowformatQuantity
        let unit_format_quantity_num = showAccessoriesList[index].isUnitFormatQuantity
        let total_rate_num = showAccessoriesList[index].isShowTotalRate

        if (key == 'format_quantity') {
            if (format_quantity_num == 1) {
                format_quantity_num = 2
            } else {
                format_quantity_num = 1
                this.saveChangeIsShowTotalRate(key)
            }
        }

        if (key == 'unit_format_quantity') {
            if (unit_format_quantity_num == 1) {
                unit_format_quantity_num = 2
            } else {
                unit_format_quantity_num = 1
                this.saveChangeIsShowTotalRate(key)
            }
        }

        if (key == 'total_rate') {
            if (total_rate_num == 1) {
                total_rate_num = 2
            } else {
                total_rate_num = 1
                this.saveChangeIsShowTotalRate(key)
            }
        }
        showAccessoriesList[index].isShowformatQuantity = format_quantity_num
        showAccessoriesList[index].isUnitFormatQuantity = unit_format_quantity_num
        showAccessoriesList[index].isShowTotalRate = total_rate_num


        this.setState({ showAccessoriesList })

    }
    backBOM = () => {
        this.setState({ visibleBack: true })
    }
    onChangeDescription = (e) => {
        this.setState({ description: e.target.value })
    }
    // 退回
    handleOkBack = () => {
        const { description, showData } = this.state
        let params = {
            id: showData.id,
            stage: 1,
            description: description
        }

        if (params.description == "") {
            message.warning('请输入退回原因')
            return
        }
        let history = this.props.history
        http.post('/check/order/return', params).then(res => {
            if (res.code == 1) {
                message.success('退回成功')
                this.setState({ visibleBack: false })
                setTimeout(() => {
                    common.pathData.getPathData(
                        {
                            path: '/productPrice',
                            data: {
                                type: 2
                            },
                            history: history
                        }
                    )
                }, 500)
            } else {
                message.warning(res.message)
            }

        })

    }
    handleCancelBack = () => {
        this.setState({ visibleBack: false })
    }

    // 改变委外
    onChangeTotalRate = (record) => {
        const { techOutsourcingList } = this.state
        if (record.unitMeasureCost == 1) {
            record.unitMeasureCost = 2
        } else {
            record.unitMeasureCost = 1
            this.saveOutsource(record)
        }
        this.setState({ techOutsourcingList })
    }

    changeUnitMeasureCost = (e, index) => {
        const { techOutsourcingList } = this.state
        techOutsourcingList[index].unit_measure_cost = e.target.value
        this.setState({ techOutsourcingList })
    }

    saveOutsource(data) {
        const { pageId } = this.state
        let params = {
            id: data.key,
            type: 6,
            data: {
                unit_measure_cost: Number(data.unit_measure_cost)
            }
        }
        http.post(api.bomCostDetail, params).then(res => {
            if (res.code == 1) {
                message.success('设置成功')
                this.getEncapsulatio(data.key)
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })

    }

    render() {
        const {
            option, showData, columns, listData, columnsMaterial, materialList, columnsAccessories, accessoriesList,
            columnsArtificial, artificialList, freightList, nuclearPricelist, columnsPro, listPro, list,
            isVisibleIngredientsMaterial, isVisibleAccessoriesCost, isVisibleArtificialCost, showAccessoriesList,
            showListData, columnsTechList, isShowUsageCountingQuantity, status, visibleBack, description, techOutsourcingList,
            isShowTheoryMeasureQuantity, isShowLossQuantity, source_attribute, isStandardPrepareTime, isStandardEfficiency, isUnitMeasureCost
        } = this.state
        const { TabPane } = Tabs;
        const { TextArea } = Input;

        let flagIsShowCommit = 1
        let rateInput = true
        if (status == 5 || status == 6) {
            flagIsShowCommit = 2
            rateInput = false
        }
        // 运费
        const columnsFreight = [
            {
                title: '运程',
                dataIndex: 'name',

                width: 90
            },
            {
                title: '每包装单位体积(立方米/包装单位)',
                width: 150,
                render: (text, record, index) => {
                    let unitData
                    let show
                    if (record.pack_unit_list) {
                        unitData = <>
                            {
                                record.pack_unit_list.map(e => (
                                    <span key={e.id}>
                                        （立方米/{e.name}）
                                    </span>
                                ))
                            }
                        </>
                    }


                    if (status == 5 || status == 6) {
                        show = <span>
                            {record.isShowUnitVolume == 1 &&
                                <>
                                    <a>{record.unit_volume}</a>
                                    <EditTwoTone onClick={() => this.isShowinput(index, 'unit_volume')} />
                                </>
                            }

                            {record.isShowUnitVolume == 2 &&
                                <>
                                    <Input name='unit_volume' onChange={(e) => this.changeUnitVolumeInput(e, index)}
                                        value={record.unit_volume} className="w100" onBlur={() => this.isShowinput(index, 'unit_volume')} />
                                </>
                            }

                        </span>
                    } else {
                        show = <span>{record.unit_volume}{unitData}</span>
                    }

                    return (
                        <div>{show}</div>
                    )
                }

            },
            {
                title: '每包装单位重量(公斤/包装单位)',
                render: (text, record, index) => {
                    let unitData
                    let show
                    if (record.pack_unit_list) {
                        unitData = <>
                            {
                                record.pack_unit_list.map(e => (
                                    <span key={e.id}>（公斤/{e.name}）</span>
                                ))
                            }
                        </>
                    }
                    if (status == 5 || status == 6) {
                        show = <span>
                            {record.isShowUnitWeight == 1 &&
                                <>
                                    <a>{record.unit_weight}</a>
                                    <EditTwoTone onClick={() => this.isShowinput(index, 'unit_weight')} />
                                </>
                            }

                            {record.isShowUnitWeight == 2 &&
                                <>
                                    <Input name='unit_weight' onChange={(e) => this.changeUnitVolumeInput(e, index)}
                                        value={record.unit_weight} className="w100" onBlur={() => this.isShowinput(index, 'unit_weight')} />
                                </>
                            }

                        </span>
                    } else {
                        show = <span>{record.unit_weight}{unitData}</span>
                    }


                    return (
                        <div>{show}</div>
                    )

                }
            },
            {
                title: '总体积(立方米)',
                dataIndex: 'volume',
            },
            {
                title: '体积费率(元/立方米)',
                render: (text, record, index) => {
                    let show
                    if (status == 5 || status == 6) {
                        show = <span>
                            {record.isVolumeCostRate == 1 &&
                                <>
                                    <a>{record.volume_cost_rate}</a>
                                    <EditTwoTone onClick={() => this.isShowinput(index, 'volume_cost_rate')} />
                                </>
                            }

                            {record.isVolumeCostRate == 2 &&
                                <>
                                    <Input name='volume_cost_rate' onChange={(e) => this.changeUnitVolumeInput(e, index)}
                                        value={record.volume_cost_rate} className="w100" onBlur={() => this.isShowinput(index, 'volume_cost_rate')} />
                                </>
                            }

                        </span>
                    } else {
                        show = <span>{record.volume_cost_rate}</span>
                    }

                    return (
                        <div>{show}</div>
                    )

                },
            },
            {
                title: '总重量(公斤)',
                dataIndex: 'weight',
            },

            {
                title: '重量费率(元/公斤)',
                render: (text, record, index) => {
                    let show
                    if (status == 5 || status == 6) {
                        show = <span>
                            {record.isWeightCostRate == 1 &&
                                <>
                                    <a>{record.weight_cost_rate}</a>
                                    <EditTwoTone onClick={() => this.isShowinput(index, 'weight_cost_rate')} />
                                </>
                            }

                            {record.isWeightCostRate == 2 &&
                                <>
                                    <Input name='weight_cost_rate' onChange={(e) => this.changeUnitVolumeInput(e, index)}
                                        value={record.weight_cost_rate} className="w100" onBlur={() => this.isShowinput(index, 'weight_cost_rate')} />
                                </>
                            }

                        </span>
                    } else {
                        show = <span>{record.weight_cost_rate}</span>
                    }

                    return (
                        <div>{show}</div>
                    )

                },

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


        // 底部核价
        const columnsNuclearPrice = [
            {
                title: '询价数量',
                render: (text, record) => (
                    <div>
                        <span>{record.quantity}{record.unit}</span>
                    </div>
                ),
            },
            {
                title: '总计成本(元)',
                render: (text, record, index) => {
                    let show
                    if ((status == 5 || status == 6) && record.source_attribute == 1) {
                        show = <div>
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
                    } else {
                        show = <div>{record.total_cost}</div>
                    }

                    return (
                        <div>
                            {show}
                        </div>
                    )

                }
            },
            {
                title: '单位成本(元/计数单位)',
                render: (text, record) => (
                    <div>
                        <span>{record.unit_cost}(元/{record.unit})</span>
                    </div>
                ),
            },

            {
                title: '核价价格(元)',
                dataIndex: 'total_quote',
            },
            {
                title: '含税单价(元/计数单位)',
                render: (text, record) => (
                    <div>
                        <span>{record.unit_quote}(元/{record.unit})</span>
                    </div>
                ),
            }
        ]

        if (source_attribute != 1) {
            columnsNuclearPrice.splice(1, 0, {
                title: '外购成本',
                dataIndex: 'total_cost',
            })
        }

        // 主料第二个表格
        const columnsCalculateProcessList = [
            {
                title: '工艺名称',
                dataIndex: 'name',
            },
            {
                title: 'PN',
                dataIndex: 'pn',
            },
            {
                title: 'CN',
                dataIndex: 'cn',
            },
            {
                title: 'SK',
                dataIndex: 'sk',
            },
            {
                title: 'SM',
                dataIndex: 'sm',
            },
            {
                title: 'IN',
                dataIndex: 'in',
            },
            {
                title: 'ON',
                dataIndex: 'on',
            },
            {
                title: 'TK',
                dataIndex: 'tk',
            },
            {
                title: 'Gm',
                dataIndex: 'gm',
            },
            {
                title: 'Bm',
                dataIndex: 'bm',
            },
            {
                title: 'Jm',
                dataIndex: 'jm',
            },
            {
                title: 'Wm',
                dataIndex: 'wm',
            },
            {
                title: 'IP',
                dataIndex: 'ip',
            },
            {
                title: 'OP',
                dataIndex: 'op',
            },
            {
                title: 'PR',
                dataIndex: 'pr',
            },
        ]
        // 模具
        const showMould = [
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
                title: '物料用量(计数单位)',
                dataIndex: '',
                render: (text, record, index) => {
                    let show
                    if (status == 5 || status == 6) {
                        show = <div>
                            {record.isShowCountingQuantity == 1 &&
                                <>
                                    <a>{record.usage_counting_quantity}</a>
                                    <EditTwoTone onClick={() => this.editReservedQuantity('usage_counting_quantity', 5, index)} />
                                </>
                            }
                            {record.isShowCountingQuantity == 2 &&
                                <>
                                    <Input value={record.usage_counting_quantity} className="w100" name="usage_counting_quantity"
                                        onChange={(event) => this.editReservedQuantityInput(event, index)} onBlur={() => this.editReservedQuantity('usage_counting_quantity', 5, index)} />
                                </>
                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.usage_counting_quantity}</span>
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
                title: '物料用量(计量单位)',
                render: (text, record, index) => {
                    let show = <span>{record.measurement_counting_conversion_value * record.usage_counting_quantity}</span>
                    return (
                        <div>
                            {show}
                        </div>
                    )

                },
            },
            {
                title: '单位成本(元)',
                render: (text, record, index) => {
                    let show
                    if ((status == 5 || status == 6) && record.unit_measure_cost == 0) {
                        show = <div>
                            {record.isUnitMeasureCost == 1 &&
                                <>
                                    <a>{record.unit_measure_cost}</a>
                                    <EditTwoTone onClick={() => this.editReservedQuantity('unit_measure_cost', 5, index)} />
                                </>
                            }
                            {record.isUnitMeasureCost == 2 &&
                                <>
                                    <Input value={record.unit_measure_cost} className="w100" name='unit_measure_cost'
                                        onChange={(event) => this.editReservedQuantityInput(event, index)}
                                        onBlur={() => this.editReservedQuantity('unit_measure_cost', 4, index)} />
                                </>
                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.unit_measure_cost}</span>
                        </>
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                },
            },
            {
                title: '模具成本(元)',
                dataIndex: 'measure_cost',
            },
        ]

        // 辅料
        const showAccessories = [
            {
                title: '辅料名称',
                width: 100,
                dataIndex: 'name',
            },
            {
                title: '辅料说明',
                dataIndex: 'remark',
            },
            {
                title: '物料编号',
                dataIndex: 'show_sku_number',
            },
            {
                title: '物料名称',
                width: 150,
                dataIndex: 'material_name',
            },
            {
                title: '物料特性',
                width: 150,
                dataIndex: 'character',
            },
            {
                title: '物料规格',
                width: 120,
                dataIndex: 'specification',
            },
            {
                title: '计量单位',
                width: 70,
                dataIndex: 'measurement_unit',
            },
            {
                title: '单位用量(计量单位)',
                width: 100,
                dataIndex: 'unit_consumption',
            },
            {
                title: '理论用量',
                render: (text, record, index) => {
                    let show
                    if (status == 5 || status == 6) {
                        show = <div>
                            {record.isShowExcipientsTheoryMeasureQuantity == 1 &&
                                <>
                                    <a>{record.theory_measure_quantity}</a>
                                    <EditTwoTone onClick={() => this.editReservedQuantity('theory_measure_quantity', 4, index)} />
                                </>
                            }
                            {record.isShowExcipientsTheoryMeasureQuantity == 2 &&
                                <>
                                    <Input value={record.theory_measure_quantity} className="w100" name='theory_measure_quantity'
                                        onChange={(event) => this.editReservedQuantityInput(event, index)}
                                        onBlur={() => this.editReservedQuantity('theory_measure_quantity', 4, index)} />
                                </>
                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.theory_measure_quantity}</span>
                        </>
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                },

            },
            {
                title: '放数',
                render: (text, record, index) => {
                    let show
                    if (status == 5 || status == 6) {
                        show = <div>
                            {record.isShowReservedQuantity == 1 &&
                                <>
                                    <a>{record.reserved}</a>
                                    <EditTwoTone onClick={() => this.editReservedQuantity('reserved', 4, index)} />
                                </>
                            }
                            {record.isShowReservedQuantity == 2 &&
                                <>
                                    <Input value={record.reserved} className="w100" name='reserved'
                                        onChange={(event) => this.editReservedQuantityInput(event, index)}
                                        onBlur={() => this.editReservedQuantity('reserved', 4, index)} />
                                </>
                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.reserved}</span>
                        </>
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                },
            },
            {
                title: '辅料用量 ',
                dataIndex: 'usage_measure_quantity',
            },
            {
                title: '单位成本',
                render: (text, record, index) => {
                    let show
                    if ((status == 5 || status == 6) && record.unit_measure_cost == 0) {
                        show = <div>
                            {record.isUnitMeasureCost == 1 &&
                                <>
                                    <a>{record.unit_measure_cost}</a>
                                    <EditTwoTone onClick={() => this.editReservedQuantity('unit_measure_cost', 4, index)} />
                                </>
                            }
                            {record.isUnitMeasureCost == 2 &&
                                <>
                                    <Input value={record.unit_measure_cost} className="w100" name='unit_measure_cost'
                                        onChange={(event) => this.editReservedQuantityInput(event, index)}
                                        onBlur={() => this.editReservedQuantity('unit_measure_cost', 4, index)} />
                                </>
                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.unit_measure_cost}</span>
                        </>
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                },


            },
            {
                title: '辅料成本',
                width: 70,
                dataIndex: 'measure_cost',
            },
            {
                title: '损耗量',
                width: 80,
                dataIndex: 'loss_quantity',
            },
        ]
        // 准备时长
        let standardPrepareTime
        if ((status == 5 || status == 6) && showListData.flag == 1) {
            standardPrepareTime = <>
                {isStandardPrepareTime == 1 &&
                    <>
                        {showListData.standard_prepare_time}
                        < EditTwoTone onClick={() => this.changeFormatQutity('standard_prepare_time')} />
                    </>

                }
                {isStandardPrepareTime == 2 &&
                    <>
                        <Input className="w200" name='standard_prepare_time' value={showListData.standard_prepare_time} onChange={this.isUnitFormatQuantity}
                            onBlur={() => this.changeFormatQutity('standard_prepare_time')} />
                    </>

                }

            </>

        } else {
            standardPrepareTime = <>
                {showListData.standard_prepare_time}
            </>
        }
        // 效能：
        let standardEfficiency
        if ((status == 5 || status == 6) && showListData.flag == 1) {
            standardEfficiency = <>
                {isStandardEfficiency == 1 &&
                    <>
                        {showListData.standard_efficiency}
                        < EditTwoTone onClick={() => this.changeFormatQutity('standard_efficiency')} />
                    </>

                }
                {isStandardEfficiency == 2 &&
                    <>
                        <Input className="w200" name='standard_efficiency' value={showListData.standard_efficiency} onChange={this.changeFormatQutityInput}
                            onBlur={() => this.changeFormatQutity('standard_efficiency')} />
                    </>

                }

            </>

        } else {
            standardEfficiency = <>
                {showListData.standard_efficiency}
            </>
        }
        // if showListData.flag==1
        let impositionSettings = [
            {
                title: '版数',
                dataIndex: 'format_quantity',
                render: (text, record, index) => {
                    let show
                    if (status == 5 || status == 6) {
                        show = <div>
                            {record.isShowformatQuantity == 1 &&
                                <>
                                    {record.format_quantity}
                                    <EditTwoTone onClick={() => this.changeArtificialInput(index, 'format_quantity')} />
                                </>

                            }
                            {record.isShowformatQuantity == 2 &&
                                <>
                                    <Input className="w100" name='format_quantity' value={record.format_quantity} onChange={this.changeFormatQutityInput}
                                        onBlur={() => this.changeArtificialInput(index, 'format_quantity')} />
                                </>

                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.format_quantity}</span>
                        </>
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                },
            },
            {
                title: '每版份数',
                dataIndex: 'unit_format_quantity',
                render: (text, record, index) => {
                    let show
                    if (status == 5 || status == 6) {
                        show = <div>
                            {record.isUnitFormatQuantity == 1 &&
                                <>
                                    {record.unit_format_quantity}
                                    <EditTwoTone onClick={() => this.changeArtificialInput(index, 'unit_format_quantity')} />
                                </>

                            }
                            {record.isUnitFormatQuantity == 2 &&
                                <>
                                    <Input className="w100" name='unit_format_quantity' value={record.unit_format_quantity} onChange={this.changeFormatQutityInput}
                                        onBlur={() => this.changeArtificialInput(index, 'unit_format_quantity')} />
                                </>

                            }
                        </div>
                    } else {
                        show = <>
                            <span>{record.unit_format_quantity}</span>
                        </>
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                },
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
                title: '制造工时成本(元)',
                dataIndex: 'process_cost',
            },

        ]

        // 其他工艺
        const otherCrafts = [
            {
                title: '加工数量',
                dataIndex: 'process_hour',
                render: (text, record) => {
                    let show
                    show = <>
                        {record.process_quantity}{record.component_unit}
                    </>
                    return (
                        <div>
                            {show}
                        </div>
                    )
                }
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
                title: '制造工时成本(元)',
                dataIndex: 'process_cost',
            },
        ]

        // 组件工艺
        const componentProcess = [
            {
                title: '加工数量',
                dataIndex: 'process_hour',
                render: (text, record) => {
                    let show
                    show = <>
                        {record.process_quantity}{record.product_counting_unit}
                    </>
                    return (
                        <div>
                            {show}
                        </div>
                    )
                }
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
                title: '制造工时成本(元)',
                dataIndex: 'process_cost',
            },
        ]

        // 拉线工艺
        const line = [
            {
                title: '加工数量',
                dataIndex: 'process_hour',
                render: (text, record) => {
                    let show
                    show = <>
                        {record.process_quantity}{record.component_unit}
                    </>
                    return (
                        <div>
                            {show}
                        </div>
                    )
                }
            },
            {
                title: '加工时长(小时)',
                dataIndex: 'process_hour',
            },
            {
                title: '费率(元/小时)',
                render: (text, record, index) => {
                    let show = <span>{record.total_rate}</span>


                    // if (status == 5 || status == 6) {
                    //     show = <div>
                    //         {record.isShowTotalRate == 1 &&
                    //             <>
                    //                 {record.total_rate}
                    //                 <EditTwoTone onClick={() => this.changeArtificialInput(index, 'total_rate')} />
                    //             </>

                    //         }
                    //         {record.isShowTotalRate == 2 &&
                    //             <>
                    //                 <Input className="w100" name='total_rate' value={record.total_rate} onChange={this.changeFormatQutityInput}
                    //                     onBlur={() => this.changeArtificialInput(index, 'total_rate')} />
                    //             </>

                    //         }
                    //     </div>
                    // } else {
                    //     show = <>
                    //         <span>{record.total_rate}</span>
                    //     </>
                    // }


                    return (
                        <div>
                            {show}
                        </div>
                    )

                },

                dataIndex: 'total_rate',
            },
            {
                title: '制造工时成本(元)',
                dataIndex: 'process_cost',
            },
        ]

        const UOM_crafts = [
            {
                title: '加工数量',
                dataIndex: 'process_hour',
                render: (text, record) => {
                    let show
                    show = <>
                        {record.process_quantity}{record.uom_unit}
                    </>
                    return (
                        <div>
                            {show}
                        </div>
                    )
                }
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
                title: '制造工时成本(元)',
                dataIndex: 'process_cost',
            },
        ]

        const packageCrafts = [
            {
                title: '加工数量',
                dataIndex: 'process_hour',
                render: (text, record) => {
                    let show
                    show = <>
                        {record.process_quantity}{record.product_counting_unit}
                    </>
                    return (
                        <div>
                            {show}
                        </div>
                    )
                }
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
                title: '制造工时成本(元)',
                dataIndex: 'process_cost',
            },
        ]


        // 理论数量
        let theoryMeasureQuantity
        if (status == 5 || status == 6) {
            theoryMeasureQuantity = <>
                {
                    isShowTheoryMeasureQuantity == 1 &&
                    <span>
                        {showListData.theory_measure_quantity}
                        <EditTwoTone onClick={() => this.changeIsShowUsageCountingQuantity('theory_measure_quantity')} />
                    </span>
                }
                {
                    isShowTheoryMeasureQuantity == 2 &&
                    <span>
                        <Input name='theory_measure_quantity' className='w100' onChange={this.changeQuantityInput}
                            onBlur={() => this.changeIsShowUsageCountingQuantity('theory_measure_quantity')} value={showListData.theory_measure_quantity} />
                    </span>
                }
            </>
        } else {
            theoryMeasureQuantity = <span>{showListData.theory_measure_quantity}</span>
        }
        // 损耗数量
        let lossQuantity
        if (status == 5 || status == 6) {
            lossQuantity = <>
                {
                    isShowLossQuantity == 1 &&
                    <span>
                        {showListData.loss_quantity}
                        <EditTwoTone onClick={() => this.changeIsShowUsageCountingQuantity('loss_quantity')} />
                    </span>
                }
                {
                    isShowLossQuantity == 2 &&
                    <span>
                        <Input name='loss_quantity' className='w100' onChange={this.changeQuantityInput}
                            onBlur={() => this.changeIsShowUsageCountingQuantity('loss_quantity')} value={showListData.loss_quantity} />
                    </span>
                }
            </>
        } else {
            lossQuantity = <span>
                {showListData.loss_quantity}
            </span>
        }

        // 用料数量
        let usageMeasureQuantity

        if (status == 5 || status == 6) {
            usageMeasureQuantity = <>
                {
                    isShowUsageCountingQuantity == 1 &&
                    <span>
                        {showListData.usage_measure_quantity}
                        <EditTwoTone onClick={() => this.changeIsShowUsageCountingQuantity('usage_measure_quantity')} />
                    </span>
                }
                {
                    isShowUsageCountingQuantity == 2 &&
                    <span>
                        <Input name='usage_measure_quantity' className='w100' onChange={this.changeQuantityInput}
                            onBlur={() => this.changeIsShowUsageCountingQuantity('usage_measure_quantity')} value={showListData.usage_measure_quantity} />
                    </span>
                }
            </>
        } else {
            usageMeasureQuantity = <span>
                {showListData.usage_measure_quantity}
            </span>
        }


        let unitMeasureCost

        if ((status == 5 || status == 6) && showListData.unit_measure_cost == 0) {
            unitMeasureCost = <>
                {
                    isUnitMeasureCost == 1 &&
                    <span>
                        {showListData.unit_measure_cost}
                        <EditTwoTone onClick={() => this.changeIsShowUsageCountingQuantity('unit_measure_cost')} />
                    </span>
                }
                {
                    isUnitMeasureCost == 2 &&
                    <span>
                        <Input name='unit_measure_cost' className='w100' onChange={this.changeQuantityInput}
                            onBlur={() => this.changeIsShowUsageCountingQuantity('unit_measure_cost')} value={showListData.unit_measure_cost} />
                    </span>
                }
            </>
        } else {
            unitMeasureCost = <span>
                {showListData.unit_measure_cost}
            </span>
        }

        // 委外
        const columnsOutsource = [
            {
                title: '工艺名称',
                dataIndex: 'name',
            },
            {
                title: '计数单位',
                dataIndex: 'counting_unit',
            },
            {
                title: '委外数量',
                dataIndex: 'process_quantity',
            },
            {
                title: '辅料',
                render: (text, record) => {
                    let show
                    if (record.supplementary_list.length != 0) {
                        record.supplementary_list.forEach(e => {
                            show = <>
                                <span>{e.comsumable_name}</span>
                            </>
                        })
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                }
            },
            {
                title: '模具',
                render: (text, record) => {
                    let show
                    if (record.mold_list.length != 0) {
                        record.mold_list.forEach(e => {
                            show = <>
                                <span>{e.settings_tech_mould_name}</span>
                            </>
                        })
                    }
                    return (
                        <div>
                            {show}
                        </div>
                    )

                }
            },
            {
                title: '委外单位成本(元/产品单位)',
                render: (text, record, index) => {
                    let show

                    if (status == 5 || status == 6) {
                        show = <>
                            {record.unitMeasureCost == 1 &&
                                <span>
                                    {record.unit_measure_cost}
                                    {record.supplementary_list.length > 0 &&
                                        record.supplementary_list.map(e => (
                                            <span key={e.id}>{e.unit}</span>
                                        ))

                                    }
                                    <EditTwoTone onClick={() => this.onChangeTotalRate(record)} />
                                </span>
                            }

                            {record.unitMeasureCost == 2 &&
                                <span>
                                    <Input className='w100' name='unit_measure_cost' value={record.unit_measure_cost}
                                        onChange={(event) => this.changeUnitMeasureCost(event, index)} onBlur={() => this.onChangeTotalRate(record)} />
                                </span>
                            }

                        </>
                    } else {
                        show = <>
                            <span>{record.unit_measure_cost}
                                {record.supplementary_list.length > 0 &&
                                    record.supplementary_list.map(e => (
                                        <span key={e.id}>{e.unit}</span>
                                    ))

                                }</span>
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
                title: '委外总成本(元)',
                dataIndex: 'measure_cost',
            },
        ]



        let ingredient_list_name = []


        if (showListData.ingredient_list && showListData.ingredient_list.length > 0 && showListData.ingredient_list[0].filter_condition_list.length != 0) {
            showListData.ingredient_list.forEach(e => {
                e.filter_condition_list.forEach(i => {
                    ingredient_list_name.push(i)
                })
            })

        }


        return (
            <div className="fs" >

                {/* 树 */}
                {showData.product.source_attribute == 1 &&
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
                                                                <CategoryAndMaterial parent={component}></CategoryAndMaterial>
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
                                                                    <Tooltip placement="topLeft" title={pre.name}>
                                                                        <span>{pre.name}</span>
                                                                    </Tooltip>
                                                                </div>
                                                            </Tag>
                                                            <ul>
                                                                {
                                                                    pre.material_list.map((material, s) => (
                                                                        <li style={{ display: 'none' }} className="parent_li" key={s}>
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

                                                                <CategoryAndMaterial parent={pre}></CategoryAndMaterial>
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
                                                            <CategoryAndMaterial parent={combination}></CategoryAndMaterial>
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
                                                            <CategoryAndMaterial parent={product}></CategoryAndMaterial>
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
                                                            </ul>
                                                        </li >
                                                    ))
                                                }


                                                {item.packing_list.map((packingUnit, pu) => (
                                                    <li className="parent_li" key={pu}>
                                                        <Tag size="purple" onClick={this.tree}>
                                                            <div className="dib wEllipsis">
                                                                <span>{packingUnit.name}</span>
                                                            </div>
                                                        </Tag>
                                                        <ul>
                                                            {
                                                                packingUnit.packing_unit_list.map((packing, p) => (


                                                                    <li style={{ display: 'none' }} className="parent_li" key={p}>
                                                                        <Tag color="pink" onClick={this.tree}>
                                                                            <div className="dib wEllipsis">
                                                                                <span>{p + 1}级:{packing.name}</span>
                                                                            </div>
                                                                        </Tag>

                                                                        <ul>

                                                                            {packing.tech_list.map((pTech, pt) => (
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
                                                    </li>
                                                ))
                                                }

                                            </ul >
                                        </li >
                                    ))

                                }

                            </ul >
                        </div >
                    </div >
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
                                        {showData.product.source_attribute == 1 &&
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
                                            <Table rowKey={record => record.key} columns={columnsOutsource} dataSource={techOutsourcingList}
                                                bordered title={() => '委外合计（元）'} pagination={false} />
                                        </div>

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
                        <div className='fs mb-15'>
                            <div className='mr-15'>
                                <span className='lh-32'> 管理费率：</span>
                                <Input className='w200' name='manage_rate' disabled={rateInput} value={showData.manage_rate} addonAfter="%" onChange={this.onchangeNuclearPriceinput} onBlur={this.saveIt} />
                            </div>
                            <div className='mr-15' >
                                <span className='lh-32'> 毛利率：</span>
                                <Input className='w200' name='gross_margin_rate' disabled={rateInput} value={showData.gross_margin_rate} addonAfter="%" onChange={this.onchangeNuclearPriceinput} onBlur={this.saveIt} />
                            </div>
                            <div className='mr-15'>
                                <span className='lh-32'>产品税率：</span>
                                <Input className='w200' name='tax_rate' disabled={rateInput} value={showData.tax_rate} addonAfter="%" onChange={this.onchangeNuclearPriceinput} onBlur={this.saveIt} />
                            </div>
                        </div>
                        <Table rowKey={record => record.id} bordered style={{ marginBottom: '50PX' }} columns={columnsNuclearPrice} dataSource={nuclearPricelist} pagination={false} />
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                            <span style={{ lineHeight: '32px' }}>
                                核价有效期：
                            </span>
                            <Input onChange={this.changeDay} style={{ width: '300px' }} placeholder="请输入有效期数" value={showData.valid_period_day} addonAfter="天" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {flagIsShowCommit == 2 &&
                                <>
                                    <Button style={{ marginLeft: '20px' }} type="primary" danger onClick={this.backBOM}>退回BOM</Button>
                                    <Button style={{ marginLeft: '20px' }} type="primary" onClick={this.commitIt}>提交</Button>
                                </>

                            }
                        </div>
                    </div>
                </div>
                {/* 弹出框 */}
                {/* 主料成本 */}
                <div>
                    <Modal title="主料成本" visible={isVisibleIngredientsMaterial} onOk={this.handleOkIngredientsMaterial}
                        onCancel={this.handleCancelIngredientsMaterial} cancelText="取消" okText="确定" width="1400px">
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
                                    <div className="w300">理论数量({showListData.counting_unit})(不含损耗)：{theoryMeasureQuantity}</div>
                                    <div className="w300">损耗数量({showListData.counting_unit})：{lossQuantity}</div   >
                                    <div className="w300">用料数量({showListData.counting_unit})：{showListData.usage_counting_quantity}</div>
                                    <div className="w300">用料数量({showListData.measurement_unit})：{usageMeasureQuantity} </div>
                                </div>

                                <div className="fs mb-15">
                                    <div className="w300">单位成本(元/{showListData.measurement_unit})：{unitMeasureCost}</div>
                                    <div className="w300">主料成本(元)：{showListData.measure_cost}</div>
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
                        onCancel={this.handleCancelAccessoriesCost} cancelText="取消" okText="确定" width="1400px">
                        <div>
                            {showListData.record_type == 2 &&
                                <div className='mb-15'>
                                    <Table bordered rowKey={record => record.keyIndex} columns={showAccessories} title={() => '辅料'} dataSource={showAccessoriesList} pagination={false} />
                                </div>

                            }
                            {showListData.record_type == 3 &&
                                <div className='mb-15'>
                                    <Table bordered rowKey={record => record.keyIndex} columns={showMould} title={() => '模具'} dataSource={showAccessoriesList} pagination={false} />
                                </div>
                            }
                        </div>
                    </Modal>
                </div >
                {/* 制造及人工成
                 */}
                < div >
                    <Modal title="制造及人工成本" visible={isVisibleArtificialCost} onOk={this.handleOkArtificialCost}
                        onCancel={this.handleCancelArtificialCost} destroyOnClose={true} cancelText="取消" okText="确定" width="1000px">
                        {/* 子件数量>1 */}
                        {/* <h3>工艺：{showListData.name}/{showListData.type_desc}</h3>
                        <div className='fs mb-15'>
                            <h3 style={{ marginRight: 70 }}>产品名称：{showListData.product_name}</h3>
                            <h3 className='w200'>询价数量：{showListData.product_quantity}{showListData.product_counting_unit}</h3>
                        </div> */}


                        {/* 子件工艺 */}
                        {showListData.component_type == 2 &&
                            <>
                                <div className="fs mb-15">
                                    <div className="w300 fs">工件名称：
                                        <span className='ellipsis-line d w200'>
                                            <Tooltip placement="topLeft" title={showListData.component_name + '（' + showListData.format_name + '）'}>
                                                {showListData.component_name}（{showListData.format_name}）
                                            </Tooltip>
                                        </span>
                                    </div>
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
                                    <div className="w300">主料筛选条件：
                                        {ingredient_list_name.length > 0 &&
                                            ingredient_list_name.map((e, index) => (
                                                <span style={{ display: 'lineBlock' }} key={index}>
                                                    {e.name}({e.value})

                                                    {ingredient_list_name.length != index + 1 &&
                                                        <span> ，</span>
                                                    }
                                                </span>
                                            ))
                                        }
                                    </div>
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                    <div className="w300">工艺面：{showListData.tech_side}</div>
                                </div>

                                <div className="fs mb-15">
                                    <div className="w300">加工机型：{showListData.settings_machine_name}</div>
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                    <div className="w300">计数单位：{showListData.counting_unit}</div>

                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">模数：{showListData.modulus}</div>
                                    <div className="w300">准备时长：{standardPrepareTime}（小时）</div>
                                    <div className="w300">效能：{standardEfficiency}（{showListData.counting_unit} /小时）</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">进料开数：{showListData.open_number}</div>
                                </div>
                            </>
                        }

                        {/* 为拼版 大于1  */}
                        {showListData.flag == 1 &&
                            <div>
                                <Table bordered rowKey={record => record.keyIndex} columns={impositionSettings} dataSource={showAccessoriesList} pagination={false} />
                            </div>
                        }

                        {/* 等于1其他工艺 */}
                        {showListData.flag == 3 &&
                            <div>
                                <div>
                                    <Table bordered rowKey={record => record.keyIndex} columns={otherCrafts} dataSource={showAccessoriesList} pagination={false} />
                                </div>
                            </div>
                        }
                        {/* 组件工艺 */}
                        {showListData.flag == 4 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300 fs">工件名称：
                                        <span className='ellipsis-line d w200'>
                                            <Tooltip placement="topLeft" title={showListData.component_name + '（' + showListData.format_name + '）'}>
                                                {showListData.component_name}（{showListData.format_name}）
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                    <div className="w300">加工机型：{showListData.settings_machine_name}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                    <div className="w300">计数单位：{showListData.counting_unit}</div>
                                    <div className="w300">准备时长(小时)：{showListData.standard_prepare_time}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">效能：{showListData.standard_efficiency}（{showListData.counting_unit}/小时）</div>
                                </div>
                                <div className="fs mb-15">
                                    <Table style={{ width: '100%' }} bordered rowKey={record => record.keyIndex} columns={componentProcess} dataSource={showAccessoriesList} pagination={false} />
                                </div>
                            </div>
                        }
                        {/* 拉线工艺 */}
                        {showListData.type == 6 &&
                            <div>
                                <div className="fs mb-15">
                                    <div className="w300 fs">工件名称：
                                        <span className='ellipsis-line d w200'>
                                            <Tooltip placement="topLeft" title={showListData.component_name + '（' + showListData.format_name + '）'}>
                                                {showListData.component_name}（{showListData.format_name}）
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className="w300">工艺名称：{showListData.tech_name}</div>
                                    <div className="w300">计数方式：{showListData.counting_method_desc}</div>
                                </div>
                                <div className="fs mb-15">
                                    <div className="w300">计数单位：{showListData.counting_unit}</div>
                                    <div className="w300">UPPH：{showListData.upph}</div>
                                </div>
                                <div>
                                    <Table bordered rowKey={record => record.keyIndex} columns={line} dataSource={showAccessoriesList} pagination={false} />
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
                                    <div className="w300">准备时长：{showListData.standard_prepare_time} （小时）</div>
                                    <div className="w300">效能：{showListData.tech_side} （{showListData.uom_unit}/小时）</div>
                                </div>
                                <div>
                                    <Table bordered rowKey={record => record.keyIndex} columns={UOM_crafts} dataSource={showAccessoriesList} pagination={false} />
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
                                    <div className="w300">准备时长：{showListData.standard_prepare_time} （小时）</div>
                                    <div className="w300">加工时长：{showListData.process_hour} （小时）</div>
                                    <div className="w300">效能：{showListData.standard_efficiency} （{showListData.product_counting_unit}/小时）</div>
                                </div>
                                <div>
                                    <Table bordered rowKey={record => record.keyIndex} columns={packageCrafts} dataSource={showAccessoriesList} pagination={false} />
                                </div>
                            </div>
                        }
                    </Modal>
                </div >

                <div>
                    <Modal
                        title="退回"
                        visible={visibleBack}
                        onOk={this.handleOkBack}
                        onCancel={this.handleCancelBack}
                        cancelText="取消" okText="确定"
                        width={800}
                    >
                        <div>
                            <div className='fs mb-15'>
                                <div>
                                    <span style={{ width: 70, display: 'block' }}>
                                        退回说明：
                                    </span>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <TextArea value={description} onChange={this.onChangeDescription} rows={3} />
                                </div>

                            </div>
                            <div style={{ marginLeft: 70 }} >注：该操作将退回至BOM配置阶段，已填写的核价信息将被清除。该操作不可逆，请谨慎进行！</div>
                        </div>


                    </Modal>

                </div>
            </div >
        );
    }
}

export default index;
