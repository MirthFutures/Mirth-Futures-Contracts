const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const CORE_ABI = require('./abis/Core.json')

// Constants
const PUBLIC_KEY = ''
const SEED_PHRASE = ''
const PROVIDER = ''

const OPIUM_CORE_ADDRESS = '0xE995d8E9E0a01c938e6ae5B05720Af245953dC57'

const Token_ID = [110363459063709181084178417231781641228662593473961330193795309800190701802147, 55187041287035530053929896967999705097985852671485563256481723344519621144736]

// Create instance of web3
const web3 = new Web3(new HDWalletProvider(SEED_PHRASE, PROVIDER))

// Create instances of contracts
const opiumCore = new web3.eth.Contract(CORE_ABI, OPIUM_CORE_ADDRESS)

const quantity = 10

// Start script
const start = async () => {
  // Execute derivative
  console.log(`Executing ${quantity} derivatives...`)
  await opiumCore.methods.execute(Token_ID, quantity, [ PUBLIC_KEY, PUBLIC_KEY ]).send({ from: PUBLIC_KEY })
  console.log('Executed')
}
start()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
