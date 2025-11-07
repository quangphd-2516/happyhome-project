const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const propertyRoute = require('./property.route');
const kycRoute = require('./kyc.route');
const adminRoute = require('./admin.route');
const chatRoute = require('./chat.route');
const auctionRoute = require('./auction.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/kyc',
    route: kycRoute,
  },
  {
    path: '/properties',
    route: propertyRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/chats',
    route: chatRoute,
  },
  {
    path: '/auctions',
    route: auctionRoute,
  }

];

/*
// XÓA CẢ ĐOẠN NÀY
const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];
*/

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/*
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}
*/

module.exports = router;