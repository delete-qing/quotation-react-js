import React, { Component } from 'react';
import { Table, message, Tabs, Button, Radio, } from 'antd';
import http from '../../../http'
import api from '../../../http/httpApiName'
import common from '../../common/common'



class analyze extends Component {
    state = {
        pageId: '',
        id: '',
        bom_id: '',
        showData: {
            quantities: [],
            show: []
        },
        checkData: {
            show: {}
        },
        value: 1,
        // 部件
        componentColumns: [
            {
                title: '部件',
                dataIndex: 'component_type_name',
            },
            {
                title: '部件成本（元）',
                dataIndex: 'cost',
            },
            {
                title: '占比成本（%）',
                dataIndex: 'percent',
            },
        ],
        componentTitleList: [],
        componentAnalyzeColumns: [
            {
                title: '部件名称',
                dataIndex: 'component_name',
            },
            {
                title: '成本类别',
                dataIndex: 'cost_category_name',
                // TODO
            },
            {
                title: '明细名称',
                dataIndex: 'name',
            },
            {
                title: '明细成本(元)',
                dataIndex: 'cost',
            },
            {
                title: '明细占比(%)',
                dataIndex: 'percent',
            },
        ],
        // 成本
        costColumns: [
            {
                title: '成本类别',
                dataIndex: 'cost_category_name',
                width: 400
            },
            {
                title: '类别成本（元）',
                dataIndex: 'cost',
            },
            {
                title: '成本占比（%）',
                dataIndex: 'percent',
            },
        ],
        costList: [],

        costAnalyzeColumns: [
            {
                title: '成本类别',
                dataIndex: 'cost_category_name',
            },
            {
                title: '部件名称',
                dataIndex: 'component_name',
            },
            {
                title: '明细名称',
                dataIndex: 'name',
                width: 400
            },
            {
                title: '明细成本(元)',
                dataIndex: 'cost',
            },
            {
                title: '明细占比(%)',
                dataIndex: 'percent',
            },
        ],
        // 综合
        comprehensivColumns: [
            {
                title: '部件',
                dataIndex: 'component_name',
                width: 400
            },
            {
                title: '类别',
                dataIndex: 'cost_category_name',
            },
            {
                title: '成本（元）',
                dataIndex: 'cost',
            },
            {
                title: '成本占比（%）',
                dataIndex: 'percent',
            },
        ],
        comprehensivAnalyzeColumns: [
            {
                title: '部件名称',
                dataIndex: 'component_name',
            },
            {
                title: '成本类别',
                dataIndex: 'cost_category_name',
            },
            {
                title: '明细名称',
                dataIndex: 'name',
                width: 400
            },
            {
                title: '明细成本(元)',
                dataIndex: 'cost',
            },
            {
                title: '明细占比(%)',
                dataIndex: 'percent',
            },
        ],
        list: [],
        quantity: 0,
        token: '',
    }

    componentDidMount() {
        let id = common.common.getQueryVariable('id')
        this.setState({ pageId: id })
        this.getData(id)
        this.getlocation()
    }

