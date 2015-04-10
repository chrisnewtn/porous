'use strict';

function screwWithDOM(req, res, next) {
  res.body = res.body.replace('</body>', '<!-- omg --></body>');
  next();
}

module.exports = {
  '*': screwWithDOM
};
