const {Router} = require('express');

const usersRouter = Router();
const UsersController = require('../controllers/UsersController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const usersController = new UsersController();

usersRouter.put('/', usersController.update);
// usersRouter.delete('/', usersController.delete);

module.exports = usersRouter;