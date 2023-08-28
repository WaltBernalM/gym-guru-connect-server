// const { expressjwt: jwt } = require('express-jwt')

// const getTokenFromCookies = (req) => {
//   if (req.cookies.authToken) {
//     return req.cookies.authToken
//   }
//   return null
// }

// const isAuthenticated = jwt({
//   secret: process.env.SECRET_KEY,
//   algorithms: ["HS256"],
//   requestProperty: "payload",
//   getToken: getTokenFromCookies
// })

// module.exports = { isAuthenticated }

// Ver 2:
const { expressjwt: jwt } = require('express-jwt')
const jwtDecode = require('jwt-decode')
const { getCurrentTokenVersion } = require('../controllers/config')

const isTokenValid = (tokenVersion, currentVersion) => {
  return tokenVersion === currentVersion
}

const isAuthenticated = async (req, res, next) => { 
  const token = req.cookies.authToken

  console.log('authToken', token)

  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  
  try {
    const decoded = jwtDecode(token)
    const tokenVersion = decoded.version

    if (!isTokenValid(tokenVersion, getCurrentTokenVersion())) {
      return res.status(401).json({message: 'Unauthorized (invalid Token version'})
    }

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({message: "Unauthorized"})
  }
}

module.exports = { isAuthenticated }