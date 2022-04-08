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
    list: {
        1: '/inquiry/order/list',
        2: '/inquiry/order/all'
    },

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
    settlementGet: '/pods/settlement/get',
    productList: '/inquiry/order/get/',
    inquiryCancel: '/inquiry/order/cancel',


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
    checkList: {
        1: '/check/order/list',
        2: '/check/order/all'
    },
    checkGet: '/check/order/get',
    checkSave: '/check/order/save',
    checkCommit: '/check/order/commit',
    checkCost: '/check/order/bom/get/cost',
    bomCostDetail: '/check/order/bom/set/cost/detail',
    checkStatus: '/check/order/status',
    checkAnalyze: '/check/order/cost/analyze',

    // 报价
    bomList: {
        1: '/bom/order/list',
        2: '/bom/order/all'
    },
    bomAssign: '/bom/order/assign',
    versionList: '/bom/version/latest',
    versionCreate: '/bom/version/create',
    quoteStatus: '/quote/order/status',
    quoteGet: '/quote/order/get',
    quoteList: {
        1: '/quote/order/list',
        2: '/quote/order/all',
    },
    quoteCreate: '/quote/order/create',
    quoteApprove: '/quote/order/approve',
    orderConfrim: '/quote/order/confirm',
    orderQuote: '/quote/order/quote',
    orderTransfer: '/quote/order/transfer',

    // 报价审批设置
    discountList: '/quote/discount/list',
    discountGet: '/quote/discount/get',
    discountCreate: '/quote/discount/create',
    discountDelete: '/quote/discount/delete',
    discountUpdate: '/quote/discount/update',
    // bom
    bomGet: '/bom/order/get',
    costDetail: '/check/order/bom/get/cost/detail',
    bomStatus: '/bom/order/status',
    bomProject: '/bom/order/project',



    // 添加子件  废弃  但不可删有的页面在用
    componentList: '/bom/structure/component/list',
    componentCreate: '/bom/structure/component/create',
    // 组件
    combinationCreate: '/bom/structure/combination/create',
    preComponentCreate: '/bom/structure/pre_component/create',




}


export default API