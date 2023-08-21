const { expressjwt: jwt } = require('express-jwt')

const getTokenFromCookies = (req) => {
  if (req.cookies.authToken) {
    return req.cookies.authToken
  }
  return null
}

const isAuthenticated = jwt({
  secret: process.env.SECRET_KEY,
  algoritms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromCookies
})

module.exports = { isAuthenticated }