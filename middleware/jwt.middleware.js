const { expressjwt: jwt } = require('express-jwt')

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

// version 1
// const isAuthenticated = jwt({
//   secret: process.env.SECRET_KEY,
//   algorithms: ["HS256"],
//   requestProperty: "payload",
//   getToken: getTokenFromCookies
// })

// version 2
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

module.exports = { isAuthenticated }