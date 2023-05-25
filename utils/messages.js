const moment = require('moment');

function formatMessage(username,text,from,is_replace){
  // let time = null
  // if(text.createdAt){
  //   time = moment(text.createdAt).format('h:mm a')
  // }
  return {
    username,
    text,
    from,
    is_replace
    // time: time
  };
}

module.exports = formatMessage;