    getData(id) {
        http.get(api.checkGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data

                data.show = data.details[0]
                this.setState({
                    checkData: data,
                    id: data.id,
                    bom_id: data.pods_bom_id
                })
                this.getCheckOrderProduct(data.inquiry_order_product_id)
            } else {
                message.warning(res.message)
            }

        })
    }

    // 产品
    getCheckOrderProduct(id) {
        http.get('/inquiry/product/get?id=' + id).then(res => {
            if (res.code == 1) {
                let data = res.data
                data.quantities.forEach(e => {
                    e.name = '核价数量' + e.quantity + e.unit
                })
                let num = data.quantities[0].quantity
                this.getList(num)

                let resultMap = {};
                data.options.forEach(option => {
                    let remark = ''
                    if (option.pivot.remark != '') {
                        remark = '(' + option.pivot.remark + ')'
                    }
                    if (typeof resultMap[option.param.id] === 'undefined') {

                        resultMap[option.param.id] = {
                            name: option.param.name,
                            child: [option.name + remark]
                        }
                    } else {
                        resultMap[option.param.id]['child'].push(option.name + remark)
                    }
                })

                let resutlList = [];
                for (let key in resultMap) {
                    resutlList.push(resultMap[key]);
                }
                data.show = resutlList
                this.setState({ showData: data })
            } else {
                message.warning(res.message);
            }
        })
    }

    // 获取表格、
    callback = (key) => {
        const { showData } = this.state
        let data = showData.quantities
        let num = ''
        data.forEach(e => {
            if (e.id == key) {
                num = e.quantity
            }
        })

        this.getList(num)
        this.setState({ quantity: num })
    }

    getList(num) {
        const { id, bom_id } = this.state
        http.get(api.checkAnalyze, {
            params: {
                id: id,
                bom_id: bom_id,
                quantity: num
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                let dataMap = {}
                let costMap = {}
                data.forEach((e, index) => {
                    e.id = index
                    if (typeof dataMap[e.component_type] == 'undefined') {
                        dataMap[e.component_type] = {
                            component_type_name: e.component_type_name,
                            cost: e.cost,
                            percent: e.percent
                        }


                    } else {
                        dataMap[e.component_type] = {
                            component_type_name: e.component_type_name,
                            cost: e.cost + dataMap[e.component_type].cost,
                            percent: e.percent + dataMap[e.component_type].percent
                        }
                    }
                    if (typeof dataMap[e.cost_category_name] == 'undefined') {
                        costMap[e.cost_category_name] = {
                            cost_category_name: e.cost_category_name,
                            cost: e.cost,
                            percent: e.percent
                        }
                    } else {
                        costMap[e.cost_category_name] = {
                            cost_category_name: e.cost_category_name,
                            cost: e.cost + dataMap[e.cost_category_name].cost,
                            percent: e.percent + dataMap[e.cost_category_name].percent
                        }
                    }
                })

                let dataList = []
                for (let key in dataMap) {
                    dataMap[key]['cost'] = dataMap[key]['cost'].toFixed(4)
                    dataMap[key]['percent'] = dataMap[key]['percent'].toFixed(4)
                    dataList.push(dataMap[key])
                }
                dataList.forEach((e, index) => {
                    e.id = index
                })

                let costList = []
                for (let key in costMap) {
                    costMap[key]['cost'] = costMap[key]['cost'].toFixed(4)
                    costMap[key]['percent'] = costMap[key]['percent'].toFixed(4)
                    costList.push(costMap[key])
                }
                costList.forEach((i, index) => {
                    i.id = index
                })

                this.setState({
                    list: data,
                    componentTitleList: dataList,
                    costList: costList,
                    quantity: num
                })
            } else {
                message.warning(res.message)
            }

        })

    }

    onChange = (e) => {
        this.setState({ value: e.target.value })
    }

    getlocation() {
        let token = ''
        let query = location.search.substring(1)
        let vars = query.split("&")
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=")

            if (pair[0] == 'Authorization') {
                token = pair[1]
            }
        }
        this.setState({ token })
    }

    down = () => {
        const { bom_id, quantity, pageId, token } = this.state
        http.get(import.meta.env.VITE_APP_QUOTATION_HOST + '/check/order/cost/analyze/excel', {
            params: {
                id: Number(pageId),
                bom_id: bom_id,
                quantity: quantity
            },
            headers: {
                'Authorization': token
            },
            responseType: 'blob'
        }).then(res => {
            const blob = new Blob([res.data]);//处理文档流
            const fileName = '成本分析.xlsx';
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
        })
    }

    render() {
        const { showData, checkData, value, componentColumns, componentAnalyzeColumns, costColumns, costAnalyzeColumns,
            comprehensivColumns, comprehensivAnalyzeColumns, componentTitleList, costList, list, } = this.state
        const { TabPane } = Tabs;
        return (
            <div className='page'>
                <div>
                    <div className='mb-15 fs'>
                        <span className="title-block w300">
                            产品名称：{showData.name}
                        </span>

                        <span className="title-block w300">
                            计数单位：{showData.unit}
                        </span>
                        <span className="title-block w300">
                            包装单位：{showData.package_unit}
                        </span>
                    </div>
                    <div className='mb-15 fs'>
                        <span className="title-block w300">
                            物料编号：{showData.show_material_sku_number}
                        </span>
                        <span className="title-block w300">
                            产品规格：{showData.specification}
                        </span>
                        <span className="title-block w300">
                            产品税率：{checkData.show.tax_rate}%
                        </span>

                    </div>
                    <div className='mb-15 fs'>
                        <span className="title-block w300">
                            管理费率：{checkData.show.manage_rate}%
                        </span>
                        <span className="title-block w300">
                            毛利率：{checkData.show.gross_margin_rate}%
                        </span>
                        <span className="title-block w300">
                            核价人员：{checkData.check_price_person_name}
                        </span>
                    </div>
                    <div className='mb-15 fs'>

                        <span className="title-block w300">
                            核价时间：{checkData.check_price_at}
                        </span>
                    </div>
                    <div className='fs'>
                        <span style={{ display: 'block' }}>
                            产品说明：
                        </span>
                        <div>
                            {showData.show.length != 0 &&
                                showData.show.map((e, index) => (
                                    <div key={index} className='mb-15'>
                                        {e.name}：（{e.child.join('，')}）
                                    </div>
                                ))

                            }
                        </div>
                    </div>
                </div>
                <div>
                    <Tabs onChange={this.callback} type="card">
                        {
                            showData.quantities.map(q => (
                                <TabPane key={q.id} tab={q.name}>
                                    <div className='child-color'>
                                        <div className='mb-15 fs'>
                                            <div>
                                                <span className='title'>分析视图：</span>
                                                <Radio.Group onChange={this.onChange} value={value}>
                                                    <Radio value={1}>部件</Radio>
                                                    <Radio value={2}>成本类别</Radio>
                                                    <Radio value={3}>综合</Radio>
                                                </Radio.Group>
                                            </div>

                                            <div>
                                                <a onClick={this.down}>下载</a>
                                            </div>
                                        </div>

                                        {value == 1 &&
                                            <div>
                                                <div className='mb-15' style={{ width: '1200px' }}>
                                                    <Table
                                                        rowKey={record => record.id}
                                                        columns={componentColumns}
                                                        dataSource={componentTitleList}
                                                        bordered
                                                        pagination={false}
                                                        title={() => '部件'}
                                                    />
                                                </div>
                                                <div style={{ width: '1200px' }}>
                                                    <Table
                                                        rowKey={record => record.id}
                                                        columns={componentAnalyzeColumns}
                                                        dataSource={list}
                                                        bordered
                                                        pagination={false}
                                                        title={() => '明细成本分析'}
                                                    />
                                                </div>

                                            </div>
                                        }
                                        {value == 2 &&
                                            <div>
                                                <div className='mb-15' style={{ width: '1200px' }}>
                                                    <Table
                                                        rowKey={record => record.id}
                                                        columns={costColumns}
                                                        dataSource={costList}
                                                        bordered
                                                        pagination={false}
                                                        title={() => '成本'}
                                                    />
                                                </div>
                                                <div style={{ width: '1200px' }}>
                                                    <Table
                                                        rowKey={record => record.id}
                                                        columns={costAnalyzeColumns}
                                                        dataSource={list}
                                                        bordered
                                                        pagination={false}
                                                        title={() => '成本类别视图'}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        {value == 3 &&
                                            <div>
                                                <div className='mb-15' style={{ width: '1200px' }}>
                                                    <Table
                                                        rowKey={record => record.id}
                                                        columns={comprehensivColumns}
                                                        dataSource={list}
                                                        bordered
                                                        pagination={false}
                                                        title={() => '综合'}
                                                    />
                                                </div>
                                                <div style={{ width: '1200px' }}>
                                                    <Table
                                                        rowKey={record => record.id}
                                                        columns={comprehensivAnalyzeColumns}
                                                        dataSource={list}
                                                        bordered
                                                        pagination={false}
                                                        title={() => '明细成本分析'}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </TabPane>
                            ))
                        }
                    </Tabs>
                </div>


            </div >
        );
    }
}

export default analyze;