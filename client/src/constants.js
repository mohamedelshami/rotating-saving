const DAIabi = require("./contracts/dai")
const rDAIabi = require("./contracts/rdai")
const RotatingSaving = require("./contracts/RotatingSaving")

//const pardnersABI = JSON.parse(pardnersJSON).abi

const CONTRACTS = {
  dai: {
    abi: DAIabi,
    //kovan_: "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
    //kovan: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
    kovan: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    homestead: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
    mainnet: "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  rdai: {
    abi: rDAIabi,
    kovan_: "0xea718e4602125407fafcb721b7d760ad9652dfe7",
    kovan: "0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB",
    homestead: "0xea8b224eDD3e342DEb514C4176c2E72Bcce6fFF9",
    mainnet: "0x261b45d85ccfeabb11f022eba346ee8d1cd488c0"
  },
  rotatingSaving: {
    abi: RotatingSaving.abi,
    bytecode: RotatingSaving.bytecode,
    mainnet: "0xECb5ba8B0e2c64f4BBaf4f6d1b95ED4968f33a80",
    kovan : "0x934b3Bb9f1f8b077563513669E4cb77c46e7Ae40"
  }
}
module.exports = CONTRACTS
