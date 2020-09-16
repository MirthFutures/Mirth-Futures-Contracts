const { accounts, contract, web3 } = require('@openzeppelin/test-environment')
const { assert } = require('chai')

const { derivativeFactory } = require('../../utils/derivatives')

const [ owner ] = accounts

const FutureSyntheticId = contract.fromArtifact('SportsFuturesDerivativeLogic')

describe('FutureSyntheticId', function () {
  before(async () => {
    this.futureLogic = await FutureSyntheticId.new({ from: owner })

  })

  context('validateInput', () => {
    it('margin can\'t be zero', async () => {
      const derivative = derivativeFactory({
        margin: 0,
        endTime: ~~(Date.now() / 1000) + 60, // + 1 min
        params: [
          15
        // team ID,
        ]
      })

      const result = await this.futureLogic.validateInput(derivative)
      assert.notOk(result, 'Margin validation failed')
    })

    it('futurePrice can\'t be zero', async () => {
      const derivative = derivativeFactory({
        margin: 2000,
        endTime: ~~(Date.now() / 1000) + 60, // + 1 min
        params: [
          0 // team ID
        ]
      })

      const result = await this.futureLogic.validateInput(derivative)
      assert.notOk(result, 'futurePrice validation failed')
    })

    it('endTime can\'t be in past', async () => {
      const derivative = derivativeFactory({
        margin: 2000,
        endTime: ~~(Date.now() / 1000) - 60, // - 1 min
        params: [
          15 // team ID

        ]
      })

      const result = await this.futureLogic.validateInput(derivative)
      assert.notOk(result, 'EndTime validation failed')
    })

    it('should correctly validate input', async () => {
      const derivative = derivativeFactory({
        margin: 2000,
        endTime: ~~(Date.now() / 1000) + 60, // + 1 min
        params: [
          15// team ID
        ]
      })

      const result = await this.futureLogic.validateInput(derivative)
      assert.ok(result, 'Validation failed')
    })
  })

  context('getMargin', () => {
    it('should correctly return necessary margin', async () => {
      const currentPrice = 15
      const derivative = derivativeFactory({
        margin: 2000,
        endTime: ~~(Date.now() / 1000) + 60, // + 1 min
        params: [
          15, // team ID
        ]
      })

      const result = await this.futureLogic.getMargin(derivative, { from: owner })
      const buyerMargin = result.buyerMargin.toNumber()
      const sellerMargin = result.sellerMargin.toNumber()

      assert.equal(buyerMargin, derivative.margin, 'Buyer margin is wrong')
      assert.equal(sellerMargin, derivative.margin, 'Seller margin is wrong')
    })
  })

  context('getExecutionPayout', () => {
    it('buyer should receive double margin if currentPrice > futurePrice and profit > margin', async () => {
      const currentPrice = 15
      const derivative = derivativeFactory({
        margin: 1000,
        endTime: ~~(Date.now() / 1000) + 60, // + 1 min
        params: [
          15, // Team ID
        ]
      })

      const result = await this.futureLogic.getExecutionPayout(derivative, currentPrice, { from: owner })

      const buyerPayout = result.buyerPayout.toNumber()
      const sellerPayout = result.sellerPayout.toNumber()

      assert.equal(buyerPayout, 2 * derivative.margin, 'Buyer payout is wrong')
      assert.equal(sellerPayout, 0, 'Seller payout is wrong')
    })

    it('seller should receive double margin if currentPrice <= futurePrice and profit > margin', async () => {
      const currentPrice = 12
      const derivative = derivativeFactory({
        margin: 1000,
        endTime: ~~(Date.now() / 1000) + 60, // + 1 min
        params: [
          15 // team ID

        ]
      })

      const result = await this.futureLogic.getExecutionPayout(derivative, currentPrice, { from: owner })

      const buyerPayout = result.buyerPayout.toNumber()
      const sellerPayout = result.sellerPayout.toNumber()

      assert.equal(buyerPayout, 0, 'Buyer payout is wrong')
      assert.equal(sellerPayout, 2 * derivative.margin, 'Seller payout is wrong')
    })

  })

})
