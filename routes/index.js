var express = require('express');
var router = express.Router();
const indexRouter = require('./v1/index');
router.use('/v1', indexRouter);


module.exports = router;
