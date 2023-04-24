const fs             =      require('fs')
const ResourceArray = [];
fs.readdirSync('./models')
// .filter(file => {
//   return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
// })
// .forEach(file => {
//     ResourceArray.push({resource: mongoos.model(file.split('.')[0])})
// });
module.exports = ResourceArray