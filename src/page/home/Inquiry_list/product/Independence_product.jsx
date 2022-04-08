import React, { Component } from 'react';
import { Select, Input, Button, message, Checkbox, Radio, InputNumber, Upload } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import http from '../../../../http/index'
import api from '../../../../http/httpApiName'
import common from '../../../common/common';
import '../../index.css'

class Independence_product extends Component {
    state = {
        fList: [],
        company_id: '',
        inquiry_order_id: '',
        // 询价参数数组
        numArr: [],
        // 页面传过来的id
        pageId: '',
        editId: '',
        toEdit: '',
        // 询价选项列表
        inquiryList: [],
        // 输入框的值
        inputData: {
            name: '',
            specification: '',
            unit: '',
            customer_number: '',
            sample_number: '',
            custom_attribute: '',
            attaches: []
        },
        // // 包装数据
        packList: [
            {
                name: '',
                capacity_type: '',
                capacity_value: '',
                level: 1,
                unit_name: '',
                pack_material: {
                    id: ''
                },

            }
        ],
        singData: [],
        multipleData: [],
        // 材质数据
        material: [],
        fileList: [],
        uploading: false,
        orderProId: '',
        isShowUploadList: true,
    }
    componentDidMount() {
        let aData = common.common.getQueryVariable('id')
        let eData = common.common.getQueryVariable('pid')
        if (aData) {
            this.setState({ pageId: aData })
            this.getInquiryList()
            let company_id = common.common.getQueryVariable('company_id')
            this.setState({ company_id })
        }
        if (eData) {
            this.setState({ editId: eData })
            this.getshowData(eData)
        }

        this.getMaterialList()
    }

