function getRatingDelta(myRating, opponentRating, myGameResult) {
  if (['0', '0.5', '0,5', '1'].indexOf(myGameResult) === -1) {
    return null
  }

  var myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400))

  return Math.round(32 * (myGameResult - myChanceToWin))
}

function getNewRating(myRating, opponentRating, myGameResult) {
  return myRating + getRatingDelta(myRating, opponentRating, myGameResult)
}

function invertResult(res) {
  if (['0.5', '0,5'].indexOf(res) !== -1) return '0.5'

  if (['1'].indexOf(res) !== -1) return '0'

  return '1'
}

export function updateElo(result, elo1, elo2) {
  const white = getNewRating(elo1, elo2, result)
  const black = getNewRating(elo2, elo1, invertResult(result))

  return { black, white }
}