import React, { useState, useEffect } from 'react'
import { Fdb } from '../config/firebase'
import { Paper, CircularProgress } from '@material-ui/core'

const InsertTournament = ({ classes, currentVersion }) => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Fdb.collection('players')
      .get()
      .then(plyers => {
        let tempPlayers = plyers.docs.map(player => player.data())
        setPlayers(tempPlayers)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error getting cached document:', error)
      })
  }, [])

  return loading ? <CircularProgress /> : <Paper className={classes.paper} elevation={3}> Ainda estou em construção....</Paper>
}

export default InsertTournament
