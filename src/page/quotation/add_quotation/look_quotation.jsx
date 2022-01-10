import React, { Component } from 'react';
import { Table, Button, Select, message, Input, Upload } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import common from '../../../../public/common'
import http from '../../../http/index'
import api from '../../../http/httpApiName'


class look_quotation extends Component {

    state = {
        pageId: '',
        type: '',
        showData: {
            attaches: [],
            inquiry_order: {}
        },
        columnsPro: [
            {
                title: '产品名称',
                dataIndex: 'name',
            },
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            // {
            //     title: '产品说明',
            //     dataIndex: 'address',
            // },
            {
                title: '产品规格',
                dataIndex: 'specification',
            },
            {
                title: '产品单位',
                dataIndex: 'unit',
            },
            {
                title: '询价数量',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details.length != 0 &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {e.quantity}{e.unit}
                                </div>
                            ))
                        }
                    </div>
                )
            },
            {
                title: '含税单价(元)',
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {e.unit_quote}
                                </div>
                            ))
                        }
                    </div>
                )
            },
            {
                title: '报价金额(元)',
                width: 260,
                render: (text, record) => (
                    <div>
                        {record.check_price_order_details != null &&
                            record.check_price_order_details.map((e, index) => (
                                <div key={index}>
                                    {/* 显示 */}
                                    < div >
                                        <span>
                                            {e.actual_quote}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div >
                )
            }
        ],
        proList: [],
        company_id: '',
        checkDay: 0
    }

    componentDidMount() {
        let id = common.common.getQueryVariable('id')
        let typeId = common.common.getQueryVariable('type')
        console.log('typeId: ', typeId);
        this.setState({
            pageId: id,
            type: typeId
        })

        if (id) {
            this.getData(id)
        }
    }

    getData(id) {
        http.get(api.quoteGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                let companyId = data.company_id
                this.getQuotationOrder(data.inquiry_order_id)
                this.getCheckData(id)
                this.setState({
                    showData: data,
                    company_id: companyId
                })
            } else {
                message.warning(res.message)
            }
        })
    }

    getQuotationOrder(id) {
        http.get(api.productList + id + '/product/list').then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({
                    proList: data
                })
            } else {
                message.warning(res.message)
            }
        })

    }

    getCheckData = (id) => {
        http.get('/quote/order/' + id + '/valid').then(res => {
            if (res.code == 1) {
                this.setState({ checkDay: res.data })
            } else {
                message.warning(res.message)
            }

        })
    }


    confirmQuotition = () => {
        const { pageId } = this.state
        http.get(api.orderConfrim, {
            params: {
                id: pageId
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('确认成功')
                let history = this.props.history
                setTimeout(function () {
                    common.pathData.getPathData(
                        {
                            path: '/Quotation',
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


    // 上传
    onChangeUpload = (info) => {
        const { company_id } = this.state
        const formData = new FormData();
        formData.append('file', info.file);
        formData.append('company_id', company_id);
        http({
            method: "post",
            url: import.meta.env.VITE_FILE_SERVICE_HOST + '/file/upload',
            processData: false,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                console.log('data: ', data);
                data.filename = info.file.name
                this.saveUpload(data)
            } else {
                message.warning(res.message)
            }
        })
    }

    saveUpload = (data) => {
        const { pageId } = this.state
        let params = {
            filename: data.filename,
            file_id: data.file_id,
            storage_location: data.file_path,
            inquiry_order_product_id: 0,
            quotation_order_id: Number(pageId)
        }

        http.post(api.attachUpload, params).then(res => {
            if (res.code == 1) {
                message.success('上传成功')
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    downLoadFile = (id, storage_location) => {
        common.downFile.down(id, storage_location)
    }
    deleteFile = (id) => {
        const { pageId } = this.state
        http.get(api.attachDelete, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('删除成功')
                this.getData(pageId)
            } else {
                message.warning(res.message)
            }
        })
    }
    render() {
        const { columnsPro, proList, showData, type, checkDay } = this.state

        const props = {
            beforeUpload: file => {
                return false;
            },
            onChange: this.onChangeUpload,
        }


        return (
            <div className='page'>
                <div className='fs mb-15'>
                    <h3 className='db w300 fw'>报价单号：{showData.number}</h3>
                    <h3 className='db w300 fw'>状态：{showData.status_desc}</h3>
                </div>
                <div className='fs mb-15'>
                    <span className='db w300'>询价单位：</span>
                    <span className='db w300'>询价人：{showData.inquiry_order.customer_representative_name}</span>
                    <span className='db w300'>电话：{showData.inquiry_order.customer_representative_contact}</span>
                    <span className='db w300'>邮箱：{showData.inquiry_order.customer_representative_email}</span>
                </div>
                <div className='fs mb-15'>
                    <span className='db w300'>报价单位：</span>
                    <span className='db w300'>报价人：{showData.pricing_offer_name}</span>
                    <span className='db w300'>电话：</span>
                    <span className='db w300'>邮箱：</span>
                </div>
                <div>
                    <Table
                        columns={columnsPro}
                        dataSource={proList}
                        bordered
                        pagination={false}
                        rowKey={record => record.id}
                        title={() => '产品'}
                    />
                </div>

                <div>
                    <div style={{ marginTop: 20 }}>
                        <span>备注：</span>
                    </div>
                    <div>1.以上报价为RMB含税价格；</div>
                    <div className='fs'>2.报价有效期为
                        <div className='check-day'>
                            <span>{checkDay} </span>
                        </div>
                        天；
                    </div>
                    <div>3.付款方式：{showData.inquiry_order.settlement_mode_desc}</div>
                    <div>4.品质标椎：以上报价均按照上述所列出的材料，规格，工艺，订单量及同类产品基本品质要求进行报价，如有任何不一致信息或其他特殊要求，敬请提出，我司将按照贵司更新后的信息重新报价。</div>
                </div>
                <div className='mt-15'>
                    <div>
                        <div style={{ fontSize: 16, fontWeigt: 600 }} className='fs'>客户确认原件：
                            <div>
                                <Upload {...props} showUploadList={false}>
                                    <a>上传文件</a>
                                </Upload>
                                <div>
                                    {showData.attaches.length != 0 &&
                                        showData.attaches.map(e => (
                                            <div key={e.id} className='down-w '>
                                                <div className='fs-bw'>
                                                    <a className='db' onClick={() => this.downLoadFile(e.file_id, e.storage_location)}>{e.filename}</a>
                                                    {type != 3 &&
                                                        <DeleteOutlined onClick={() => this.deleteFile(e.id)} style={{ color: 'red', marginLeft: 50, marginRight: 20, marginTop: 5 }} />
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    type == 4 &&
                    <div className='botton-quotation'>
                        <Button type="primary" size='large' onClick={this.confirmQuotition}>
                            确认
                        </Button>
                    </div>

                }
            </div >
        );
    }
}

export default look_quotation;