import React, { useState, useEffect } from 'react'
import { Fdb } from '../config/firebase'
import { updateElo } from '../common/utils/elo'
import { useTheme } from '@material-ui/styles'
import {
  Paper,
  CircularProgress,
  Grid,
  TextField,
  MenuItem,
  useMediaQuery,
  Typography,
  Button,
  Snackbar,
} from '@material-ui/core'

const convertArrayToObject = (array, key) => {
  const initialValue = {}
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    }
  }, initialValue)
}

const InsertGame = ({ classes, currentVersion }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), {
    defaultMatches: true,
  })
  const textFieldSize = isMobile ? '30ch' : '50ch'

  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setError(false)
  }

  const [result, setResult] = useState('-1')
  const [newRatings, setNewRatings] = useState({})
  const [players, setPlayers] = useState(null)
  const [tournaments, setTournaments] = useState(null)
  const [playerInfo, setPlayerInfo] = useState({})
  const [tournamentInfo, setTournamentInfo] = useState({})
  const [loading, setLoading] = useState(true)

  const [white, setWhite] = useState('')
  const [black, setBlack] = useState('')
  const [tournament, setTournament] = useState('')

  const handleChangeWhite = event => {
    setWhite(event.target.value)
  }
  const handleChangeBlack = event => {
    setBlack(event.target.value)
  }
  const handleChangeTournament = event => {
    setTournament(event.target.value)
  }
  const handleChangeResult = event => {
    setResult(event.target.value)
  }

  const getResult = () => {
    switch (result) {
      case '1':
        return '1-0'
      case '0':
        return '0-1'
      case '0.5':
        return '1/2-1/2'
      default:
        return '0'
    }
  }
  const saveGame = () => {
    try {
      if (result !== '-1') {
        const blackRef = Fdb.collection('players').doc(black)
        const whiteRef = Fdb.collection('players').doc(white)
        Fdb.collection('games').add({
          date: new Date(),
          players: {
            black: {
              ratingATM: playerInfo[black]?.rating,
              ref: blackRef,
            },
            white: {
              ratingATM: playerInfo[white]?.rating,
              ref: whiteRef,
            },
          },
          result: getResult(),
          tournament: Fdb.collection('tournaments').doc(tournament),
        })
        blackRef.update({ rating: newRatings.black })
        whiteRef.update({ rating: newRatings.white })
      }
      setNewRatings({})
      setResult('-1')
      setPlayerInfo({})
      setTournamentInfo({})
      setWhite('')
      setBlack('')
      setTournament('')
      setOpen(true)
      setLoading(true)

      Fdb.collection('players')
        .get()
        .then(plyers => {
          let tempPlayers = plyers.docs?.map(player => ({
            ...player.data(),
            label: player.data().name,
          }))
          setPlayers(
            tempPlayers.sort((a, b) => {
              return b.name - a.name
            })
          )
          setPlayerInfo(convertArrayToObject(tempPlayers, 'id'))
          setLoading(false)
        })
        .catch(error => {
          console.error('Error getting cached document:', error)
        })
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    if (players && tournaments) setLoading(false)
  }, [players, tournaments])

  useEffect(() => {
    if (playerInfo[white]?.rating && playerInfo[black]?.rating && result !== '-1')
      setNewRatings(updateElo(result, playerInfo[white]?.rating, playerInfo[black]?.rating))
  }, [black, playerInfo, result, white])

  // Get DB info
  useEffect(() => {
    Fdb.collection('players')
      .get()
      .then(plyers => {
        let tempPlayers = plyers.docs?.map(player => ({
          ...player.data(),
          label: player.data().name,
        }))
        setPlayers(
          tempPlayers.sort((a, b) => {
            return b.name - a.name
          })
        )
        setPlayerInfo(convertArrayToObject(tempPlayers, 'id'))
      })
      .catch(error => {
        console.error('Error getting cached document:', error)
      })
    Fdb.collection('tournaments')
      .get()
      .then(trnaments => {
        let tempTournaments = trnaments.docs.map(tournament => {
          const tournamentDt = tournament.data()
          const tournamentDates = {
            dateIni: tournamentDt?.date?.start?.toDate(),
            dateFim: tournamentDt?.date?.end?.toDate(),
          }
          return { ...tournamentDt, ...tournamentDates }
        })
        setTournaments(
          tempTournaments.sort((a, b) => {
            return b.date - a.date
          })
        )
        setTournamentInfo(convertArrayToObject(tempTournaments, 'id'))
      })
      .catch(error => {
        console.error('Error getting cached document:', error)
      })
  }, [])

  return (
    <Paper className={isMobile ? null : classes.paper} elevation={3}>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
        message="Jogo cadastrado =)"
        key={'vertical + horizontal'}
        severity="success"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={error}
        onClose={handleClose}
        message="Algo deu errado, tente novamente =("
        key={'vertical + horizontalerror'}
        severity="error"
      />

      <Grid container>
        {/* Tournament Controller */}
        <Grid item xs={12} sm={4} style={{ padding: '32px' }}>
          <Typography variant="h5" color="primary">
            Modo de jogo
          </Typography>
          <TextField
            id="outlined-select-tournament"
            select
            label="Modo de jogo"
            value={tournament}
            defaultValue="not-tournament"
            onChange={handleChangeTournament}
            style={{ width: textFieldSize, marginBottom: '16px' }}
          >
            <MenuItem key="not-tournament" value="not-tournament">
              Casual
            </MenuItem>
            {tournaments?.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name} - {option.id}
              </MenuItem>
            ))}
          </TextField>
          <br />
          <TextField
            id="outlined-tournament-org"
            label="Organizador"
            value={tournamentInfo[tournament]?.org || ''}
            style={{ width: '30ch', marginBottom: '16px' }}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <br />
          <TextField
            id="outlined-tournament-club"
            label="Cidade"
            value={tournamentInfo[tournament]?.city || ''}
            style={{ width: '30ch', marginBottom: '16px' }}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* White Controller */}
        <Grid item xs={12} sm={4} style={{ padding: '32px' }}>
          <Typography variant="h5" color="primary">
            Jogador de brancas
          </Typography>
          <TextField
            id="outlined-select-player-white"
            select
            label="Brancas"
            value={white}
            onChange={handleChangeWhite}
            style={{ width: textFieldSize, marginBottom: '16px' }}
          >
            {players?.map(option => (
              <MenuItem key={option.id} value={option.id} disabled={option.id === black}>
                {option.name} - {option.id}
              </MenuItem>
            ))}
          </TextField>
          <br />
          <TextField
            id="outlined-player-white-rating"
            label="Rating"
            value={playerInfo[white]?.rating || ''}
            style={{ width: '30ch', marginBottom: '16px' }}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <br />
          <TextField
            id="outlined-player-white-club"
            label="Cidade/Clube"
            value={playerInfo[white]?.club || ''}
            style={{ width: '30ch', marginBottom: '16px' }}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Black Controller */}
        <Grid item xs={12} sm={4} style={{ padding: '32px' }}>
          <Typography variant="h5" color="primary">
            Jogador de pretas
          </Typography>
          <TextField
            id="outlined-select-player-black"
            select
            label="Pretas"
            value={black}
            onChange={handleChangeBlack}
            style={{ width: textFieldSize, marginBottom: '16px' }}
          >
            {players?.map(option => (
              <MenuItem key={option.id} value={option.id} disabled={option.id === white}>
                {option.name} - {option.id}
              </MenuItem>
            ))}
          </TextField>
          <br />
          <TextField
            id="outlined-player-black-rating"
            label="Rating"
            value={playerInfo[black]?.rating || ''}
            style={{ width: '30ch', marginBottom: '16px' }}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
          <br />
          <TextField
            id="outlined-player-black-club"
            label="Cidade/Clube"
            value={playerInfo[black]?.club || ''}
            style={{ width: '30ch', marginBottom: '16px' }}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Elo Controller */}
        <Grid item xs={12} sm={4} style={{ padding: '32px' }}>
          <Typography variant="h5" color="primary">
            Resultado
          </Typography>
          <TextField
            id="result"
            select
            label="Resultado"
            value={result}
            onChange={handleChangeResult}
            style={{ width: textFieldSize, marginBottom: '16px' }}
            disabled={white === '' || black === ''}
          >
            <MenuItem key="-1" value="-1" disabled selected>
              Selecione
            </MenuItem>
            <MenuItem key="1" value="1">
              Brancas - {playerInfo[white]?.name}
            </MenuItem>
            <MenuItem key="0" value="0">
              Pretas - {playerInfo[black]?.name}
            </MenuItem>
            <MenuItem key="0.5" value="0.5">
              Empate
            </MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} style={{ padding: '32px' }}>
          <Typography variant="h5" color="primary">
            Ratings atualizados
          </Typography>
          <Typography variant="h6">
            {playerInfo[white]?.name || 'Jogador de Brancas'}: {newRatings?.white}
          </Typography>
          <Typography variant="h6">
            {playerInfo[black]?.name || 'Jogador de Pretas'}: {newRatings?.black}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          style={{
            padding: '32px',
            alignSelf: 'flex-end',
            textAlign: isMobile ? 'center' : 'end',
            paddingRight: isMobile ? '32px' : '136px',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={saveGame}
            disabled={loading}
          >
            {loading ? <CircularProgress /> : 'Cadastrar'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default InsertGame
