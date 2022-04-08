import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// 引入所有基础配置
import Index from '../page/common/page_menu';
import Home from '../page/home/index';
import lookPage from '../page/home/Inquiry_list/add_Inquiry/look_page'
import lookProduct from '../page/home/Inquiry_list/add_Inquiry/look_product'
import addList from '../page/home/Inquiry_list/add_Inquiry/add_list'
import IndependenceProduct from '.././page/home/Inquiry_list/product/Independence_product'
import packingMaterial from '../page/packing_material/packing_material'
import setInquiryOptions from '../page/set_Inquiry_options'
import productPrice from '../page/product_price/product_price'
import priceList from '../page/product_price/price_list/price_list'
import Distribute from '../page/home/distribute/distribute'
import Quotation from '../page/quotation/quotation'
import QuotationForm from '../page/quotation_form'
import PeConfig from '../page/quotation_form/pe_config'
import addQuotation from '../page/quotation/add_quotation/add_quotation'
import materials from '../page/packing_material/materials/materials'
import approveQuotation from '../page/quotation/add_quotation/approve_quotation'
import quotationApproval from '../page/quotation_approval/quotation_approval'
import transferOrder from '../page/quotation/add_quotation/transfer_order'
import lookQuotation from '../page/quotation/add_quotation/look_quotation'
import init from '../page/quotation/add_quotation/init'
import downQuotationOrder from '../page/quotation/add_quotation/down_quotation_order'
import project from '../page/quotation_form/pe_config/project'
import analyze from '../page/product_price/price_list/analyze'
import productList from '../page/home/Inquiry_list/product/product_list';
import lookProductPage from '../page/home/Inquiry_list/product/look_product_page';




export default class RouteMap extends React.Component {

    render() {
        return (
            <BrowserRouter history={this.props.history} basename={import.meta.env.VITE_APP_BASE_URL}>
                <Switch>
                    <Route path='/' component={
                        () => (
                            <Index>
                                <Route path='/Home' component={Home} />
                                <Route path='/addList' component={addList} />
                                <Route path='/lookPage' component={lookPage} />
                                <Route path='/lookProduct' component={lookProduct} />
                                <Route path='/IndependenceProduct' component={IndependenceProduct} />
                                <Route path='/packingMaterial' component={packingMaterial} />
                                <Route path='/setInquiryOptions' component={setInquiryOptions} />
                                <Route path='/productPrice' component={productPrice} />
                                <Route path='/priceList' component={priceList} />
                                <Route path='/Distribute' component={Distribute} />
                                <Route path='/Quotation' component={Quotation} />
                                <Route path='/QuotationForm' component={QuotationForm} />
                                <Route path='/PeConfig' component={PeConfig} />
                                <Route path='/addQuotation' component={addQuotation} />
                                <Route path='/materials' component={materials} />
                                <Route path='/approveQuotation' component={approveQuotation} />
                                <Route path='/quotationApproval' component={quotationApproval} />
                                <Route path='/transferOrder' component={transferOrder} />
                                <Route path='/lookQuotation' component={lookQuotation} />
                                <Route path='/init' component={init} />
                                <Route path='/downQuotationOrder' component={downQuotationOrder} />
                                <Route path='/project' component={project} />
                                <Route path='/analyze' component={analyze} />
                                <Route path='/productList' component={productList} />
                                <Route path='/lookProductPage' component={lookProductPage} />
                            </Index>
                        )
                    } />

                </Switch>
            </BrowserRouter>
        )
    }
}
