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

const TableTournaments = ({ classes, currentVersion }) => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Fdb.collection('tournaments')
      .get()
      .then(tournaments => {
        let tempRows = tournaments.docs.filter(t => t.id !== 'not-tournament').map(tournament => {
            const tournamentDt = tournament.data()
            const tournamentDates = {
              dateIni: tournamentDt?.date?.start?.toDate(),
              dateFim: tournamentDt?.date?.end?.toDate(),
            }
            return { ...tournamentDt, ...tournamentDates }
        })
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
      <Table size="small" aria-label="tabela de ratings" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <b>ID</b>
            </TableCell>
            <TableCell align="left">
              <b>Nome</b>
            </TableCell>
            <TableCell align="left">
              <b>Data Ini</b>
            </TableCell>
            <TableCell align="left">
              <b>Data Fim</b>
            </TableCell>
            <TableCell align="left">
              <b>Cidade</b>
            </TableCell>
            <TableCell align="left">
              <b>Organizador</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <CircularProgress />
          ) : (
            rows.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row?.id.substr(0, 5)}
                </TableCell>
                <TableCell align="left">{row?.name}</TableCell>
                <TableCell component="th" scope="row">
                  {row?.dateIni?.toLocaleDateString()}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.dateFim?.toLocaleDateString()}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.city}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row?.org}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableTournaments
