const path = require("path");
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
  development: {
      port: 8545,
      host: "127.0.0.1",
      network_id: "*"
   },
   mainfork: {
      skipDryRun: true,
      host: "127.0.0.1",
      port: 8545,
      network_id: 999,
      provider: () => new HDWalletProvider(
        process.env.ACCOUNT_KEY,
        "http://127.0.0.1:8545",
       ),
    },
   kovan: {
      provider: function() {
           return new HDWalletProvider(process.env.ACCOUNT_KEY,
           process.env.INFURENDPOINT + process.env.INFURA_API_KEY);
      },
      network_id: 42,
      gasPrice: 20000000000, // 20 GWEI
      gas: 3716887 // gas limit, set any number you want
    }
  },
  mocha: {
    timeout: 40000
  },
  compilers: {
      solc: {
       version: "0.6.12",    // Fetch exact version from solc-bin (default: truffle's version)
        // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
        // settings: {          // See the solidity docs for advice about optimization and evmVersion
        //  optimizer: {
        //    enabled: false,
        //    runs: 200
        //  },
        //  evmVersion: "byzantium"
        // }
      }
   }
};
