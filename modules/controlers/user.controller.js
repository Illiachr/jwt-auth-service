/* eslint-disable class-methods-use-this */
const userService = require('../services/user.servise');

class UsersController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      res.send(userData);
    } catch (err) {
      console.log(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      res.send({ email, password });
    } catch (err) {
      console.log(err);
    }
  }

  async logout(req, res, next) {
    try {

    } catch (err) {
      console.log(err);
    }
  }

  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await userService.activate(link);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      console.log(err);
    }
  }

  async refresh(req, res, next) {
    try {

    } catch (err) {
      console.log(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      res.json(['123', '789']);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new UsersController();
