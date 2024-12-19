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
  getOrders:(status,page=1,pageSize=10)=>{
    const params={
      status,page,pageSize
    }
    return $http.get('/orders',params)
  },
}
module.exports={enterReq,ordersReq}