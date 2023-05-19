const express       = require('express');
const cors          = require('cors');
const bodyParser    = require('body-parser');
const app           = express();
const swaggerUi     = require('swagger-ui-express')
const swaggerFile   = require('./swagger_output.json')
const socketio = require('socket.io');
const port          = 8000;
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded( { extended : true } ));
app.use('/uploads',express.static(__dirname + '/uploads'));
const router = require('./routes');
app.use("/api", router.api);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const path = require('path');
app.use(express.static(path.resolve(__dirname, 'client')));
app.get('/sample', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://${swaggerFile.host}/swagger`);
});
// const server = app.listen(1010, () => {
//     console.log(`Socket Connected`);
// });

// const io = socketio(server)
// io.on('connection', (socket) => {
//     io.emit('chat message', { someProperty:socket.id, otherProperty: 'other value' });
//     socket.on('chat message', (msg) => {
//         console.log("Hi")
//         io.emit('chat message', msg);
//     });
// });