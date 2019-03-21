const  http = require('http');
const app = require('./server/app');

const port = process.env.PORT || 3030;
const server = http.createServer(app);

server.listen(port, 'localhost');
