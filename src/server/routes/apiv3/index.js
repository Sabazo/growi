const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3'); // eslint-disable-line no-unused-vars

const express = require('express');

const router = express.Router();

module.exports = (crowi) => {

  // add custom functions to express response
  require('./response')(express, crowi);

  router.use('/healthcheck', require('./healthcheck')(crowi));

  router.use('/user-groups', require('./user-group')(crowi));

  router.use('/user-group-relations', require('./user-group-relation')(crowi));

  return router;
};
