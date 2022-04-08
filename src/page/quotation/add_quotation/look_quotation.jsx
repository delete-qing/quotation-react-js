import React, { Component } from 'react';
import { Table, Button, message, Input, Upload, Modal } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import common from '../../common/common'
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
        proList: [],
        company_id: '',
        checkDay: 0,
        showTitle: {},
        isModalVisibleBackCheckPrice: false,
        BackCheckPriceData: {
            name: '',
            return_reason: '',
            product_id: '',
        },
        isModalVisibleBackProject: false,
        BackProjectData: {
            name: '',
            return_reason: '',
            product_id: '',
        },
        statusNum: '',
    }

    componentDidMount() {
        let id = common.common.getQueryVariable('id')
        let typeId = common.common.getQueryVariable('type')
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
                let statusNum = res.data.status
                console.log('statusNum: ', statusNum);
                this.getQuotationOrder(data.inquiry_order_id)
                this.getCheckData(id)
                this.getTitleValue(data.pricing_offer_id)
                this.setState({
                    showData: data,
                    company_id: companyId,
                    statusNum
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

    getTitleValue(id) {
        http.get('/pods/admin/get?id=' + id).then(res => {
            if (res.code == 1) {
                let data = res.data
                if (data == null) {
                    data.company_name = ''
                    data.name = ''
                    data.mobile = ''
                    data.email = ''
                }
                this.setState({ showTitle: data })
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
        const { pageId, showData } = this.state
        if (showData.attaches.length == 0) {
            message.warning('客户未上传文件，请上传文件')
            return
        }

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
            storage_location: data.location,
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

    backCheckPricePage = (data) => {

        const { BackCheckPriceData } = this.state
        BackCheckPriceData.name = data.name
        BackCheckPriceData.product_id = data.id
        this.setState({
            isModalVisibleBackCheckPrice: true,
            BackCheckPriceData
        })
    }

    onChangeBackCheckPriceInput = (e) => {
        const { BackCheckPriceData } = this.state
        BackCheckPriceData.return_reason = e.target.value
        this.setState({ BackCheckPriceData })
    }

    handleOkBackCheckPrice = () => {
        const { BackCheckPriceData, pageId } = this.state
        let params = {
            id: parseInt(pageId),
            product_id: BackCheckPriceData.product_id,
            return_reason: BackCheckPriceData.return_reason
        }
        if (params.return_reason == "") {
            message.warning('请输入退回原因')
            return
        }
        let history = this.props.history
        http.post('/quote/order/return/check', params).then(res => {
            if (res.code == 1) {
                message.success('退回成功')
                common.pathData.getPathData(
                    {
                        path: '/Quotation',
                        data: {
                            type: 1,
                        },
                        history: history
                    }
                )
            } else {
                message.warning(res.message)
            }
        })


    }

    handleCancelBackCheckPrice = () => {
        this.setState({ isModalVisibleBackCheckPrice: false })
    }

    BackProjectPage = (data) => {
        const { BackProjectData } = this.state
        BackProjectData.name = data.name
        BackProjectData.product_id = data.id

        this.setState({
            isModalVisibleBackProject: true,
            BackProjectData
        })

    }

    onChangeBackProjectInput = (e) => {
        const { BackProjectData } = this.state
        BackProjectData.return_reason = e.target.value
        this.setState({ BackProjectData })
    }

    handleOkBackProject = () => {
        const { BackProjectData, pageId } = this.state
        let params = {
            id: parseInt(pageId),
            product_id: BackProjectData.product_id,
            return_reason: BackProjectData.return_reason
        }
        console.log('params: handleOkBackProject', params);
        if (params.return_reason == "") {
            message.warning('请输入退回原因')
            return
        }
        let history = this.props.history
        http.post('/quote/order/return/bom', params).then(res => {
            if (res.code == 1) {
                message.success('退回成功')
                common.pathData.getPathData(
                    {
                        path: '/Quotation',
                        data: {
                            type: 1,
                        },
                        history: history
                    }
                )
            } else {
                message.warning(res.message)
            }
        })

    }

    handleCancelBackProject = () => {
        this.setState({
            isModalVisibleBackProject: false,
        })
    }

    
    render() {
        const { proList, showData, type, checkDay, showTitle, isModalVisibleBackCheckPrice,
            BackCheckPriceData, isModalVisibleBackProject, BackProjectData, statusNum } = this.state
        const { TextArea } = Input;
        const props = {
            beforeUpload: file => {
                return false;
            },
            onChange: this.onChangeUpload,
        }

        const columnsPro = [
            {
                title: '产品名称',
                dataIndex: 'name',
            },
            {
                title: '产品编号',
                dataIndex: 'number',
            },
            {
                title: '产品说明',
                render: (text, record) => {
                    let show = []
                    record.options.forEach(e => {
                        show.push(
                            {
                                name: e.param.name,
                                pid: e.param.id,
                                child: [
                                    {
                                        name: e.name
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

                },
            },
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
            },
            {
                title: '操作',
                width: 130,
                render: (text, record) => {
                    let backCheckPrice
                    if ((statusNum != 7 || statusNum != 9) && record.status == 7) {
                        backCheckPrice = <a onClick={() => this.backCheckPricePage(record)} style={{ color: 'red' }}>退回核价单</a>
                    } else {
                        backCheckPrice = <a style={{ color: '#ccc' }}>退回核价单</a>
                    }
                    let backProject
                    if ((statusNum != 7 || statusNum != 9) && (record.status == 7 && record.source_attribute == 1)) {
                        backProject = <a onClick={() => { this.BackProjectPage(record) }} style={{ color: 'red' }}>退回BOM</a>
                    } else {
                        backProject = <a style={{ color: '#ccc' }}>退回BOM</a>
                    }
                    return (
                        <div>
                            <div style={{ marginBottom: 5 }}>
                                {backCheckPrice}
                            </div>
                            <div>
                                {backProject}
                            </div>
                        </div>
                    )
                }

            },

        ]
        return (
            <div className='page'>
                <div className='fs mb-15'>
                    <h3 className='db w300 fw'>报价单号：{showData.number}</h3>
                    <h3 className='db w300 fw'>状态：{showData.status_desc}</h3>
                </div>
                <div className='fs mb-15'>
                    <span className='db w300'>询价单位：{showData.customer_name}</span>
                    <span className='db w300'>询价人：{showData.inquiry_order.customer_representative_name}</span>
                    <span className='db w300'>询价人电话：{showData.inquiry_order.customer_representative_contact}</span>
                    <span className='db w300'>询价人邮箱：{showData.inquiry_order.customer_representative_email}</span>
                </div>
                <div className='fs mb-15'>
                    <span className='db w300'>报价单位：{showTitle.company_name}</span>
                    <span className='db w300'>报价人：{showTitle.name}</span>
                    <span className='db w300'>报价人电话：{showTitle.mobile}</span>
                    <span className='db w300'>报价人邮箱：{showTitle.email}</span>
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
                        <span style={{ display: 'inline-block', marginTop: '2px' }}>天；</span>
                    </div>
                    <div>3.付款方式：{showData.inquiry_order.settlement_instr}</div>
                    <div>4.品质标椎：以上报价均按照上述所列出的材料，规格，工艺，订单量及同类产品基本品质要求进行报价，如有任何不一致信息或其他特殊要求，敬请提出，我司将按照贵司更新后的信息重新报价。</div>
                </div>
                <div className='mt-15'>
                    <div>
                        <div style={{ fontSize: 16, fontWeigt: 600 }} className='fs'>客户确认原件：
                            <div>
                                {showData.status == 10 &&
                                    <Upload multiple={true} {...props} showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>上传文件</Button>
                                    </Upload>
                                }
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

                <Modal title="退回核价单"
                    visible={isModalVisibleBackCheckPrice}
                    onOk={this.handleOkBackCheckPrice}
                    onCancel={this.handleCancelBackCheckPrice}
                    cancelText='取消'
                    okText='确认'
                    width={'600px'}
                >
                    <div>
                        <div className='mb-15'>
                            产品名称：{BackCheckPriceData.name}
                        </div>
                        <div className='fs'>
                            <div style={{ width: 90 }}>退回原因：</div>
                            <TextArea
                                value={BackCheckPriceData.return_reason}
                                placeholder="请输入退回原因"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                onChange={this.onChangeBackCheckPriceInput}
                            />
                        </div>
                        <p style={{ marginLeft: '75px', marginTop: '15px' }}>注：退回核价后，报价单状态为【已退回】，询价产品状态为【核价中】，对应核价单状态为【核价中】，对应询价单状态为【核价中】，对应BOM工单状态为【核价中】。</p>
                    </div>
                </Modal>

                <Modal title="退回BOM"
                    visible={isModalVisibleBackProject}
                    onOk={this.handleOkBackProject}
                    onCancel={this.handleCancelBackProject}
                    cancelText='取消'
                    okText='确认'
                    width={'600px'}
                >
                    <div>
                        <div className='mb-15'>
                            产品名称：{BackProjectData.name}
                        </div>
                        <div className='fs'>
                            <div style={{ width: 90 }}>退回原因：</div>
                            <TextArea
                                value={BackProjectData.return_reason}
                                placeholder="请输入退回原因"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                onChange={this.onChangeBackProjectInput}
                            />
                        </div>
                        <p style={{ marginLeft: '75px', marginTop: '15px' }}>注：退回BOM后，报价单状态为【已退回】，询价产品状态为【报价BOM配置中】，对应核价单状态为【报价BOM配置中】，对应询价单状态为【待核价数据】，BOM工单状态为【BOM配置中】。</p>
                    </div>
                </Modal>


            </div >
        );
    }
}

export default look_quotation;