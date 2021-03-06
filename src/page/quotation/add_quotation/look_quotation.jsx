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
            message.warning('???????????????????????????????????????')
            return
        }

        http.get(api.orderConfrim, {
            params: {
                id: pageId
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('????????????')
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
    // ??????
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
                message.success('????????????')
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
                message.success('????????????')
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
            message.warning('?????????????????????')
            return
        }
        let history = this.props.history
        http.post('/quote/order/return/check', params).then(res => {
            if (res.code == 1) {
                message.success('????????????')
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
            message.warning('?????????????????????')
            return
        }
        let history = this.props.history
        http.post('/quote/order/return/bom', params).then(res => {
            if (res.code == 1) {
                message.success('????????????')
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
                title: '????????????',
                dataIndex: 'name',
            },
            {
                title: '????????????',
                dataIndex: 'number',
            },
            {
                title: '????????????',
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
                        list[key].child = name.join('???')
                        data.push(list[key])
                    }


                    return (
                        <div>
                            {
                                data.map((e, index) => (
                                    <div key={index}>
                                        {e.name}???{e.child}???
                                    </div>
                                ))
                            }
                        </div>
                    )

                },
            },
            {
                title: '????????????',
                dataIndex: 'specification',
            },
            {
                title: '????????????',
                dataIndex: 'unit',
            },
            {
                title: '????????????',
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
                title: '????????????(???)',
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
                title: '????????????(???)',
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
                title: '??????',
                width: 130,
                render: (text, record) => {
                    let backCheckPrice
                    if ((statusNum != 7 || statusNum != 9) && record.status == 7) {
                        backCheckPrice = <a onClick={() => this.backCheckPricePage(record)} style={{ color: 'red' }}>???????????????</a>
                    } else {
                        backCheckPrice = <a style={{ color: '#ccc' }}>???????????????</a>
                    }
                    let backProject
                    if ((statusNum != 7 || statusNum != 9) && (record.status == 7 && record.source_attribute == 1)) {
                        backProject = <a onClick={() => { this.BackProjectPage(record) }} style={{ color: 'red' }}>??????BOM</a>
                    } else {
                        backProject = <a style={{ color: '#ccc' }}>??????BOM</a>
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
                    <h3 className='db w300 fw'>???????????????{showData.number}</h3>
                    <h3 className='db w300 fw'>?????????{showData.status_desc}</h3>
                </div>
                <div className='fs mb-15'>
                    <span className='db w300'>???????????????{showData.customer_name}</span>
                    <span className='db w300'>????????????{showData.inquiry_order.customer_representative_name}</span>
                    <span className='db w300'>??????????????????{showData.inquiry_order.customer_representative_contact}</span>
                    <span className='db w300'>??????????????????{showData.inquiry_order.customer_representative_email}</span>
                </div>
                <div className='fs mb-15'>
                    <span className='db w300'>???????????????{showTitle.company_name}</span>
                    <span className='db w300'>????????????{showTitle.name}</span>
                    <span className='db w300'>??????????????????{showTitle.mobile}</span>
                    <span className='db w300'>??????????????????{showTitle.email}</span>
                </div>
                <div>
                    <Table
                        columns={columnsPro}
                        dataSource={proList}
                        bordered
                        pagination={false}
                        rowKey={record => record.id}
                        title={() => '??????'}
                    />
                </div>

                <div>
                    <div style={{ marginTop: 20 }}>
                        <span>?????????</span>
                    </div>
                    <div>1.???????????????RMB???????????????</div>
                    <div className='fs'>2.??????????????????
                        <div className='check-day'>
                            <span>{checkDay} </span>
                        </div>
                        <span style={{ display: 'inline-block', marginTop: '2px' }}>??????</span>
                    </div>
                    <div>3.???????????????{showData.inquiry_order.settlement_instr}</div>
                    <div>4.??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</div>
                </div>
                <div className='mt-15'>
                    <div>
                        <div style={{ fontSize: 16, fontWeigt: 600 }} className='fs'>?????????????????????
                            <div>
                                {showData.status == 10 &&
                                    <Upload multiple={true} {...props} showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>????????????</Button>
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
                            ??????
                        </Button>
                    </div>

                }

                <Modal title="???????????????"
                    visible={isModalVisibleBackCheckPrice}
                    onOk={this.handleOkBackCheckPrice}
                    onCancel={this.handleCancelBackCheckPrice}
                    cancelText='??????'
                    okText='??????'
                    width={'600px'}
                >
                    <div>
                        <div className='mb-15'>
                            ???????????????{BackCheckPriceData.name}
                        </div>
                        <div className='fs'>
                            <div style={{ width: 90 }}>???????????????</div>
                            <TextArea
                                value={BackCheckPriceData.return_reason}
                                placeholder="?????????????????????"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                onChange={this.onChangeBackCheckPriceInput}
                            />
                        </div>
                        <p style={{ marginLeft: '75px', marginTop: '15px' }}>?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????BOM?????????????????????????????????</p>
                    </div>
                </Modal>

                <Modal title="??????BOM"
                    visible={isModalVisibleBackProject}
                    onOk={this.handleOkBackProject}
                    onCancel={this.handleCancelBackProject}
                    cancelText='??????'
                    okText='??????'
                    width={'600px'}
                >
                    <div>
                        <div className='mb-15'>
                            ???????????????{BackProjectData.name}
                        </div>
                        <div className='fs'>
                            <div style={{ width: 90 }}>???????????????</div>
                            <TextArea
                                value={BackProjectData.return_reason}
                                placeholder="?????????????????????"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                onChange={this.onChangeBackProjectInput}
                            />
                        </div>
                        <p style={{ marginLeft: '75px', marginTop: '15px' }}>????????????BOM????????????????????????????????????????????????????????????????????????BOM????????????????????????????????????????????????BOM???????????????????????????????????????????????????????????????BOM??????????????????BOM???????????????</p>
                    </div>
                </Modal>


            </div >
        );
    }
}

export default look_quotation;