const  http = require('http');
const app = require('./server/app');

const port = process.env.PORT || 3030;
const server = http.createServer(app);

console.log(
    '\x1b[36m%s\x1b[0m', '[Server] Server is running on',
    '\x1b[35m', `http://localhost:${port}/`, '\x1b[0m')
server.listen(port, 'localhost');
