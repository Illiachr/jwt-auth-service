/* eslint-disable class-methods-use-this */
const { validationResult } = require('express-validator');
const userService = require('../services/user.servise');
const ApiError = require('../helpers/error.helper');

class UsersController {
  // eslint-disable-next-line consistent-return
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation failure', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      res.send(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      res.send({ email, password });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {

    } catch (err) {
      next(err);
    }
  }

  // eslint-disable-next-line consistent-return
  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await userService.activate(link);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {

    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      res.json(['123', '789']);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();
