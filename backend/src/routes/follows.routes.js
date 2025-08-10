const {Router} = require('express');
const FollowsController = require('../controllers/FollowsController');
const auth = require('../configs/auth');

const followsRoutes = Router();
const followsController = new FollowsController();

followsRoutes.post('/:deputado_id', followsController.create);
followsRoutes.delete('/:deputado_id', followsController.delete);
followsRoutes.get('/', followsController.index);


module.exports = followsRoutes;