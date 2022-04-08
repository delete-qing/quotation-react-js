import React, { Component } from 'react';
import { Table, message } from 'antd';
import http from '../../../../http/index'
import api from '../../../../http/httpApiName'
import common from '../../../common/common';



class look_product_page extends Component {
    state = {
        showData: {
            quantities: [],
            show: [],
            attaches: [],
            pack_units: [],
        },
        columns: [
            {
                title: '包装说明',
                render: (text, record) => (
                    <div>
                        {record.pack_units.length != 0 &&
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
                title: 'UOM编号',
                render: (text, record) => {
                    let show = <span style={{ color: 'red' }}>后端，暂无字段</span>
                    return (
                        <>
                            {show}
                        </>
                    )

                }
            },
            {
                title: '生成时间',
                dataIndex: 'created_at',
            },
        ],
        list: []
    }

    componentDidMount() {
        let id = common.common.getQueryVariable('id')
        if (id) {
            this.getData(id)
        }
    }

    getData(id) {
        http.get('/inquiry/product/get?id=' + id).then(res => {
            if (res.code == 1) {
                let data = res.data
                let list = []
                list.push(res.data)
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
                this.setState({ showData: data, list })
            } else {
                message.warning(res.message)
            }
        })
    }

    getDownloadUrl = (id, storage_location) => {
        common.downFile.down(id, storage_location)
    }

    render() {
        const { showData, columns, list } = this.state
        return (
            <div className='page'>
                <div>
                    <div className='mb-15 fs'>
                        <span className="title-block w300">
                            产品名称： {showData.name}
                        </span>
                        <span className="title-block w300">
                            产品规格：{showData.specification}
                        </span>
                        <span className="title-block w300">
                            客户料号：{showData.customer_number}
                        </span>
                        <span className="title-block w300">
                            样品编号：{showData.sample_number}
                        </span>
                    </div>
                    <div className='mb-15 fs'>
                        <span className="title-block w300">
                            产品编号：{showData.number}
                        </span>
                        <span className="title-block w300">
                            产品单位：{showData.unit}
                        </span>
                        <span className="title-block w300">
                            物料编号：{showData.show_material_sku_number}
                        </span>
                        <span className="db fs">
                            询价数量：
                            {
                                showData.quantities.length != 0 &&
                                showData.quantities.map(i => (
                                    <div key={i.id}>
                                        {i.quantity}{i.unit}；
                                    </div>
                                ))
                            }
                        </span>
                    </div>
                    <div className='mb-15'>
                        <span className="title-block w300">
                            来源属性：{showData.source_attribute_desc}
                        </span>
                    </div>
                    <div className='mb-15'>
                        <span className="title-block fs">
                            客户文件：
                            {showData.attaches.length != 0 &&
                                showData.attaches.map(f => (
                                    <div key={f.id} className='db'>
                                        <div className='fs-bw'>
                                            <a style={{ marginLeft: 10 }} onClick={() => this.getDownloadUrl(f.file_id, f.storage_location)}>{f.filename}</a>
                                        </div>
                                    </div>
                                ))
                            }
                        </span>
                    </div>
                    <div className='fs'>
                        <div>
                            产品说明：
                        </div>
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
                    <div style={{ width: 1300 }}>
                        <Table rowKey={record => record.id} bordered columns={columns} dataSource={list} title={() => '产品包装'} pagination={false} />
                    </div>
                </div>
            </div >
        );
    }
}

export default look_product_page;
