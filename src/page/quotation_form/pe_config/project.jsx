import React, { Component } from 'react';
import { Table, Button, message, Input, Tabs, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import common from '../../../../public/common'
import http from '../../../http'
import api from '../../../http/httpApiName'
class project extends Component {
    state = {
        pageId: '',
        productId: '',
        showData: {
            product: {
                attaches: []
            },
            attaches: []
        },
        company_id: '',
        columns: [
            {
                title: '产品编号',
                dataIndex: 'name',
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
                dataIndex: 'uom_unit',
            },
            {
                title: '包装单位',
                dataIndex: 'package_unit',
            },
        ],
        list: []

    }

    componentDidMount() {
        let data = common.common.getQueryVariable('id')
        if (data) {
            this.getData(data)
        }

        this.setState({ pageId: data })
    }

    getData(id) {
        http.get('/bom/order/get?id=' + id).then(res => {
            if (res.code == 1) {
                let company_id = res.data.company_id
                let data = res.data
                let productId = res.data.product.id
                let list = []
                list.push(res.data.product)
                this.setState({
                    showData: data,
                    list,
                    company_id,
                    productId
                })
            } else {
                message.warning(res.message)
            }
        })
    }


    // 上传
    onChangeUpload = (info, type) => {
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
                this.saveUpload(data, type)
            } else {
                message.warning(res.message)
            }
        })
    }


    saveUpload = (data, type) => {
        const { pageId, productId } = this.state
        let params = {
            filename: data.filename,
            file_id: data.file_id,
            storage_location: data.location,
        }
        if (type == 1) {
            params.inquiry_order_product_id = Number(productId)
            // 客户文件
        } else if (type == 2) {
            params.work_order_id = Number(pageId)
            //工程文件
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

    getDownloadUrl = (id, storage_location) => {
        common.downFile.down(id, storage_location)
    }
    deleteUpload = (id) => {
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

    onChangeProjectRemarkvalue = (e) => {
        const { showData } = this.state
        showData.project_remark = e.target.value
        this.setState({ showData })
    }

    commitBomProject = () => {
        const { showData, pageId } = this.state
        let params = {
            id: Number(pageId),
            project_remark: showData.project_remark
        }
        http.post(api.bomProject, params).then(res => {
            if (res.code == 1) {
                message.success('提交成功')
                let history = this.props.history
                setTimeout(() => {
                    common.pathData.getPathData(
                        {
                            path: '/QuotationForm',
                            data: {
                                type: 1
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

    render() {
        const { showData, columns, list } = this.state
        const { TextArea } = Input;
        return (
            <div className='page'>
                <div className='mb-15 fs'>
                    <span className="title-block w300">
                        工单编号：{showData.number}
                    </span>
                    <span className="title-block w300">
                        相关类型：{showData.related_type_desc}
                    </span>
                    <span className="title-block w300">
                        相关单号：{showData.related_number}
                    </span>
                </div>
                <div className='mb-15'>
                    <span className="title-block w300">
                        客户名称：{showData.customer_name}
                    </span>
                    <span className="title-block w300">
                        创建人员：{showData.creator_name}
                    </span>
                    <span className="title-block w300">
                        创建时间：{showData.created_at}
                    </span>
                </div>
                <div className='mb-15'>
                    <Table columns={columns} dataSource={list} rowKey={record => record.id} pagination={false} />
                </div>

                <div className='mb-15'>
                    <div className='w500 mb-15'>
                        <div className="mr-30">
                            <div className='fs'>
                                <div className='lh-32'>客户文件：</div>
                                <div className='fs'>
                                    <Upload multiple={true} {...{
                                        beforeUpload: file => {
                                            return false;
                                        },
                                        onChange: (e) => this.onChangeUpload(e, 1),
                                    }} showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>上传文件</Button>
                                    </Upload>
                                </div>
                            </div>
                            {showData.product.attaches.length != 0 &&
                                showData.product.attaches.map(f => (
                                    <div key={f.id} className='upload-class'>
                                        <div className='fs-bw'>
                                            <a style={{ marginLeft: 10 }} onClick={() => this.getDownloadUrl(f.file_id, f.storage_location)}>{f.filename}</a>
                                            <DeleteOutlined style={{ color: 'red', marginLeft: 50, marginRight: 20, marginTop: 5 }} onClick={() => this.deleteUpload(f.id)} />
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className='w500'>
                        <div className="mr-30">
                            <div className='fs'>
                                <div className='lh-32'>工程文件：</div>
                                <div className='fs'>
                                    <Upload multiple={true} {...{
                                        beforeUpload: file => {
                                            return false;
                                        },
                                        onChange: (e) => this.onChangeUpload(e, 2),
                                    }} showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>上传文件</Button>
                                    </Upload>
                                </div>
                            </div>
                            {showData.attaches.length != 0 &&
                                showData.attaches.map(f => (
                                    <div key={f.id} className='upload-class'>
                                        <div className='fs-bw'>
                                            <a style={{ marginLeft: 10 }} onClick={() => this.getDownloadUrl(f.file_id, f.storage_location)}>{f.filename}</a>
                                            <DeleteOutlined style={{ color: 'red', marginLeft: 50, marginRight: 20, marginTop: 5 }} onClick={() => this.deleteUpload(f.id)} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='fs'>
                    <div>
                        <span style={{ width: 70, display: 'block' }}>
                            工程备注：
                        </span>
                    </div>
                    <div style={{ width: '100%' }}>
                        <TextArea value={showData.project_remark} onChange={this.onChangeProjectRemarkvalue} rows={4} style={{ width: '70%' }} />
                    </div>
                </div>
                <div className="min-block">
                    <div className='footer-flex'>
                        <Button type="primary" onClick={this.commitBomProject}>提交</Button>
                    </div>
                </div>
            </div >
        );
    }
}

export default project;