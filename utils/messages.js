const moment = require('moment');

function formatMessage(username,text,from=null){
  // let time = null
  // if(text.createdAt){
  //   time = moment(text.createdAt).format('h:mm a')
  // }
  return {
    username,
    text,
    from,
    // time: time
  };
}

module.exports = formatMessage;
