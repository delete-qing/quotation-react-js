import React, { Component } from 'react'
import { Table, Input, message, Pagination, Checkbox, Button, Select } from 'antd';
import http from '../../../http/index'
import api from '../../../http/httpApiName'
import common from '../../common/common'
import '../packing_material.css'

export default class materials extends Component {
    state = {
        pageId: '',

        materialsList: [],
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
        },
        pageSizeOptions: [5, 10, 15, 20],

        chosenColumnsMaterials: [
            {
                title: '物料名称',
                dataIndex: 'name',
                width: 300,
            },
            {
                title: '物料编号',
                dataIndex: 'show_sku_number',
            },

            {
                title: '物料特性',
                width: 350,
                render: (text, record) => (
                    <div>
                        {record.character_list.map(e => (
                            <span key={e.id}>
                                {e.name}，
                            </span>
                        ))

                        }
                    </div>
                ),
            },
            {
                title: '物料规格',
                width: 250,
                render: (text, record) => (
                    <div>
                        {record.specification_list.map(e => (
                            <span key={e.id} style={{ display: 'block' }}>
                                {e.name}，
                            </span>
                        ))

                        }
                    </div>
                ),
            },
            {
                title: '物料单位',
                dataIndex: 'unit',
            },
            {
                title: '计数单位',
                dataIndex: 'counting_method_unit_text',
            },
            {
                title: '计量单位',
                dataIndex: 'measurement_method_unit_text',
            },
            {
                title: '定制属性',
                dataIndex: 'custom_attributes_text',
            },
            {
                title: '来源属性',
                dataIndex: 'source_attribute_text',
            }
        ],
        chosenMaterialsList: [],
        searchData: {
            name: '',
            number: '',
            source_attribute: '',
        }

    }


    componentDidMount() {
        let data = common.common.getQueryVariable('id')
        this.setState({ pageId: data })
        this.getList()
        this.getToken()
    }
    getToken() {

    }
    getList() {
        const { pagination, searchData } = this.state
        http.get(import.meta.env.VITE_APP_PODS_HOST + api.materialList,
            {
                params: {
                    page: pagination.current,
                    results: pagination.pageSize,
                    name: searchData.name,
                    show_sku_number: searchData.number,
                    op: {
                        custom_attributes: "IN",
                        source_attribute: "IN"
                    },
                    filter: {
                        custom_attributes: "",
                        source_attribute: searchData.source_attribute
                    }

                }
            }).then(res => {
                let data = res.data.data.rows
                data.forEach(e => {
                    e.checked = false
                })
                pagination.total = res.data.data.total
                this.setState({
                    materialsList: data,
                    pagination,
                })
            })
    }
    onChangePage = (page, pageSize) => {
        const { pagination } = this.state
        pagination.current = page
        pagination.pageSize = pageSize
        this.setState({ pagination })
        this.getList()
    }
    onChangeOption = (e, index) => {
        const { materialsList } = this.state
        materialsList.forEach(e => {
            e.checked = false
        })
        materialsList[index].checked = e.target.checked
        let data = []
        if (e.target.checked) {
            data.push(materialsList[index])
        }
        this.setState({
            materialsList,
            chosenMaterialsList: data
        })
    }

    addPro = () => {
        const { pageId, chosenMaterialsList } = this.state
        let specification = []
        let specificationText = ''
        let feature = []
        let featureText = ''
        chosenMaterialsList.forEach(e => {
            e.specification_list.forEach(s => {
                specification.push(s.name)
            })
            e.character_list.forEach(c => {
                feature.push(c.name)
            })
            specificationText = specification.join(',')
            featureText = feature.join(',')

            let params = {
                id: Number(pageId),
                name: e.name,
                sku_number: e.sku_number,
                show_sku_number: e.show_sku_number,
                category: e.type_name,
                specification: specificationText,
                feature: featureText,
                unit: e.unit,
                source_attribute: e.source_attribute,
                custom_attribute: e.custom_attributes,
                counting_unit: e.counting_method_unit_text,
                packingMaterial: e.measurement_method_unit_text,
            }
            http.post(api.bindMaterial, params).then(res => {
                if (res.code == 1) {
                    message.success('绑定成功')
                    let history = this.props.history
                    setTimeout(function () {
                        common.pathData.getPathData(
                            {
                                path: '/packingMaterial',
                                data: {},
                                history: history
                            }
                        )
                    }, 1000)
                } else {
                    message.warning(res.message)
                }
            })
        })
    }
    returnList = () => {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/packingMaterial',
                data: {},
                history: history
            }
        )
    }
    search = () => {
        this.getList()
    }

    changeInput = (e) => {
        const { searchData } = this.state
        searchData[e.target.name] = e.target.value
        this.setState({ searchData })
    }
    selectOption = (value) => {
        const { searchData } = this.state
        searchData.source_attribute = value
        this.setState({ searchData })
    }

    render() {
        const { materialsList, pagination, pageSizeOptions, chosenMaterialsList,
            chosenColumnsMaterials } = this.state
        const { Option } = Select;
        const option = [
            {
                id: 1,
                name: '自制'
            },
            {
                id: 2,
                name: '自制&外购'
            },
            {
                id: 3,
                name: '外购'
            }, {
                id: '',
                name: '全部'
            },
        ]

        const columnsMaterials = [
            {
                title: '物料名称',
                width: 300,
                render: (text, record, index) => (
                    <div>
                        <Checkbox onChange={(e) => this.onChangeOption(e, index)} checked={record.checked}>
                            <a>{record.name}</a>
                        </Checkbox>
                    </div>
                ),
            },
            {
                title: '物料编号',
                dataIndex: 'show_sku_number',
            },
            {
                title: '物料特性',
                width: 350,
                render: (text, record) => (
                    <div>
                        {record.character_list.map(e => (
                            <span key={e.id}>
                                {e.name}，
                            </span>
                        ))

                        }
                    </div>
                ),
            },
            {
                title: '物料规格',
                width: 250,
                render: (text, record) => (
                    <div>
                        {record.specification_list.map(e => (
                            <span key={e.id} style={{ display: 'block' }}>
                                {e.name}，
                            </span>
                        ))

                        }
                    </div>
                ),
            },
            {
                title: '物料单位',
                dataIndex: 'unit',
            },
            {
                title: '计数单位',
                dataIndex: 'counting_method_unit_text',
            },
            {
                title: '计量单位',
                dataIndex: 'measurement_method_unit_text',
            },
            {
                title: '定制属性',
                dataIndex: 'custom_attributes_text',
            },
            {
                title: '来源属性',
                dataIndex: 'source_attribute_text',
            }
        ]
        return (
            <div className="page">
                <div className="fs">
                    <div>
                        <span>物料名称：</span>
                        <Input name='name' onChange={this.changeInput} className="w200 mr-20" placeholder="请输入物料名称" />
                    </div>
                    <div>
                        <span>物料编号：</span>
                        <Input name='number' onChange={this.changeInput} className="w200 mr-20" placeholder="请输入物料名称" />
                    </div>
                    <div>
                        <span>定制属性：</span>
                        <Select style={{ width: 200 }} onChange={this.selectOption}>
                            {option.map(item => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))
                            }
                        </Select>
                    </div>
                    <div className="ml-20">
                        <Button type="primary" className="mr-15" onClick={this.search}>搜索</Button>
                    </div>
                </div>
                <div className="fs mt-15">

                    <Button type="primary" className="mr-15" onClick={this.returnList}>返回列表</Button>
                    <Button type="primary" className="mr-15" onClick={this.addPro}>添加</Button>
                </div>

                {chosenMaterialsList.length != 0 &&
                    <div className="mt-15" style={{ maxHeight: '500px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>已选物料：</div>
                        <Table rowKey={record => record.id} columns={chosenColumnsMaterials} dataSource={chosenMaterialsList} pagination={false} />
                    </div>
                }
                <div className="mt-15">
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>物料列表：</div>
                    <Table rowKey={record => record.id} columns={columnsMaterials} dataSource={materialsList} pagination={false} />
                    <div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
                        <Pagination current={pagination.current} total={pagination.total}
                            pageSize={pagination.pageSize} onChange={this.onChangePage} pageSizeOptions={pageSizeOptions} />
                    </div>
                </div>
            </div >
        )
    }
}
