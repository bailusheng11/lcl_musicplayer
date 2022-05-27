

 export function formatPlayNumber(number){
  if(number > 1000000000){
    return (number/1000000000).toFixed(1) + '亿'
  }else if(number > 10000){
    return (number/10000).toFixed(1) + '万'
  }else {
    return number + ''
  }
}

 export function formatTime(time){
  time = time/1000
  var minute = Math.floor(time / 60)
  var seconds = Math.floor(time) % 60
  return padLeftZero(minute) + ":" + padLeftZero(seconds)
}

 function padLeftZero(time){
  time = time + ""
  return ('00' + time).slice(time.length) 
}

// module.exports = {
//   formatPlayNumber,
//   formatTime
// }

// export {
// 	formatTime
// }