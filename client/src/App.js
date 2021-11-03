import React from 'react'

import { Button, Link, Typography, Paper, Grid } from '@material-ui/core'

import TopBar from './TopBar'
import Pools from './Pools'

import { Route, Switch } from "react-router-dom"

import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

const CONTRACTS = require("./constants")

const gas   = 40000000000
const LIMIT = 6721975

function Footer() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        DeFi Labs
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {
  const [state, setState] = React.useState({connected: false,
                                            connectedAccount: null,
                                            web3:      null,
                                            rdaiToken: null,
                                            daiToken: null,
                                            daiBalance: 0,
                                            rDAIBalance: 0})
  React.useEffect( () => {
      async function initWeb3() {
        const provider = await detectEthereumProvider()
        if (provider) {
           console.log('MetaMask Provider Detected: ' + provider)
           const web3 = new Web3(provider)
           const accounts = await web3.eth.getAccounts()

           const rdaiToken = new web3.eth.Contract(CONTRACTS.rdai.abi, CONTRACTS.rdai.mainnet)
           const daiToken = new web3.eth.Contract(CONTRACTS.dai.abi, CONTRACTS.dai.mainnet)

           if (accounts.length > 0) {
              const daiBalance = web3.utils.fromWei(await daiToken.methods.balanceOf(accounts[0]).call(), "ether")
              const rdaiBalance = web3.utils.fromWei(
                      await rdaiToken.methods.balanceOf(CONTRACTS.rotatingSaving.mainnet).call(), "ether")
              setState( { connected:true,
                          connectedAccount: accounts[0],
                          web3,
                          rdaiToken,
                          daiToken,
                          daiBalance,
                          rdaiBalance})
           }
         }
      }
      initWeb3()
  }, [])

   const handleNewPool = async (event) => {
        const rotatingSaving = new state.web3.eth.Contract(CONTRACTS.rotatingSaving.abi,
                                                    CONTRACTS.rotatingSaving.mainnet)

        const amount = state.web3.utils.toWei('1000', 'ether')

        if (amount > await state.daiToken.methods.allowance(state.connectedAccount,
           CONTRACTS.rotatingSaving.mainnet).call()) {
           await state.daiToken.methods.approve(CONTRACTS.rotatingSaving.mainnet, amount).send(
                                                                        { from:state.connectedAccount,
                                                                          gasPrice: gas,
                                                                          gasLimit: LIMIT} )

        }

        let tx = await rotatingSaving.methods.joinNewPool(amount).send( { from:state.connectedAccount,
                                                                          gasPrice: gas,
                                                                          gasLimit: LIMIT} )

        let hatId = await state.rdaiToken.methods.getHatByAddress(CONTRACTS.rotatingSaving.mainnet).call()
        console.log("Pool successfully created", hatId)
     }

     const handleJoinPool = async (event) => {
        const rotatingSaving = new state.web3.eth.Contract(CONTRACTS.rotatingSaving.abi,
                                                            CONTRACTS.rotatingSaving.mainnet)

        const amount = state.web3.utils.toWei('1000', 'ether')

        if (amount > await state.daiToken.methods.allowance(state.connectedAccount,
              CONTRACTS.rotatingSaving.mainnet).call()) {
                 console.log("Approve DAI spending for " + state.connectedAccount)
                 await state.daiToken.methods.approve(CONTRACTS.rotatingSaving.mainnet, amount).send(
                                                                                { from:state.connectedAccount,
                                                                                  gasPrice: gas,
                                                                                  gasLimit: LIMIT} )

             }

        let tx = await rotatingSaving.methods.joinPool(amount).send( {from:state.connectedAccount,
                                                                 gasPrice: gas,
                                                                 gasLimit: LIMIT} )

   }

   const handleClaimInterest = async (event) => {
         const rotatingSaving = new state.web3.eth.Contract(CONTRACTS.rotatingSaving.abi,
                                                              CONTRACTS.rotatingSaving.mainnet)

         let tx = await rotatingSaving.methods.claimInterest().send( {from:state.connectedAccount,
                                                                    gasPrice: gas,
                                                                   gasLimit: LIMIT} )

         console.log("Current Pardener", await rotatingSaving.methods.getCurrentPardener().call())
   }

  return (
    <Paper>
     <Grid container direction="row">
        <TopBar connected={state.connected} connectedAccount={state.connectedAccount} />
        <Grid container direction="row">
          <br />
           <Button color="inherit"  onClick={handleNewPool}>
              New Pool
           </Button>
           <Button color="inherit" onClick={handleJoinPool}>
              Join Pool
           </Button>
           <Button color="inherit" onClick={handleClaimInterest}>
              Claim Interest
           </Button>
        </Grid>
        <Grid container direction="column">
           <br />
           <Typography fontWeight="fontWeightRegular">
              DAI Balance: {state.daiBalance}
           </Typography>
           <Typography fontWeight="fontWeightRegular">
              rDAI Balance: {state.rdaiBalance}
           </Typography>
        </Grid>
        <Switch>
          <Route path ="/pool">
          </Route >
          <Route path="/">
            <Pools web3={state.web3} connectedAccount={state.connectedAccount} />
         </Route>
       </Switch>
      </Grid>
    <Footer/>
   </Paper>
  );
}

export default App;