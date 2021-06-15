const { Router } = require('express');
const usersController = require('../controlers/user.controller');

const router = new Router();

router.post('/registration', usersController.registration);
router.post('/login', usersController.login);
router.post('/logout', usersController.logout);
router.get('/activate/:link', usersController.activate);
router.get('/refresh', usersController.refresh);
router.get('/users', usersController.getAllUsers);

module.exports = router;