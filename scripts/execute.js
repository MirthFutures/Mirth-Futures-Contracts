const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const CORE_ABI = require('./abis/Core.json')
const ERC20_ABI = require('./abis/ERC20.json')

const { derivativeFactory } = require('./utils/derivatives')
// Constants
const PUBLIC_KEY = ''
const SEED_PHRASE = ''
const PROVIDER = ''

const OPIUM_CORE_ADDRESS = '0xE995d8E9E0a01c938e6ae5B05720Af245953dC57'
const OPIUM_TOKEN_SPENDER_ADDRESS = '0xE39b9D5dC766102181D4C5Cd7df1691565B52032'
const MARGIN_TOKEN_ADDRESS = '0x0558dc82f203C8c5f5b9033061aa5AdefFC40AF7'
const tokenIds = ['33407272437444913482602580612601528193033053424995970071626926685056001637441', '46351917593465080552006059268398127402622384511764645862039246940722624725581']


const ORACLE_ID_ADDRESS = '0x60052c097bd2a653aea196fa8e9c378868dc24cb'
const SYNTHETIC_ID_ADDRESS = '0xB84486eA8B34C65cD3bf3DeeB6990AA0a27a2EaF'

// Create instance of web3
const web3 = new Web3(new HDWalletProvider(SEED_PHRASE, PROVIDER))

// Create instances of contracts
const opiumCore = new web3.eth.Contract(CORE_ABI, OPIUM_CORE_ADDRESS)

// Define derivative params
const derivative = derivativeFactory({
  margin: '10000000000000000000',
  endTime: 1600581000,
  params: [ 15 ],
  oracleId: '0x60052c097bd2a653aea196fa8e9c378868dc24cb',
  token: '0x0558dc82f203C8c5f5b9033061aa5AdefFC40AF7',
  syntheticId: '0xB84486eA8B34C65cD3bf3DeeB6990AA0a27a2EaF'
})

const quantity = 10

// Start script
const start = async () => {
//execute derivative
  console.log(`Executing ${quantity} derivatives...`)
  await opiumCore.methods.execute(tokenIds, [quantity, quantity], [derivative, derivative]).send({ from: PUBLIC_KEY, gas: 8000000 })
  console.log('Executed')
}
start()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
