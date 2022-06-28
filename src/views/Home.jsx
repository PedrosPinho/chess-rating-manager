import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import { Grid, Typography, useMediaQuery } from '@material-ui/core'

import TableScore from '../components/TableScore'
import TableTournaments from '../components/TableTournaments'
import TableHistory from '../components/TableHistory'

import { Context } from '../context/Authenticator'

const Home = () => {
  const { currentVersion } = useContext(Context)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), {
    defaultMatches: true,
  })

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      margin: isMobile ? 0 : theme.spacing(2),
      padding: isMobile ? 0 : theme.spacing(4),
      height: '85vh',
      background: '#fafaff',
    },
    itemHome: {
      height: '100%',
    },
    itemHomeSm: {
      height: '80%',
    },
    toolbar: {
      minHeight: '32px',
      cursor: 'pointer',
      alignItems: 'center',
    },
    typography: {
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
  }))
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={isMobile ? 0 : 3} className={classes.itemHome}>
        <Grid item xs={12} sm={7}>
          <Typography variant="h5" color='primary'>Histórico de jogos</Typography>
          <TableHistory classes={classes} currentVersion={currentVersion} />
        </Grid>
        <Grid container item xs={12} sm={5} style={{ height: '100%' }}>
          <Grid item xs={12} style={{ height: '45%', marginBottom: '5%' }}>
            <Typography variant="h5" color='primary'>Jogadores</Typography>
            <TableScore classes={classes} currentVersion={currentVersion} />
          </Grid>
          <Grid item xs={12} style={{ height: '50%' }}>
            <Typography variant="h5" color='primary'>Torneios Cadastrados</Typography>
            <TableTournaments classes={classes} currentVersion={currentVersion} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home
