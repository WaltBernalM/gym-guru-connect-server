const { expressjwt: jwt } = require('express-jwt')

const getTokenFromCookies = (req) => {
  if (req.cookies.authToken) {
    return req.cookies.authToken
  }
  return null
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
      return res.status(401).json({message: 'Unauthorized: Invalid authentication Token'})
    }
    next()
  })
}

module.exports = { isAuthenticated }