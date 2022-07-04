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

const TableHistory = ({ classes, currentVersion }) => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Fdb.collection('games')
      .limit(21)
      .get()
      .then(async games => {
        let tempRows = await Promise.all(
          games.docs.map(async game => {
            const gameDt = game.data()
            const { players, tournament } = gameDt
            const black = await players.black.ref.get()
            const white = await players.white.ref.get()
            const trnment = await tournament.get()
            const plyrs = {
              black: { ...players.black, ...black.data() },
              white: { ...players.white, ...white.data() },
            }
            return {
              ...gameDt,
              date: gameDt?.date.toDate(),
              players: plyrs,
              tournament: trnment.data(),
            }
          })
        )
        setRows(
          tempRows.sort((a, b) => {
            return b.date - a.date
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
      <Table size="small" aria-label="tabela de jogos" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <b>Data</b>
            </TableCell>
            <TableCell align="left">
              <b>Brancas</b>
            </TableCell>
            <TableCell align="left">
              <b>Pretas</b>
            </TableCell>
            <TableCell align="left">
              <b>Resultado</b>
            </TableCell>
            <TableCell align="left">
              <b>Modo de jogo</b>
            </TableCell>
            <TableCell align="left">
              <b>ID Torneio</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <CircularProgress />
          ) : (
            rows.map(row => (
              <TableRow key={Math.random()}>
                <TableCell component="th" scope="row">
                  {row?.date?.toLocaleDateString()}
                </TableCell>
                <TableCell align="left">
                  {row?.players?.white?.name} {row?.players?.white?.ratingATM}
                </TableCell>
                <TableCell align="left">
                  {row?.players?.black?.name} {row?.players?.black?.ratingATM}
                </TableCell>
                <TableCell align="left">{row?.result}</TableCell>
                <TableCell align="left">{row?.tournament.name}</TableCell>
                <TableCell align="left">{row?.tournament.id.substr(0, 5)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableHistory
