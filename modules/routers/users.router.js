const { Router } = require('express');
const { body } = require('express-validator');
const usersController = require('../controlers/user.controller');
const auth = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  usersController.registration);
router.post('/login', usersController.login);
router.post('/logout', usersController.logout);
router.get('/activate/:link', usersController.activate);
router.get('/refresh', usersController.refresh);
router.get('/users', auth, usersController.getAllUsers);

module.exports = router;
