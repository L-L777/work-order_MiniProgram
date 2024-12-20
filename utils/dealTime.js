const dealTime={
// 处理日期数组（年、月、日）
formatDate: (arr) => {
  if(!Array.isArray(arr)){
    return  '暂无数据'
  }
  let result = arr.map(String).join('-');
  return  result
},

// 处理具体时间数组
formatTime: (arr) => {
  if(!Array.isArray(arr)){
    return  '暂无数据'
  }
  let datePart = arr.slice(0, 3).map(String).join('-'); // 取前三个元素，转换为字符串，并用 '-' 连接
let timePart = arr.slice(3).map(String).join(':'); // 取后两个元素，转换为字符串，并用 ':' 连接
let result = `${datePart} ${timePart}`;
  return  result
},
}

module.exports = {
  dealTime
}