const { expressjwt: jwt } = require('express-jwt')
const TokenVersion = require('../models/TokenVersion.model')

const getTokenFromCookies = (req) => {
  if (req.cookies.authToken) {
    return req.cookies.authToken
  }
  return null
}

const increaseTokenVersion = async () => {
  const tokenVersionId =
    process.env.NODE_ENV === "production"
      ? process.env.TOKENVERSION_ID
      : "64efeb57ac2584d6eacadce1"

  const { _id, version } = await TokenVersion.findById(tokenVersionId)
  const tokenVersion = version + 1
  const updatedToken = await TokenVersion.findByIdAndUpdate(_id, {
    version: tokenVersion,
  })
}

const isAuthenticated = (req, res, next) => {
  const token = getTokenFromCookies(req)

  if (!token) {
    increaseTokenVersion()
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing authToken cookie" })
  }

  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: getTokenFromCookies
  })(req, res, (error) => {
    if (error) {
      increaseTokenVersion()
      return res.status(401).json({message: 'Unauthorized: Invalid authentication Token'})
    }
    next()
  })
}

// Authentication of general user by Bearer token from headers
const getTokenFromHeaders = (req) => {
  if ( req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1]
  }
  return null
}
const isUserAuthenticated = jwt({
  secret: process.env.SECRET_KEY,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders
})

module.exports = { isAuthenticated, isUserAuthenticated }