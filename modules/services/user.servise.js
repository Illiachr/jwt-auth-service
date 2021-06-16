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
    // eslint-disable-next-line no-use-before-define
    await mailService.sendActivationLink(email, setLink(activationLink));
    const userDto = new UserDto(user); // { _id, email, isActivated }
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

  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      // TODO: This must be not found -> 404
      throw ApiError.BadRequest(`User with ${email} not found`);
    }

    // TODO: isActivated?
    if (!user.isActivated) {
      throw new ApiError(403, `User with ${email} not activated. Please, follow activation link at your email.`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password not accepted');
    }
    const userDto = new UserDto(user);
    const tokenPair = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokenPair.refreshToken);

    return {
      ...tokenPair,
      user: userDto
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokenPair = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokenPair.refreshToken);

    return {
      ...tokenPair,
      user: userDto
    };
  }
}

module.exports = new UserService();

function setLink(activationLink, slug = 'activate') {
  const link = [process.env.API_URL, process.env.API_BASEPATH, slug, activationLink];
  return link.join('/');
}
