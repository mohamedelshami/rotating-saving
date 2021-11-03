import React from 'react';

import { Grid, Typography } from '@material-ui/core'

import { Table, TableBody,
        TableCell, TableHead,
        TableRow } from '@material-ui/core'

const CONTRACTS = require("./constants")

// Generate Order Data
function createData(id, name, currentPardner, balance, poolSize) {
  return { id, name, currentPardner, balance, poolSize };
}

export default function Pools(props) {

  const [state, setState] = React.useState({rows: []})

   React.useEffect( () => {
      const getHats = async () => {
         if (props.web3) {
           const rdaiToken = new props.web3.eth.Contract(CONTRACTS.rdai.abi, CONTRACTS.rdai.mainnet)
           const daiToken = new props.web3.eth.Contract(CONTRACTS.dai.abi, CONTRACTS.dai.mainnet)
           const rotatingSaving = new props.web3.eth.Contract(CONTRACTS.rotatingSaving.abi,
                                                               CONTRACTS.rotatingSaving.mainnet)

           const balance = await rotatingSaving.methods.getBalance().call()
           const currentPardner = await rotatingSaving.methods.getCurrentPardener().call()
           const poolSize = await rotatingSaving.methods.getPoolSize().call()

           const rows = []
           rows.push(createData(0, 0, currentPardner, props.web3.utils.fromWei(balance, "ether"), poolSize ))
           setState({rows})
         }
      }
     getHats()
  }, [props.web3, props.connectedAccount] )

  return (
   <React.Fragment>
     <Grid container direction="column">
      <br/>
      <Grid item >
          <Typography>Saving Pools</Typography>
      </Grid>
     </Grid>
     <Table size="small">
         <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Current Pardner</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Pool Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.currentPardner}</TableCell>
                  <TableCell>{row.balance}</TableCell>
                  <TableCell>{row.poolSize}</TableCell>
                </TableRow>
              ))}
            </TableBody>
       </Table>
    </React.Fragment>
  );
}