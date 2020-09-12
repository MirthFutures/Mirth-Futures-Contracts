/**
 * 
 * @param {object} derivative 
 * @param {string | number} derivative.margin
 * @param {string | number} derivative.endTime
 * @param {(string | number)[]} derivative.params
 * @param {string} derivative.oracleId
 * @param {string} derivative.token
 * @param {string} derivative.syntheticId
 */
module.exports.derivativeFactory = (derivative) => {
  const def = {
    margin: 0,
    endTime: 0,
    params: [],
    oracleId: '0x0000000000000000000000000000000000000000',
    token: '0x0000000000000000000000000000000000000000',
    syntheticId: '0x0000000000000000000000000000000000000000'
  }

  return {
    ...def,
    ...derivative
  }
}
