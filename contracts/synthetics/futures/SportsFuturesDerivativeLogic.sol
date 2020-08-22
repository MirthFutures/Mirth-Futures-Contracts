pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
import "https://github.com/aragon/zeppelin-solidity/blob/master/contracts/ownership/Ownable.sol";

import "https://github.com/OpiumProtocol/opium-contracts/blob/master/contracts/Interface/IDerivativeLogic.sol";

contract SportsFuturesDerivativeLogic is IDerivativeLogic, Ownable {
  using SafeMath for uint256;

  address private author;
  uint256 private commission;
  unit256 public team;

  constructor() public {
    /*
    {
      "author": "BetSwap",
      "type": "SportsFuture",
      "subtype": null,
      "description": "Futures logic contract"
    }
    */
    emit MetadataSet("{\"author\":\"BetSwap\",\"type\":\"sportsfuture\",\"subtype\":null,\"description\":\"Futures logic contract\"}");

    author = msg.sender;
    commission = 0; // 0.25% of profit

  }

  function validateInput(Derivative memory _derivative) public view returns (bool) {
    return (
      // Derivative
      _derivative.endTime > now &&
      _derivative.margin > 0 && // Derivative Constant Value
      _derivative.params.length == 1 &&
      _derivative.params[0] > 0 // Derivative TeamID
    );
  }

  function getMargin(Derivative memory _derivative) public view returns (uint256 buyerMargin, uint256 sellerMargin) {
    buyerMargin = _derivative.margin;
    sellerMargin = _derivative.margin;
  }

  function getExecutionPayout(Derivative memory _derivative, uint256 _winner) public view returns (uint256 buyerPayout, uint256 sellerPayout) {
    uint256 _derivative.margin;
    uint256 team = _derivative.params[0];
   // Validates winning team is derivative team returned by oracle
    if (team != _winner) {
        buyerPayout = 0;
        sellerPayout = _derivative.margin;
      }
    //Pays out if derivative team is winning team
    else (team = _winner) {
      buyerPayout = _derivative.margin;
      sellerPayout = 0;
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
