const express       = require('express');
const cors          = require('cors');
const bodyParser    = require('body-parser');
const app           = express();
const swaggerUi     = require('swagger-ui-express')
const swaggerFile   = require('./swagger_output.json')
const port          = 8000;
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded( { extended : true } ));
app.use('/uploads',express.static(__dirname + '/uploads'));
const router = require('./routes');
app.use("/api", router.api);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.listen(port,() => {
    console.log(`Server is running on http://${swaggerFile.host}/swagger `);
});