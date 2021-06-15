/* eslint-disable class-methods-use-this */
require('dotenv').config();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const userModel = require('../models/user.model');
const mailService = require('./mail.service');
const UserDto = require('../dtos/user.dto');
const tokenService = require('./token.service');
const ApiError = require('../helpers/error.helper');

class UserService {
  async registration(email, password) {
    const candidate = await userModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(`User with ${email} already exists`);
    }

    const hashPwd = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await userModel.create({ email, password: hashPwd, activationLink });
    await mailService.sendActivationLink(email, setLink(activationLink));
    const userDto = new UserDto(user); // { _id, email, isActivared }
    const tokenPair = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokenPair.refreshToken);

    return {
      ...tokenPair,
      user: userDto
    };
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Link not accepted');
    }

    user.isActivated = true;
    await user.save();
  }
}

module.exports = new UserService();

function setLink(activationLink, slug = 'activate') {
  const link = [process.env.API_URL, process.env.API_BASEPATH, slug, activationLink];
  return link.join('/');
}
