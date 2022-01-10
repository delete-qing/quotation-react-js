import React, { Component } from "react";
import { Button, Input, Table, Modal, Divider, Select, message, Popconfirm, Pagination, DatePicker } from 'antd';
// import PageMenu from '../common/page_menu'
import http from '../../http/index'
import api from "../../http/httpApiName";
import path from '../../../public/common'
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
        title: '询价状态',
        dataIndex: 'status_desc',
      },
      {
        title: '询价类型',
        dataIndex: 'type_desc',
      },
      {
        title: '客户名称',
        dataIndex: 'customer_name',

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
            {record.single_products.lenght != 0 &&
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
          if (record.status == 2) {
            flag = <a onClick={() => this.goDistribute(record)}>分配</a>
          } else {
            flag = <a style={{ color: '#ccc' }}>分配</a>
          }
          return (
            <>
              <a onClick={() => this.goLookInquiryList(record)}>查看</a>
              <Divider type="vertical" />
              {flag}
              <Divider type="vertical" />
              <a style={{ color: 'red' }} onClick={() => this.deleteIt(record.id)}>删除</a>
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
        name: '意向询价'
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
      quotation_order_number: ''
    },
    pageHeight: 0,
  }
  componentDidMount() {
    this.getList()
  }


  getList() {
    const { pagination, serchData } = this.state
    axios.all([
      http.get(api.list, {
        params: {
          per_page: pagination.pageSize,
          page: pagination.current,
          number: serchData.number,
          customer_name: serchData.customer_name,
          status: serchData.status,
          type: serchData.type,
          created_at_start: serchData.created_at_start,
          created_at_end: serchData.created_at_end,
          quotation_order_number: serchData.quotation_order_number
        }
      }),
      http.get(api.orderStatus)
    ]).then(axios.spread((res, res1) => {
      if (res.code == 1) {
        console.log();
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
    const { pagination } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ pagination })
    this.getList()
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
  // 查看
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
    console.log(data);
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

  serchIt = () => {
    this.getList()
  }

  onSerchStatus = (value) => {
    const { serchData } = this.state
    serchData.status = value
    this.setState({ serchData })
    this.getList()
  }

  onSerchType = (value) => {
    const { serchData } = this.state
    serchData.type = value
    this.setState({ serchData })
    this.getList()
  }

  onChangeTime = (date, dateString) => {
    const { serchData } = this.state
    serchData.created_at_start = dateString[0]
    serchData.created_at_end = dateString[1]
    this.setState({ serchData })
    this.getList()
  }

  render() {
    const { columns, statusArr, typeArr, pagination, pageSizeOptions, } = this.state
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    return (
      <div id="currentPage" className="page">
        <div className="search-line">
          <div className="mr-20">
            <span>客户名称：</span>
            <Input name='customer_name' onChange={this.serchInputData} className="input-w" placeholder="请输入客户名称" />
          </div>
          <div className="mr-20">
            <span>询价单号：</span>
            <Input name='number' onChange={this.serchInputData} className="input-w" placeholder="请输入询价单号" />
          </div>
          <div className="mr-20">
            <span>报价单号：</span>
            <Input name='quotation_order_number' onChange={this.serchInputData} className="input-w" placeholder="请输入报价单号" />
          </div>
          <Button type="primary" onClick={this.serchIt}>搜索</Button>
        </div>

        <div className="search-line">
          <div className="mr-20">
            <span>询价状态：</span>
            <Select className="input-w" placeholder="请选择" onChange={this.onSerchStatus}>
              {statusArr.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))
              }
            </Select>
          </div>
          <div className="mr-20">
            <span>询价类型：</span>
            <Select className="input-w" placeholder="请选择" onChange={this.onSerchType}>
              {typeArr.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))
              }
            </Select>
          </div>

          <div className="mr-20">
            <span>询价时间：</span>
            <RangePicker placeholder={['开始时间', '结束时间']} onChange={this.onChangeTime} />
          </div>
        </div>


        {/* to={'/addList?id=' + 1} */}
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