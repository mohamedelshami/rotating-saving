import React from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

let web3             = null
let connected        = false
let connectedAccount = null

async function web3Context() {
   const provider = await detectEthereumProvider()
   if (provider) {
       console.log('MetaMask Provider Detected: ' + provider)
       web3 = new Web3(provider)
       const accounts = await web3.eth.getAccounts()
       console.log(accounts)
       if (accounts.length > 0) {
           global.connected        = true
           connectedAccount = accounts[0]
       }
    }
}

export default web3Context