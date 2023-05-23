const moment = require('moment');

function formatMessage(username, text,from=null) {
  return {
    username,
    text,
    from,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
