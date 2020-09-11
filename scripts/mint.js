const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const CORE_ABI = require('./abis/Core.json')
const ERC20_ABI = require('./abis/ERC20.json')

const { derivativeFactory } = require('../test/utils/derivatives')

// Constants
const PUBLIC_KEY = ''
const SEED_PHRASE = ''
const PROVIDER = ''

const OPIUM_CORE_ADDRESS = '0xE995d8E9E0a01c938e6ae5B05720Af245953dC57'
const OPIUM_TOKEN_SPENDER_ADDRESS = '0xE39b9D5dC766102181D4C5Cd7df1691565B52032'
const MARGIN_TOKEN_ADDRESS = '0x0558dc82f203C8c5f5b9033061aa5AdefFC40AF7'

const ORACLE_ID_ADDRESS = '0x0000000000000000000000000000000000000000'
const SYNTHETIC_ID_ADDRESS = '0xc34b9c9DBB39Be0Ef850170127A7b4283484f804'

// Create instance of web3
const web3 = new Web3(new HDWalletProvider(SEED_PHRASE, PROVIDER))

// Create instances of contracts
const opiumCore = new web3.eth.Contract(CORE_ABI, OPIUM_CORE_ADDRESS)
const marginToken = new web3.eth.Contract(ERC20_ABI, MARGIN_TOKEN_ADDRESS)

// Define derivative params

// Using web3.utils.toWei() function to convert number to BigInt with 18 decimals, standard for DAI, won't work for USDC
const margin = web3.utils.toWei('10') // 10 DAI ~ 10e18

const endTime = ~~(Date.now() / 1000) + 10 * 60 // 10 minutes from now

const params = [ 15 ] // Params: [ Team Number ]

const derivative = derivativeFactory({
  margin,
  endTime,
  params,
  oracleId: ORACLE_ID_ADDRESS,
  token: MARGIN_TOKEN_ADDRESS,
  syntheticId: SYNTHETIC_ID_ADDRESS
})

const quantity = 5

// Start script
const start = async () => {
  console.log('Approving Opium.TokenSpender to spend Margin token...')
  // Approve Opium.TokenSpender to spend Margin token (e.g. DAI) infinite amount of tokens
  await marginToken.methods.approve(OPIUM_TOKEN_SPENDER_ADDRESS, 1000)
  console.log('Approved')

  // Mint derivative
  console.log(`Minting ${quantity} derivatives...`)
  await opiumCore.methods.create(derivative, quantity, [ PUBLIC_KEY, PUBLIC_KEY ])
  console.log('Minted')
}
start()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
