import { Server } from 'http';
import app from './app';
import envVars from './app/config/env';
import { connectRedis } from './app/config/redis.config';
import connectDB from './app/config/mongodb.config';
import serverGracefulShutdown from './app/utils/serverGracefulShutdown';
import { initSocket } from './app/config/socket.config';
import seedSuperAdmin from './app/utils/seedSuperAdmin';
import logger from './app/utils/logger';


let server: Server;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    await seedSuperAdmin();

    server = app.listen(envVars.PORT, () => {
      logger.log(`✅ Server is running on port ${envVars.PORT}`);
    });


    // Initialize Socket.io
    initSocket(server);

    // Setup shutdown handlers
    serverGracefulShutdown(server);
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }

};

export default startServer;
