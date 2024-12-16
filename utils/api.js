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
module.exports={enterReq}