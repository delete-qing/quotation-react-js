const API = {
    // 公共接口
    adminList: '/pods/admin/list',
    customerList: '/pods/customer/list',
    companyList: '/pods/company/list',
    materialList: '/material_management/material/list.html',
    attachUpload: '/attach/upload',
    attachDelete: '/attach/delete',
    getDownloadUrl: '/file/get_download_url',

    // 询价单
    list: '/inquiry/order/list',
    orderSetBasic: '/inquiry/order/set_basic',
    orderGet: '/inquiry/order/get',
    productGet: '/inquiry/product/get',
    productCreate: '/inquiry/product/create',
    productDelete: '/inquiry/product/delete',
    productUpdate: '/inquiry/product/update',
    orderSetDetail: '/inquiry/order/set_detail',
    orderSave: '/inquiry/order/save',
    ordeCancel: '/inquiry/order/cancel',
    orderCommit: '/inquiry/order/commit',
    orderAssign: '/inquiry/order/assign',
    orderDelete: '/inquiry/order/delete',
    assignConfirm: '/inquiry/order/assign/confirm',
    orderStatus: '/inquiry/order/status',
    settlementList: '/pods/settlement/list',
    productList: '/inquiry/order/get/',


    // 包装材质接口、
    packingList: '/pack/material/list',
    createMateria: '/pack/material/create_multi',
    deleteMateria: '/pack/material/delete',
    usage: '/pack/material/usage',
    bindMaterial: '/pack/material/bind/material',


    // 询价选项设置、
    inquiryOptionsList: '/inquiry/param/list',
    create: '/inquiry/param/create',
    inquiryUsage: '/inquiry/param/usage',
    inquiryDelete: '/inquiry/param/delete',
    paramUpdate: '/inquiry/param/update',

    // 核价
    checkList: '/check/order/list',
    checkGet: '/check/order/get',
    checkSave: '/check/order/save',
    checkCommit: '/check/order/commit',
    checkCost: '/check/order/bom/get/cost',
    bomCostDetail: '/check/order/bom/set/cost/detail',
    checkStatus: '/check/order/status',
    techDetail:'/check/order/bom/set/tech/detail',

    // 报价
    bomList: '/bom/order/list',
    bomAssign: '/bom/order/assign',
    bomGet: '/bom/order/get',
    versionList: '/bom/version/latest',
    versionCreate: '/bom/version/create',
    quoteStatus: '/quote/order/status',
    quoteGet: '/quote/order/get',
    quoteList: '/quote/order/list',
    quoteCreate: '/quote/order/create',
    quoteApprove: '/quote/order/approve',
    orderConfrim: '/quote/order/confirm',
    orderQuote: '/quote/order/quote',
    orderTransfer: '/quote/order/transfer',




    // 添加子件
    componentList: '/bom/structure/component/list',
    componentCreate: '/bom/structure/component/create',
    // 组件
    combinationCreate: '/bom/structure/combination/create',
    preComponentCreate: '/bom/structure/pre_component/create',


    // 报价审批设置
    discountList: '/quote/discount/list',
    discountGet: '/quote/discount/get',
    discountCreate: '/quote/discount/create',
    discountDelete: '/quote/discount/delete',
    discountUpdate: '/quote/discount/update',
    // bom
    bomGet: '/bom/get',
    costDetail: '/check/order/bom/get/cost/detail',
    bomStatus: '/bom/order/status',

}


export default API