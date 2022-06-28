import React, { useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import { useMediaQuery, Tab, Tabs, Box } from '@material-ui/core'

import InsertGame from '../components/InsertGame'
import InsertTournament from '../components/InsertTournament'

import { Context } from '../context/Authenticator'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}


const Insert = () => {
  const { isLoggedIn, currentVersion } = useContext(Context)
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

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
    paper: {
      height: '50vh',
      background: 'white',
    },
  }))
  const classes = useStyles()

  return !isLoggedIn ? null : (
    <div className={classes.root}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Cadastrar Jogo" {...a11yProps(0)} />
          <Tab label="Cadastrar Torneio" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <InsertGame classes={classes} currentVersion={currentVersion} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InsertTournament classes={classes} currentVersion={currentVersion} />
      </TabPanel>
    </div>
  )
}

export default Insert
