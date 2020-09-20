const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const ORACLE_ABI = require('./abis/SportsChainlinkOracleID.json')

// Constants
const PUBLIC_KEY = ''
const SEED_PHRASE = ''
const PROVIDER = ''

const ORACLE_ID_ADDRESS = '0x60052c097bd2a653aea196fa8e9c378868dc24cb'

// Create instance of web3
const web3 = new Web3(new HDWalletProvider(SEED_PHRASE, PROVIDER))

// Create instances of contracts
const oracle = new web3.eth.Contract(ORACLE_ABI, ORACLE_ID_ADDRESS)

// Start script
const start = async () => {
  console.log(`Requesting Winner....`)
  await oracle.methods.requestWinner().send({ from: PUBLIC_KEY, gas: 8000000})
  console.log('Requested')
}
start()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
