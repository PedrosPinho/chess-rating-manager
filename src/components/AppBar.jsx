import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  AppBar as AppBarMui,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { routes } from '../routes/routes'

const ListItems = ({ setOpen, currentVersion }) => (
  <div role="presentation" style={{ width: '250px', height: '100%' }}>
    <div></div>
    <Typography noWrap variant="h6" style={{ height: '64px', padding: '16px' }}>
      Nome do App
    </Typography>
    <Divider />
    <List>
      {routes.map(text => (
        <ListItem button component={Link} to={text.path} key={text.alias} onClick={() => setOpen(false)}>
          <ListItemIcon>
            <text.icon color='primary'/>
          </ListItemIcon>
          <ListItemText primary={text.alias} />
        </ListItem>
      ))}
    </List>
    <Typography variant="h6" style={{ padding: '16px' }}>
      {currentVersion}
    </Typography>
  </div>
)

const AppBar = ({ currentVersion }) => {
  const [open, setOpen] = useState(false)

  return (
    <AppBarMui position="sticky" elevation={1}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Typography noWrap variant="h6">
          Nome do App
        </Typography>
      </Toolbar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} style={{ width: '250px' }}>
        <ListItems setOpen={setOpen} currentVersion={currentVersion} />
      </Drawer>
    </AppBarMui>
  )
}

export default AppBar
