const { expect, BN } = require("@openzeppelin/test-helpers");
const CONTRACTS = require('../client/src/constants')

const gas   = 40000000000
const LIMIT = 6721975

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Rotating Saving Simple Tests..", () => {

  let daiToken
  let rDaiToken
  let rotatingSaving
  let accounts

  async function logBalances() {
    const balance = web3.utils.fromWei(await rotatingSaving.methods.getBalance().call(), "ether")
    const currentPardner = await rotatingSaving.methods.getCurrentPardner().call()
    const poolSize = await rotatingSaving.methods.getPoolSize().call()
    const acct1Balance = await tokenBalance(accounts[0], daiToken)
    const acct2Balance = await tokenBalance(accounts[1], daiToken)
    const poolRDaiBalance = await tokenBalance(CONTRACTS.rotatingSaving.mainnet, rDaiToken)

    console.log("Pool Balance ", balance,
                " Pool Size ", poolSize,
                " Current Pardener ", currentPardner,
                "\nPardener 1 Balance ", await tokenBalance(accounts[0], daiToken),
                "| Pool rDAI Balance ", await tokenBalance(rotatingSaving.options.address, rDaiToken),
                "| Pardener 1 rDAI Balance ", await tokenBalance(accounts[0], rDaiToken))

  }

  async function tokenBalance(account, token){
     return web3.utils.fromWei(await
            token.methods.balanceOf(account).call(), "ether")
  }

  before(async function() {
    console.log("Starting Tests..")

    daiToken = new web3.eth.Contract(CONTRACTS.dai.abi, CONTRACTS.dai.mainnet)
    rDaiToken = new web3.eth.Contract(CONTRACTS.rdai.abi, CONTRACTS.rdai.mainnet)

    accounts = await web3.eth.getAccounts()

    rotatingSaving = await new web3.eth.Contract(CONTRACTS.rotatingSaving.abi)
       .deploy({
           data: CONTRACTS.rotatingSaving.bytecode,
           arguments: [1]
       }).send({ from: accounts[0], gasPrice: gas, gasLimit: LIMIT })
  })

   it("Create new pool", async () => {
      const amount = web3.utils.toWei('1000', 'ether')
      await daiToken.methods.approve(rotatingSaving.options.address, amount).send(
                                                                { from:accounts[0],
                                                                  gasPrice: gas,
                                                                  gasLimit: LIMIT} )

      let tx = await rotatingSaving.methods.joinNewPool(amount).send(
                                                                { from:accounts[0],
                                                                  gasPrice: gas,
                                                                  gasLimit: LIMIT} )
    })

  it("Claim Interest", async () => {
      await rotatingSaving.methods.claimInterest().send( { from: accounts[0],
                                                           gasPrice: gas,
                                                           gasLimit: LIMIT} )

      //await logBalances()
      const balance = web3.utils.fromWei(await rotatingSaving.methods.getBalance().call(), "ether")
      console.log("Pool Balance After Claim Interest: ",  balance)
  })

  it("Withdraw and leave pool", async () => {
      await rotatingSaving.methods.withdraw().send( { from: accounts[0],
                                                      gasPrice: gas,
                                                      gasLimit: LIMIT} )

      await logBalances()
  })

})
