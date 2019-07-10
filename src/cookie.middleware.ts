const uuidv1 = require('uuid/v1');

export function generateTrackingCookie(req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.sa;
  if (cookie === undefined) {
    res.cookie('sa', uuidv1(), { maxAge: 900000, httpOnly: true });
  }
  next();
}
