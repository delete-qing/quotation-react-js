import React, { Component } from 'react';
import { message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import http from '../../../../http/index'
import api from '../../../../http/httpApiName'
import common from '../../../common/common';

class look_product extends Component {

    state = {
        pageId: '',
        showData: {
            attaches: [],
            quantities: [],
            options: [],
            pack_units: [],
            show: []
        }
    }

    componentDidMount() {
        let data = common.common.getQueryVariable('id')
        this.setState({ pageId: data })
        if (data) {
            this.getshowData(data)
        }
    }

    getshowData(id) {
        http.get(api.productGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data

                data.pack_units.forEach((e, index) => {
                    if (index) {
                        e.unit_name = data.pack_units[index - 1].name + '/' + e.name
                    } else {
                        e.unit_name = data.unit + '/' + e.name
                    }
                });

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

                console.log('data: ', data);

                this.setState(
                    {
                        showData: data,
                    }
                );
            } else {
                message.warning(res.message);
            }
        })
    }

    // ????????????
    getDownloadUrl = (id, storage_location) => {
        common.downFile.down(id, storage_location)
    }
    // ????????????
    deleteUpload = (id) => {
        const { editId } = this.state
        http.get(api.attachDelete, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('????????????')
                this.getshowData(editId)
            } else {
                message.warning(res.message)
            }
        })
    }

    render() {

        const { showData } = this.state

        return (
            <div className='page'>
                <div>
                    <div className='fs mb-15'>
                        <span className='db w300'>???????????????{showData.name}</span>
                        <span className='db w300'>???????????????{showData.specification}</span>
                        <span className='db w300'>???????????????{showData.unit}</span>
                        <span className='db w300'>???????????????{showData.customer_number}</span>
                    </div>
                    <div className='fs mb-15'>
                        <span className='db w300'>???????????????{showData.source_attribute_desc}</span>
                        <span className='db w300'>???????????????{showData.sample_number}</span>
                        <span className='db w300'>?????????
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
                        </span>
                        <span className='db w300 fs'>???????????????
                            <div>
                                {showData.quantities.length != 0 &&
                                    showData.quantities.map(q => (
                                        <div key={q.id} >
                                            {q.quantity}{q.unit}
                                        </div>
                                    ))
                                }
                            </div>

                        </span>

                    </div>
                    <div className='fs'>
                        <div>
                            ???????????????
                        </div>
                        <div>
                            {showData.show.length != 0 &&
                                showData.show.map((e, index) => (
                                    <div key={index} className='mb-15'>
                                        {e.name}??????{e.child.join('???')}???
                                    </div>
                                ))

                            }
                        </div>
                    </div>
                    <div className='fs'>
                        <div>
                            ???????????????
                        </div>
                        <div>
                            {showData.pack_units.length != 0 &&
                                showData.pack_units.map(e => (
                                    <div key={e.id} className='mb-15'>
                                        {e.level}??????????????????{e.name}??????????????????{e.pack_material.name}??????????????????{e.capacity_type_desc}???
                                        {e.capacity_type == 1 &&
                                            <>
                                                ???????????????{e.capacity_value}{e.unit_name}
                                            </>
                                        }
                                    </div>
                                ))

                            }
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default look_product;