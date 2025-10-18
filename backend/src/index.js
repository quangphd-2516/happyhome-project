const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

// Không cần code kết nối database ở đây nữa

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

// Giữ lại các đoạn code xử lý exit event ở phía dưới
const exitHandler = () => { }//...
// ...