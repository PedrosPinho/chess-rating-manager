import React, { useState, useEffect } from 'react'
import { Fdb } from '../config/firebase'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@material-ui/core'

const TableScore = ({ classes, currentVersion }) => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Fdb.collection('players')
      .limit(15)
      .orderBy('rating')
      .get()
      .then(players => {
        let tempRows = players.docs.map(player => player.data())
        setRows(
          tempRows.sort((a, b) => {
            return b.rating - a.rating
          })
        )
        setLoading(false)
      })
      .catch(error => {
        console.error('Error getting cached document:', error)
      })
  }, [])

  return (
    <TableContainer className={classes.itemHome} component={Paper} elevation={3}>
      <Table size="small" aria-label="tabela de ratings" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <b>Nome</b>
            </TableCell>
            <TableCell align="left">
              <b>Rating</b>
            </TableCell>
            <TableCell align="left">
              <b>Cidade</b>
            </TableCell>
            <TableCell align="left">
              <b>ID</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? <CircularProgress />
            : rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row?.name}
                  </TableCell>
                  <TableCell align="left">{row?.rating}</TableCell>
                  <TableCell component="th" scope="row">
                    {row?.club}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.id.substr(0, 5)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableScore
