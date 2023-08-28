let currentTokenVersion = 1

module.exports = {
  getCurrentTokenVersion: () => currentTokenVersion,
  incrementTokenVersion: () => currentTokenVersion++
}