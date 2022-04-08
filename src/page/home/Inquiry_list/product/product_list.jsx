import React, { Component } from 'react';
import { Table, message, Button, Input, Pagination } from 'antd';
import http from '../../../../http/index'
import api from '../../../../http/httpApiName'
import common from '../../../common/common';


class product_listjsx extends Component {
    state = {
        columns: [
            {
                title: '产品名称',
                dataIndex: 'name',
                render: (text, record) => {
                    let show = <a onClick={() => this.goLookPage(record)}>{record.name}</a>
                    return (
                        <>
                            {show}
                        </>
                    )

                }
            },
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品说明',
                width: 300,
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
                title: '产品规格',
                dataIndex: 'specification',
            },
            {
                title: '计数单位',
                dataIndex: 'unit',
            },
            {
                title: '包装单位',
                dataIndex: 'package_unit',
            },
            {
                title: '客户名称',
                dataIndex: 'customer_name',
            },
            {
                title: '物料编号',
                dataIndex: 'show_material_sku_number',
            },
            {
                title: '来源属性',
                dataIndex: 'source_attribute_desc',
            },
            {
                title: '相关类型',
                dataIndex: 'related_type_desc',
            },
            {
                title: '相关单号',
                dataIndex: 'related_number',
            },
            {
                title: 'BOM任务',
                dataIndex: 'work_order_number',
            },
            {
                title: '核价单号',
                dataIndex: 'check_price_order_number',
            },
            {
                title: '核价有效期',
                dataIndex: 'expire_date',
            },
            {
                title: '状态',
                dataIndex: 'status_desc',
            },
            {
                title: '操作',
                fixed: 'right',
                align: 'center',
                width: 80,
                render: (text, record) => {
                    let show = <a onClick={() => this.goLookPage(record)}>查看</a>
                    return (
                        <>
                            {show}
                        </>
                    )

                }
            },
        ],
        list: [],
        searchData: {
            name: '',
            number: '',
        },
        pagination: {
            total: 0,
            current: 1,
            pageSize: 15,
        },
        pageSizeOptions: [10, 15, 20, 25],

    }

    componentDidMount() {
        this.getList()
    }


    getList() {
        const { searchData, pagination } = this.state
        http.get('/inquiry/product/list', {
            params: {
                name: searchData.name,
                number: searchData.number,
                per_page: pagination.pageSize,
                page: pagination.current,
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                pagination.total = res.data.total
                this.setState({ list: data, pagination })
            } else {
                message.warning(res.message)
            }
        })
    }

    onChangePage = (page, pageSize) => {
        const { pagination } = this.state
        pagination.current = page
        pagination.pageSize = pageSize
        this.setState({ pagination })
        this.getList()
    }
    goLookPage(data) {
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/lookProductPage?id=' + data.id,
                data: {
                    id: data.id,
                    type: 1,

                },
                history: history
            }
        )
    }
    searchPage = (e) => {
        console.log('e: ', e);
        const { searchData } = this.state
        searchData[e.target.name] = e.target.value
        console.log('searchData: ', searchData);
        this.setState({ searchData })

    }

    searchList = () => {
        const { pagination } = this.state
        pagination.current = 1
        this.setState({ pagination })
        this.getList()
    }

    render() {
        const { columns, list, pagination, pageSizeOptions } = this.state
        return (
            <div className='page'>

                <div className='mb-15 fs'>
                    <div className='fs'>
                        <span className='lh-32'>产品名称：</span>
                        <Input name='name' className='w200' placeholder="请输入产品名称" onChange={this.searchPage} />
                    </div>
                    <div className='fs ml-15'>
                        <span className='lh-32'>产品编号：</span>
                        <Input name='number' className='w200' placeholder="请输入产品编号" onChange={this.searchPage} />
                    </div>
                    <Button type="primary" className='ml-20' onClick={this.searchList}>搜索</Button>
                </div>

                <Table rowKey={record => record.id} columns={columns} dataSource={list} scroll={{ x: 3300 }} pagination={false} />
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
                    <Pagination current={pagination.current} total={pagination.total}
                        pageSize={pagination.pageSize} onChange={this.onChangePage} pageSizeOptions={pageSizeOptions} showSizeChanger />
                </div>
            </div>
        );
    }
}

export default product_listjsx;