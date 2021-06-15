const ApiError = require('../helpers/error.helper');

// eslint-disable-next-line func-names
module.exports = function(err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: 'Uncaptured exeption' });
};