    getshowData(id) {
        http.get(api.productGet, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data
                let company_id = res.data.company_id

                if (data.pack_units.length == 0) {
                    data.pack_units.push(
                        {
                            level: 1,
                            pack_material: {
                                id: ''
                            }
                        }
                    )
                }
                data.pack_units.forEach((j, index) => {
                    if (index == 0) {
                        j.unit_name = data.unit + '/' + j.name
                    } else {
                        j.unit_name = data.pack_units[index - 1].name + '/' + j.name
                    }
                })
                this.setState(
                    {
                        inputData: data,
                        numArr: data.quantities,
                        packList: data.pack_units,
                        toEdit: data.inquiry_order_id,
                        orderProId: data.id,
                        isShowUploadList: false,
                        company_id: company_id
                    }
                );
                this.getInquiryList()
            } else {
                message.warning(res.message);
            }
        })
    }
    // 获取询价选项设置
    getInquiryList() {
        http.get('inquiry/param/list?is_usage=1').then(res => {
            if (res.code == 1) {
                let { inputData } = this.state
                let data = res.data.items
                data.forEach(e => {
                    e.checked = false
                    if (typeof inputData.options != 'undefined') {
                        inputData.options.forEach(i => {
                            if (i.inquiry_param_id == e.id) {
                                e.valueData = i.id
                                e.checked = true
                                e.options.forEach(j => {
                                    if (e.is_usage) {
                                        if (i.id == j.id) {
                                            j.checked = true
                                            j.changeRemark = i.pivot.remark
                                        }
                                    } else {
                                        j.checked = false
                                        if (i.id == j.id) {
                                            j.checked = true
                                        }
                                    }

                                })

                            }
                        })
                    } else {
                        if (e.options.length != 0) {
                            e.options.forEach(j => {
                                j.checked = false
                            })
                        }
                    }
                })
                this.setState(
                    {
                        inquiryList: data,
                        inquiry_order_id: data.inquiry_order_id
                    }
                )
            } else {
                message.warning(res.message);
            }
        })
    }
    // 获取材质选项
    getMaterialList() {
        http.get(api.packingList).then(res => {
            if (res.code == 1) {
                let data = res.data.items
                this.setState({ material: data })
            } else {
                message.warning(res.message);
            }
        })
    }
    addNum() {
        const { numArr } = this.state
        numArr.push(
            {
                quantity: ''
            }
        )
        this.setState({ numArr })
    }
    cutNum = (index) => {
        const { numArr } = this.state
        numArr.splice(index, 1)
        this.setState({ numArr })
    }
    // 单选 
    onChangeSing = (event, index) => {
        const { inquiryList } = this.state
        inquiryList.forEach((item, index2) => {
            if (index == index2) {
                item.options.forEach(i => {
                    i.checked = false
                    if (i.id == event.target.value) {
                        item.valueData = event.target.value
                        item.checked = event.target.checked
                        i.checked = event.target.checked
                    }

                })
            }
        })
        this.setState({ inquiryList })
    }
    // 多选框
    onChangeMultiple = (event, index, index1) => {
        const { inquiryList } = this.state
        inquiryList.forEach((item, index2) => {
            if (index == index2) {
                item.options.forEach((j, index3) => {
                    if (index1 == index3) {
                        j.checked = event.target.checked
                        item.checked = event.target.checked
                    }
                })
            }

        })
        this.setState({ inquiryList })
    }
    // 改变输入框的内容
    chengInput = (e) => {
        let { inputData } = this.state
        inputData[e.target.name] = e.target.value
        this.setState(inputData)
    }
    // 改变下拉框
    handleChangeCustom = (value) => {
        let { inputData } = this.state
        inputData.custom_attribute = value
        this.setState({ inputData })

    }
    // 改变询价数量
    changProductNum = (e, index) => {
        let { numArr } = this.state
        numArr.forEach((i, index1) => {
            if (index == index1) {
                i.quantity = e
            }
        })
        this.setState({ numArr })
    }
    // 添加产品
    addProduct = (data) => {
        const { packList } = this.state
        packList.push(
            {
                name: '',
                capacity_type: '',
                capacity_value: '',
                level: data + 1,
                pack_material: {
                    id: ''
                }
            }
        )
        this.setState({ packList })
    }
    packData = (index) => {
        const { packList } = this.state
        packList.splice(index, 1)
        this.setState({ packList })
    }
    // 获取底部输入框数据
    changePackageInput = (event, index) => {
        let { packList, inputData } = this.state
        packList.forEach((e, index1) => {
            if (index == index1) {
                e[event.target.name] = event.target.value
                if (index == 0) {
                    e.unit_name = inputData.unit + '/' + e.name
                } else {
                    e.unit_name = packList[index - 1].name + '/' + e.name
                }
            }
        })
        this.setState({ packList })
    }
    // 获取底部下拉框的数据
    changePackageSelect = (event, index) => {
        let { packList } = this.state
        packList.forEach((e, index1) => {
            if (index == index1) {
                e.capacity_type = event
            }
        })
        this.setState({ packList })
    }
    changePackageMaterialSelect = (event, index) => {
        let { packList } = this.state
        packList.forEach((e, index1) => {
            if (index == index1) {
                e.pack_material_id = event

            }
        })
        this.setState({ packList })
    }
    // 上传
    onChangeUpload = (info) => {
        const { company_id, fList, editId } = this.state
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
                let editUplaodData = res.data
                let data = res.data
                data.filename = info.file.name
                fList.push(res.data)
                this.setState({
                    fList
                });
                if (editId != '') {
                    this.editUpload(editUplaodData, info.file)
                }
            } else {
                message.warning(res.message);
            }
        })
    }
    // 编辑上传
    editUpload = (data, file) => {
        const { editId, orderProId } = this.state
        let params = {
            file_id: data.file_id,
            storage_location: data.location,
            filename: file.name,
            inquiry_order_product_id: orderProId,
            quotation_order_id: 0,
        }
        http.post(api.attachUpload, params).then(res => {
            if (res.code == 1) {
                message.success('上传成功')
                this.getshowData(editId)
            } else {
                message.warning(res.message)
            }
        })

    }
    // 添加编辑保存 
    saveAddProduct = (id) => {
        const { pageId, fList, inputData, numArr, inquiryList, packList, toEdit } = this.state
        let sing = []
        console.log('inquiryList: ', inquiryList);
        let flagIsQuiry = false
        inquiryList.forEach(e => {
            e.data = []
            if (e.is_required && !e.checked) {
                flagIsQuiry = true
            }

            if (e.checked) {
                e.options.forEach(i => {
                    if (i.checked) {
                        if (i.has_remark) {
                            e.data.push(
                                {
                                    id: i.id,
                                    name: i.name,
                                    remark: i.remark
                                }
                            )
                        } else {
                            e.data.push(
                                {
                                    id: i.id,
                                    name: i.name,
                                }
                            )
                        }
                    }
                })
                sing.push(
                    {
                        id: e.id,
                        options: e.data
                    }

                )
            }
        })


        let unitList = []
        let flag = false
        packList.forEach((i, index) => {
            if (i.name == undefined || i.name == '' || i.capacity_type == '' || i.pack_material_id == undefined) {
                flag = true
            } else {
                unitList.push(
                    {
                        name: i.name,
                        capacity_type: i.capacity_type,
                        capacity_value: i.capacity_value,
                        level: Number(index + 1),
                        pack_material: {
                            id: i.pack_material_id
                        }
                    }
                )
            }
        })
        let numArrData = []
        numArr.forEach(j => {
            if (j.quantity != '') {
                numArrData.push(
                    {
                        quantity: j.quantity
                    }
                )
            }

        })


        let params = {
            name: inputData.name,
            unit: inputData.unit,
            specification: inputData.specification,
            customer_number: inputData.customer_number,
            sample_number: inputData.sample_number,
            custom_attribute: inputData.custom_attribute,
            quantities: numArrData,
            params: sing,
            pack_units: unitList,

        }

        console.log('params: ', params);
        if (params.name == '') {
            message.warning('请输入产品名称')
            return
        } else if (params.specification == '') {
            message.warning('请输入产品规格')
            return
        } else if (params.unit == '') {
            message.warning('请输入产品单位')
            return
        } else if (params.quantities.length == 0) {
            message.warning('请输入询价数量')
            return
        } else if (params.params.length == 0) {
            message.warning('请选择询价选项')
            return
        } else if (flag) {
            message.warning('请填写包装单位必填字段');
            return
        } else if (flagIsQuiry) {
            message.warning('请勾选必填项 ');
            return
        }


        let history = this.props.history
        let _id
        let url
        if (typeof id === 'undefined') {
            params.inquiry_order_id = Number(pageId),
                _id = pageId
            url = api.productCreate
            params.attaches = fList
        } else {
            params.inquiry_order_id = Number(toEdit),
                _id = toEdit
            url = api.productUpdate
            params.id = Number(id)
        }

        http.post(url, params).then(res => {
            if (res.code == 1) {
                if (typeof id === 'undefined') {
                    message.success('添加成功');
                } else {
                    message.success('编辑成功');
                }
                setTimeout(() => {
                    common.pathData.getPathData(
                        {
                            path: '/addList?id=' + _id,
                            data: {
                                id: _id,
                                type: 1,
                            },
                            history: history
                        }
                    )
                }, 500);


            } else {
                message.warning(res.data.message);
            }
        })

    }
    // 删除文件
    deleteUpload = (id) => {
        const { editId } = this.state
        http.get(api.attachDelete, {
            params: {
                id: id
            }
        }).then(res => {
            if (res.code == 1) {
                message.success('删除成功')
                this.getshowData(editId)
            } else {
                message.warning(res.datamessage)
            }
        })
    }
    // 下载文件
    getDownloadUrl = (id, storage_location) => {
        common.downFile.down(id, storage_location)
    }
    onchangeRemarkInput = (e, index, index1) => {
        const { inquiryList } = this.state
        console.log('inquiryList: ', inquiryList);
        inquiryList[index].options[index1].remark = e.target.value
        inquiryList[index].options[index1].changeRemark = e.target.value
        this.setState({ inquiryList })

    }

    // 返回页面
    backPage = (id) => {
        const { pageId, toEdit } = this.state
        if (typeof id === 'undefined') {
            id = Number(pageId)
        } else {
            id = toEdit
        }
        let history = this.props.history
        common.pathData.getPathData(
            {
                path: '/addList?id=' + id,
                data: {
                    id: id,
                    type: 2,

                },
                history: history
            }
        )
    }


    render() {
        const { numArr, inquiryList, packList, material, inputData, pageId, editId, isShowUploadList } = this.state
        const Option = Select.Option;
        if (numArr.length == 0) {
            numArr.push(
                {
                    quantity: ''
                }
            )
        }

        if (packList.length == 0) {
            packList.push(
                {
                    name: '',
                    capacity_type: '',
                    capacity_value: '',
                    level: 1,
                    unit_name: '',
                    pack_material: {
                        id: ''
                    },

                }
            )
        }

        const capacityType = [
            {
                id: 1,
                name: '固定数量'
            },
            {
                id: 2,
                name: '工程定义'
            }
        ]
        const customAttribute = [
            {
                id: 1,
                name: '定制产品'
            },
            {
                id: 2,
                name: '标准产品'
            },

        ]


        const props = {
            beforeUpload: file => {
                return false;
            },
            onChange: this.onChangeUpload,
        }

        return (
            <div className="page" >
                <div className="min-block">
                    <div className="flxe-i">
                        <div className="mr-30">
                            <span className='w80'><span className='c-red'>*</span> 产品名称：</span>
                            <Input onChange={this.chengInput} name="name" value={inputData.name} style={{ width: 200 }} placeholder="请输入产品名称" />
                        </div>
                        <div className="mr-30">
                            <span className='w80'><span className='c-red'>*</span> 产品规格：</span>

                            <Input style={{ width: 200 }} onChange={this.chengInput} name="specification" value={inputData.specification} placeholder="请输入产品规格" />
                        </div>
                        <div className="mr-30">
                            <span className='w80'><span className='c-red'>*</span> 产品单位：</span>
                            <Input style={{ width: 200 }} onChange={this.chengInput} name="unit" value={inputData.unit} placeholder="请输入产品单位" />
                        </div>

                    </div>
                    <div className="flxe-i mt-15">
                        <div className="mr-30">
                            <span className='w80'>定制属性：</span>
                            <Select style={{ width: 200 }} placeholder="请选择" onChange={this.handleChangeCustom} value={inputData.custom_attribute}>
                                {inputData.custom_attribute}
                                {
                                    customAttribute.map(e => (
                                        <Option value={e.id} key={e.id}>{e.name}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="mr-30">
                            <span className='w80'>样品编号：</span>
                            <Input style={{ width: 200 }} onChange={this.chengInput} name="sample_number" value={inputData.sample_number} defaultValue={inputData.sample_number} placeholder="请输入样品编号" />
                        </div>
                        <div className="mr-30">
                            <span className='w80'>客户料号：</span>
                            <Input style={{ width: 200 }} onChange={this.chengInput} name="customer_number" value={inputData.customer_number} placeholder="请输入客户产品编号" />
                        </div>
                    </div>
                    <div className="mt-15">
                        <div className="flxe-i">
                            <div className="flxe-i" style={{ marginRight: 44 }}>
                                <div>
                                    <span className='w80' style={{ lineHeight: '32px' }}><span className='c-red'>*</span> 询价数量：</span>
                                </div>
                                <div>
                                    {numArr.map((e, index) => (
                                        <div key={index} className="mb-15">
                                            <InputNumber onChange={(e) => this.changProductNum(e, index)} value={e.quantity} style={{ width: 200 }} placeholder="请输入询价数量" />
                                            <MinusCircleOutlined onClick={() => this.cutNum(index)} style={{ fontSize: '20px', marginLeft: '20px' }} />
                                            {index == numArr.length - 1 &&
                                                < span >
                                                    <PlusCircleOutlined onClick={() => this.addNum()} style={{ fontSize: '20px', marginLeft: '15px' }} />
                                                </span>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="mr-30">
                                    <div className='fs'>
                                        <div className='lh-32'>产品附件：</div>
                                        <div className='fs'>
                                            <Upload multiple={true} {...props} showUploadList={isShowUploadList}>
                                                <Button icon={<UploadOutlined />}>上传文件</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                    {inputData.attaches.length != 0 &&
                                        inputData.attaches.map(f => (
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
                        <div className="mr-30">
                            <div className='lh-32' style={{ width: '100px' }}>
                                <span className='c-red'>*</span> 询价选项：
                            </div>
                            <div style={{ marginLeft: '30px' }}>
                                {
                                    inquiryList.map((e, index) => {
                                        if (e.is_single_choice) {
                                            return (
                                                <div style={{ display: 'flex', marginBottom: '15px', flexWrap: 'wrap' }} key={index}>
                                                    <div className="inquiry  lh-32">
                                                        {e.is_required &&
                                                            <span className='c-red'>*</span>
                                                        }{e.name} ：
                                                    </div>
                                                    <div className='flxe-i'>
                                                        <Radio.Group onChange={(e) => this.onChangeSing(e, index)} value={e.valueData}>
                                                            {
                                                                e.options.map((i, index1) => (
                                                                    <Radio key={index1} value={i.id}>
                                                                        <div style={{ marginRight: '30px' }}>
                                                                            <span className='lh-32'>{i.name}</span>
                                                                            {i.has_remark &&
                                                                                <>
                                                                                    <Input value={i.changeRemark} placeholder={'请输入' + i.remark} className='w300 ml-5' onChange={(e) => this.onchangeRemarkInput(e, index, index1)} />
                                                                                </>
                                                                            }
                                                                        </div>
                                                                    </Radio>
                                                                ))
                                                            }
                                                        </Radio.Group>
                                                    </div>
                                                </div>
                                            )

                                        } else {
                                            return (
                                                <div className="inquiry-block" key={index}>
                                                    <span className="inquiry lh-32">
                                                        {e.is_required &&
                                                            <span className='c-red'>*</span>
                                                        } {e.name} ：
                                                    </span>
                                                    {
                                                        e.options.map((i, index1) => (
                                                            <Checkbox key={index1} onChange={(event) => this.onChangeMultiple(event, index, index1)} checked={i.checked} className='mb-15'>
                                                                <div style={{ marginRight: '30px' }} >
                                                                    <span className='lh-32'>{i.name}</span>
                                                                    {i.has_remark &&
                                                                        <>
                                                                            <Input value={i.changeRemark} placeholder={'请输入' + i.remark} className='w300 ml-5' onChange={(e) => this.onchangeRemarkInput(e, index, index1)} />
                                                                        </>
                                                                    }
                                                                </div>
                                                            </Checkbox>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </div>
                <div className="min-block mt-15">
                    <div>
                        <span className='w80'>产品包装：</span>
                        <Button onClick={() => this.addProduct(packList.length)} type="primary">添加</Button>
                    </div>
                    {packList.map((e, index) => (
                        <div key={index} className="package-block">
                            <div className="flxe-i">
                                <div className="mr-30">
                                    <span><span className='c-red'>*</span> {e.level}级包装单位：</span>
                                    <Input value={e.name} onChange={(event) => this.changePackageInput(event, index)} name='name' className="w200" placeholder="请输入包装单位" />
                                </div>
                                <div className="mr-30">
                                    <span><span className='c-red'>*</span> 包装材质：</span>
                                    <Select style={{ width: 200 }} onChange={(event) => this.changePackageMaterialSelect(event, index)} value={e.pack_material_id}>
                                        {
                                            material.map(i => (
                                                <Option key={i.id} value={i.id}>{i.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <div className="mr-30">
                                    <span><span className='c-red'>*</span> 包装容量：</span>
                                    <Select style={{ width: 200 }} placeholder="请选择" onChange={(event) => this.changePackageSelect(event, index)} value={e.capacity_type}>
                                        {
                                            capacityType.map(j => (
                                                <Option key={j.id} value={j.id}>{j.name}</Option>
                                            ))
                                        }
                                    </Select>
                                    {e.capacity_type == 1 &&
                                        <Input onChange={(event) => this.changePackageInput(event, index)} name='capacity_value'
                                            value={e.capacity_value} style={{ marginLeft: '20px' }} className="w200" placeholder="请输入数量" addonAfter={e.unit_name} />
                                    }
                                </div>

                                <a onClick={() => this.packData(index)} style={{ marginLeft: '100px', color: 'red', lineHeight: '32px' }}>删除</a>
                            </div>
                        </div>
                    ))

                    }

                </div>
                <div className="min-block">
                    <div className="footer-flex">
                        {pageId != '' &&
                            <div className='foot-fs'>
                                <Button type="primary" size='large' onClick={() => this.backPage()}>返回</Button>
                                <Button type="primary" size='large' onClick={() => this.saveAddProduct()}>保存</Button>
                            </div>
                        }
                        {editId != '' &&
                            <div className='foot-fs'>
                                <Button type="primary" size='large' onClick={() => this.backPage(editId)}>返回</Button>
                                <Button type="primary" size='large' onClick={() => this.saveAddProduct(editId)}>保存</Button>
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }
}

export default Independence_product;