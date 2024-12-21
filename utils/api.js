import $http from "./http.js"
// 放请求
// 登录注册请求
const enterReq={
// 登录
login:(phone,password)=>{
  const data={
    phone,password
  }
  return $http.post('/user/login',data)
},
// 注册
register:(phone,password)=>{
  const data={
    phone,password
  }
  return $http.post('/user/register',data)
},
}


// 工单处理模块请求
const ordersReq={
  // 获取工单列表(管理员/员工/施工方)
  getOrders:(page=1,pageSize=10,status)=>{
    const params={
      status,page,pageSize
    }
    return $http.get('/orders',params)
  },
  // 获取工单详情（管理员/员工/施工方）
  getOrdersDetail:(orderId)=>{
    const params={
      orderId
    }
    return $http.get('/orders/detail',params)
  },
  // 获取未发布工单(管理员/员工)
  getUnpublishOrders:(page=1,pageSize=10)=>{
    const params={
      page,pageSize
    }
    return $http.get('/orders/publish',params)
  },
  // 发布工单(管理员/员工)
  publishOrders:(orderId)=>{
    const data={
      orderId
    }
    return $http.post('/orders/publish',data)
  },
  // 删除工单(管理员/员工)
  deleteOrders:(orderId)=>{
    const params={
      orderId
    }
    return $http.delete(`/orders/delete/${orderId}`,params)
  },
  // 验收工单（员工/施工方）
  checkOrders:(orderId)=>{
    const data={
      orderId
    }
    return $http.post('/orders/check',data)
  },
  // 获取验收信息(管理员/员工)
  getOrdersCheckDetail:(orderId)=>{
    const params={
      orderId
    }
    return $http.get('/orders/check',params)
  },
  // 修改工单状态（施工方确认工单，施工方结束工程）（管理员修改状态）
  updateOrderStatus:(orderId,status)=>{
    const data={
      orderId,status
    }
    return $http.put('/orders/status',data)
  },
  // 签到签退（施工方）
  sign:(orderId,latitude,longitude,signType,textInfo,images)=>{
    const data={
      orderId,latitude,longitude,signType,textInfo,images
    }
    return $http.post('/orders/sign',data)
  },
  // 查看工单签到签退信息（管理员/员工/施工方）
  getSignDetail:(orderId)=>{
    const params={
      orderId
    }
    return $http.get('/orders/sign',params)
  },
  // 修改签到签退详情（管理员）
  updateSignDetail:(id,orderId,textInfo,images)=>{
    const data={
      id,orderId,textInfo,images
    }
    return $http.put('/orders/sign',data)
  },
}
module.exports={enterReq,ordersReq}