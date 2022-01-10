import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import './page_menu.css'

class index extends Component {
    state = {
        rootSubmenuKeys: [],
    }
    render() {
        const { SubMenu } = Menu;
        const { openKeys } = this.state
        const { Sider, Content } = Layout;
        return (
            <div>
                <div>
                    <Layout style={{ background: '#fff' }}>
                        {process.env.NODE_ENV == 'development' &&
                            <Sider style={{ color: '#666', with: '300px' }}>
                                <Menu mode="inline" theme="dark" openKeys={openKeys} style={{ width: 260 }}>
                                    <SubMenu key="1" title="询价">
                                        <Menu.Item key="11">
                                            <Link to={'Home'}>询价单</Link>
                                        </Menu.Item>
                                        <Menu.Item key="12">
                                            <Link to={'Quotation'}>报价单</Link>
                                        </Menu.Item>
                                        {/* <Menu.Item key="13">报价单</Menu.Item> */}
                                    </SubMenu>
                                    <SubMenu key="2" title="产品核价">
                                        <Menu.Item key="21">
                                            <Link to={'productPrice'}>核价单</Link>
                                        </Menu.Item>
                                    </SubMenu>

                                    <SubMenu key="4" title="包装材质">
                                        <Menu.Item key="41">
                                            <Link to={'packingMaterial'}>包装材质</Link>
                                        </Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="5" title="询价设置">
                                        <Menu.Item key="51">
                                            <Link to={'setInquiryOptions'}>询价设置</Link>
                                        </Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="6" title="报价审批">
                                        <Menu.Item key="61">
                                            <Link to={'quotationApproval'}>报价审批设置</Link>
                                        </Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="7" title="工艺工程">
                                        <Menu.Item key="71">
                                            <Link to={'QuotationForm'}>报价BOM工单</Link>
                                        </Menu.Item>
                                    </SubMenu>

                                </Menu>
                            </Sider>
                        }
                        <Content style={{ overflow: 'auto', }}>
                            <div style={{ height: '100vh' }}>
                                {this.props.children}
                            </div>

                        </Content >
                    </Layout>

                </div>

            </div>
        );
    }
}

export default index;