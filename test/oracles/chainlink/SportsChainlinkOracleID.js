const { accounts, contract, web3 } = require('@openzeppelin/test-environment')
const { expectRevert } = require('@openzeppelin/test-helpers')
const { assert } = require('chai')

const [ owner ] = accounts

const SportsChainlinkOracleID = contract.fromArtifact('SportsChainlinkOracleID')
const OracleAggregator = contract.fromArtifact('OracleAggregator')

const OpiumOracleAggregator = '0xe1Fd20231512611a5025Dec275464208070B985f'
const EMERGENCY_PERIOD = 60

describe('SportsChainlinkOracleID', function () {
  before(async () => {
    this.oracleId = await SportsChainlinkOracleID.new(OpiumOracleAggregator, EMERGENCY_PERIOD, { from: owner })
    this.oracleAggregator = await OracleAggregator.at(OpiumOracleAggregator)

    this.now = ~~(Date.now() / 1e3) // timestamp now
    this.past = ~~(Date.now() / 1e3) - 60 // timestamp 60 seconds ago

    this.queryId = web3.utils.soliditySha3(this.oracleId.address, this.now)
    this.queryIdPast = web3.utils.soliditySha3(this.oracleId.address, this.past)
  })

  it('should be able to return price from Chainlink', async () => {
    const price = await this.oracleId.requestWinner()

    assert.exists(price, 'Price was not returned correctly')
  })

  it('should request price via Opium OracleAggregator', async () => {
    await this.oracleAggregator.fetchData(this.oracleId.address, this.now)
    const requested = await this.oracleAggregator.dataRequested.call(this.oracleId.address, this.now)
    assert.isTrue(requested, 'Data was not requested')
  })

  it('should provide price from Chainlink to Opium OracleAggregator', async () => {
    await this.oracleId._callback(this.queryId)

    const hasData = await this.oracleAggregator.hasData.call(this.oracleId.address, this.now)
    const data = await this.oracleAggregator.getData.call(this.oracleId.address, this.now)

    assert.isTrue(hasData, 'Data was not provided')
  })

  it('should not allow to call emergencyCallback after data are provided', async () => {
    await expectRevert.unspecified(
      this.oracleId.emergencyCallback(this.queryId, '12345678', { from: owner })
    )
  })

  it('should allow to call emergencyCallback', async () => {
    await this.oracleAggregator.fetchData(this.oracleId.address, this.past)

    const customResult = '12345678'

    await this.oracleId.emergencyCallback(this.queryIdPast, customResult, { from: owner })

    const hasData = await this.oracleAggregator.hasData.call(this.oracleId.address, this.past)
    const data = await this.oracleAggregator.getData.call(this.oracleId.address, this.past)

    assert.isTrue(hasData, 'Data was not provided')
    assert.equal(data.toString(), customResult.toString(), 'Data do not match')
  })
})
