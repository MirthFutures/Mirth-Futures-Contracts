pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
import "https://github.com/aragon/zeppelin-solidity/blob/master/contracts/ownership/Ownable.sol";

import "https://github.com/OpiumProtocol/opium-contracts/blob/master/contracts/Interface/IDerivativeLogic.sol";

contract MLBFuturesDerivativeLogic is IDerivativeLogic, Ownable {
  using SafeMath for uint256;

  address private author;
  uint256 private commission;

  bytes32 [] public team;


  constructor() public {
    /*
    {
      "author": "Opium.Team",
      "type": "future",
      "subtype": null,
      "description": "Future logic contract"
    }
    */
    emit MetadataSet("{\"author\":\"Opium.Team\",\"type\":\"future\",\"subtype\":null,\"description\":\"Future logic contract\"}");

    author = msg.sender;
    commission = 0; // 0.25% of profit
    team = _team
  }

  // params[0] - Future price

  function validateInput(Derivative memory _derivative) public view returns (bool) {
    return (
      // Derivative
      _derivative.endTime > now &&
      _derivative.margin > 0 && // Derivative Constant Value
      _derivative.params.length == 2 &&

      _derivative.params[0] = _team && // Derivative Team
      _derivative.params[1] = _result  // isWinner = true or false (bool)
    );
  }

  function getMargin(Derivative memory _derivative) public view returns (uint256 buyerMargin, uint256 sellerMargin) {
    buyerMargin = _derivative.margin;
    sellerMargin = _derivative.margin;
  }

  function getTeam(Derivative memory _derivative) public view returns (bool _team)
      if (team = _team) {
        return _team = bool;
      }

  function getExecutionPayout(Derivative memory _derivative, bool _isWinner, bool _team) public view returns (uint256 buyerPayout, uint256 sellerPayout) {
    uint256 profit;

    bool _team = _derivative.params[0];
    bool _isWinner = _derivative.params[1];
// Validates derivative team is team returned by oracle
    if (_team = true) {
// Validates if dervative team is winning team
      if (_result = true) {
        buyerPayout = _derivative.margin.add(profit);
        sellerPayout = _derivative.margin.sub(profit);
      }
      //Pays out if derivative team is not winning team
    else (_team != true){
      buyerPayout = _derivative.margin.add(profit);
      sellerPayout = _derivative.margin.sub(profit);
    }
  }

  /** COMMISSION */
  /// @notice Getter for syntheticId author address
  /// @return address syntheticId author address
  function getAuthorAddress() public view returns (address) {
    return author;
  }

  /// @notice Getter for syntheticId author commission
  /// @return uint26 syntheticId author commission
  function getAuthorCommission() public view returns (uint256) {
    return commission;
  }

  /** POOL */
  function isPool() public view returns (bool) {
    return false;
  }

  /** THIRDPARTY EXECUTION */
  function thirdpartyExecutionAllowed(address derivativeOwner) public view returns (bool) {
    derivativeOwner;
    return true;
  }

  function allowThirdpartyExecution(bool allow) public {
    allow;
  }

  /** GOVERNANCE */
  function setAuthorAddress(address _author) public onlyOwner {
    require(_author != address(0), "Can't set to zero address");
    author = _author;
  }

  function setAuthorCommission(uint256 _commission) public onlyOwner {
    commission = _commission;
  }
}
