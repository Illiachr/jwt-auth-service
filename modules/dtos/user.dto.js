module.exports = class UserDto {
  // email;
  // id;
  // isActivated;

  constructor(model) {
    this.email = model.email;
    // eslint-disable-next-line no-underscore-dangle
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
