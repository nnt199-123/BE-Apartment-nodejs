var express = require('express');
var router = express.Router();

const authRouter = require('./tables/users/auth');
const buildingRouter = require('./tables/buildings/building');
const roomRouter = require('./tables/rooms/room');
const contractRouter = require('./tables/contracts/contract');
const assetRouter = require('./tables/assets/asset');
const feeRouter = require('./tables/fees/fee');
const serviceBuildingRouter = require('./tables/service_buildings/service_building');


router.use('/auth', authRouter);
router.use('/buildings', buildingRouter);
router.use('/rooms', roomRouter);
router.use('/contracts', contractRouter);
router.use('/assets', assetRouter);
router.use('/fees', feeRouter);
router.use('/service-buildings', serviceBuildingRouter);

module.exports = router;
