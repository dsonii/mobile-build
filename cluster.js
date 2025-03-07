const cluster = require('cluster')
const numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      //To handle zero downtime
      console.log('Starting a new worker');
      cluster.fork(); 
    });
  } else {

    require('./server')
  }