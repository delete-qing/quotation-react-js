import React, { Component } from "react";
import { Button, Input, Table, Divider, Select, message, Popconfirm, Pagination, DatePicker } from 'antd';
// import PageMenu from '../common/page_menu'
import http from '../../http/index'
import api from "../../http/httpApiName";
import path from '../common/common'
import './index.css'
import axios from "axios";


export default class Hello extends Component {

  state = {
    dataList: [],
    isModalVisible: false,
    columns: [
      {
        title: '询价单号',
        dataIndex: 'number',
      },
      {
        title: '客户名称',
        dataIndex: 'customer_name',
      },
      {
        title: '询价状态',
        dataIndex: 'status_desc',
      },
      {
        title: '询价类型',
        dataIndex: 'type_desc',
      },

      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '创建人员',
        dataIndex: 'creator_name',
      },
      {
        title: '报价单号',
        dataIndex: 'quotation_order_number',
      },
      {
        title: '产品名称',
        width: 300,
        render: (text, record) => (
          <div>
            {record.single_products.length != 0 &&
              record.single_products.map(e => (
                <div key={e.id}>
                  {e.name}
                </div>
              ))
            }
          </div>
        ),
      },
      {
        title: '操作',
        render: (text, record) => {
          let flag
          let isEdit
          let deleteShow
          let cancelShow

          if (record.status == 2) {
            flag = <a onClick={() => this.goDistribute(record)}>分配</a>
          } else {
            flag = <a style={{ color: '#ccc' }}>分配</a>
          }

          if (record.status == 1) {
            isEdit = <a onClick={() => this.goLookInquiryList(record)}>编辑</a>
            deleteShow = <Popconfirm
              title="您确定要删除当条询价单么？"
              onConfirm={() => this.deleteIt(record.id)}
              okText="是"
              cancelText="否"
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          } else {
            isEdit = <a style={{ color: '#ccc' }}>编辑</a>
            deleteShow = <a style={{ color: '#ccc' }}>删除</a>
          }


          if (record.status < 7) {
            cancelShow = <Popconfirm
              title="您确定要取消当条询价单么？"
              onConfirm={() => this.cancelIt(record.id)}
              okText="是"
              cancelText="否"
            >
              <a style={{ color: 'red' }}>取消</a>
            </Popconfirm>
          } else {
            cancelShow = <a style={{ color: '#ccc' }}>取消</a>
          }


          return (
            <>
              <a onClick={() => this.goLookPage(record)}>查看</a>
              <Divider type="vertical" />
              {isEdit}
              <Divider type="vertical" />
              {flag}
              <Divider type="vertical" />
              {deleteShow}
              <Divider type="vertical" />
              {cancelShow}
            </>
          )

        },
      },
    ],
    statusArr: [],
    typeArr: [
      {
        id: '',
        name: '全部'
      },
      {
        id: 1,
        name: '阶梯询价'
      },
      {
        id: 2,
        name: '精准询价'
      },
    ],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 15,
    },
    pageSizeOptions: [10, 15, 20, 25],
    serchData: {
      number: '',
      customer_name: '',
      status: '',
      type: '',
      created_at_start: '',
      created_at_end: '',
      quotation_order_number: '',
      product_name: '',
      creator_id: '',
    },
    pageHeight: 0,
    type: 1,
    adminList: []
  }
  componentDidMount() {
    this.getList()
    this.getAdminList()
  }


  getList(type = 1) {
    const { pagination, serchData } = this.state
    axios.all([
      http.get(api.list[type], {
        params: {
          per_page: pagination.pageSize,
          page: pagination.current,
          number: serchData.number,
          customer_name: serchData.customer_name,
          status: serchData.status,
          type: serchData.type,
          created_at_start: serchData.created_at_start,
          created_at_end: serchData.created_at_end,
          quotation_order_number: serchData.quotation_order_number,
          product_name: serchData.product_name,
          creator_id: serchData.creator_id
        }
      }),
      http.get(api.orderStatus)
    ]).then(axios.spread((res, res1) => {
      if (res.code == 1) {
        let data = res.data.items;
        pagination.total = res.data.total
        this.setState({
          dataList: data,
          pagination
        })
      }
      if (res1.code == 1) {
        let data = res1.data
        this.setState({ statusArr: data })
      } else {
        message.warning(res1.message)
      }
    }))
  }
  onChangePage = (page, pageSize) => {
    const { pagination, type } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ pagination })
    this.getList(type)
  }
  serchIt = (type) => {
    const { pagination } = this.state
    pagination.current = 1
    this.setState({ pagination, type })
    this.getList(type)
  }

  deleteIt = (id) => {
    http.get(api.orderDelete, {
      params: {
        id: id
      }
    }).then(res => {
      if (res.code == 1) {
        message.success('删除成功');
        this.getList()
      } else {
        message.warning(res.message);
      }
    })
  }

  cancelIt = (id) => {
    http.get(api.inquiryCancel, {
      params: {
        id: id
      }
    }).then(res => {
      if (res.code == 1) {
        message.success('取消成功');
        this.getList()
      } else {
        message.warning(res.message);
      }
    })
  }
  // 编辑
  goLookInquiryList(data) {
    let history = this.props.history
    path.pathData.getPathData(
      {
        path: '/addList?id=' + data.id,
        data: {
          type: 1,
          id: data.id
        },
        history: history
      }
    )
  }
  // 查看
  goLookPage(data) {
    let history = this.props.history
    path.pathData.getPathData(
      {
        path: '/lookPage?id=' + data.id,
        data: {
          type: 4,
          id: data.id
        },
        history: history
      }
    )
  }
  addListData = () => {
    let history = this.props.history
    path.pathData.getPathData(
      {
        path: '/addList',
        data: {
          type: 0
        },
        history: history
      }
    )
  }
  handleOk = () => {
    this.setState({ isModalVisible: false })
  }
  // 分配
  goDistribute(data) {
    let history = this.props.history
    path.pathData.getPathData(
      {
        path: '/Distribute?id=' + data.id,
        data: {
          type: 3,
          id: data.id
        },
        history: history
      }
    )
  }

  serchInputData = (e) => {
    const { serchData } = this.state
    serchData[e.target.name] = e.target.value
    this.setState({ serchData })
  }

  onSerchStatus = (value, key) => {
    const { serchData } = this.state
    serchData[key] = value
    this.setState({ serchData })
  }

  onChangeTime = (date, dateString) => {
    const { serchData } = this.state
    serchData.created_at_start = dateString[0]
    serchData.created_at_end = dateString[1]
    this.setState({ serchData })
  }

  getAdminList() {
    http.get(api.adminList).then(res => {
      if (res.code == 1) {
        let data = res.data.items
        this.setState({ adminList: data, })
      } else {
        message.warning(res.message);
      }
    })
  }


  render() {
    const { columns, statusArr, typeArr, pagination, pageSizeOptions, adminList } = this.state
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    return (
      <div id="currentPage" className="page">
        <div className="search-line">
          <div className="mr-20">
            <span>询价单号：</span>
            <Input name='number' onChange={this.serchInputData} className="input-w" placeholder="请输入询价单号" />
          </div>
          <div className="mr-20">
            <span>客户名称：</span>
            <Input name='customer_name' onChange={this.serchInputData} className="input-w" placeholder="请输入客户名称" />
          </div>
          <div className="mr-20">
            <span>产品名称：</span>
            <Input name='product_name' onChange={this.serchInputData} className="input-w" placeholder="请输入产品名称" />
          </div>
          <div className="mr-20">
            <span>询价时间：</span>
            <RangePicker placeholder={['开始时间', '结束时间']} onChange={this.onChangeTime} />
          </div>
        </div>

        <div className="search-line">
          <div className="mr-20">
            <span>询价状态：</span>
            <Select className="input-w" placeholder="请选择" onChange={(e) => this.onSerchStatus(e, 'status')}>
              {statusArr.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))
              }
            </Select>
          </div>
          <div className="mr-20">
            <span>询价类型：</span>
            <Select className="input-w" placeholder="请选择" onChange={(e) => this.onSerchStatus(e, 'type')}>
              {typeArr.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))
              }
            </Select>
          </div>
          <div className="mr-20">
            <span>创建人员：</span>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              className="input-w"
              placeholder="请选择"
              onChange={(e) => this.onSerchStatus(e, 'creator_id')}>
              {adminList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))
              }
            </Select>
          </div>
          <div className="mr-20">
            <span>报价单号：</span>
            <Input name='quotation_order_number' onChange={this.serchInputData} className="input-w" placeholder="请输入报价单号" />
          </div>
          <div className="mr-20">
            <Button type="primary" className="mr-20" onClick={() => this.serchIt(1)}>搜索</Button>
            <Button type="primary" onClick={() => this.serchIt(2)}>搜索公司全部相关信息</Button>
          </div>
        </div>
        <Button type="primary" onClick={this.addListData}>新建询价单</Button>
        <div className="tab-block">
          <Table rowKey={record => record.id} columns={columns} dataSource={this.state.dataList} pagination={false} />
          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
            <Pagination current={pagination.current} total={pagination.total}
              pageSize={pagination.pageSize} onChange={this.onChangePage} pageSizeOptions={pageSizeOptions} showSizeChanger />
          </div>
        </div>
      </div >
    )

  }
}