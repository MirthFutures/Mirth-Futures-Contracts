pragma solidity 0.5.16;

import "@chainlink/contracts/src/v0.5/dev/AggregatorInterface.sol";
import "@chainlink/contracts/src/v0.5/ChainlinkClient.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "opium-contracts/contracts/Interface/IOracleId.sol";
import "opium-contracts/contracts/OracleAggregator.sol";

contract SportsChainlinkOracleId is ChainlinkClient, IOracleId, Ownable {
  using SafeMath for uint256;

  event Requested(bytes32 indexed queryId, uint256 indexed timestamp);
  event Provided(bytes32 indexed queryId, uint256 indexed timestamp, uint256 result);

  mapping (bytes32 => uint256) public pendingQueries;

  // Opium
  OracleAggregator public oracleAggregator;

  // Chainlink
  AggregatorInterface internal ref;
  uint256 public winner;
  address public oracle;
  bytes32 public jobId;
  uint256 public fee;
  uint256 public team;

  // Governance
  uint256 public EMERGENCY_PERIOD;

  constructor(AggregatorInterface _chainlinkAggregator, OracleAggregator _oracleAggregator, uint256 _emergencyPeriod) public {
    ref = _chainlinkAggregator;
    oracleAggregator = _oracleAggregator;
    team = 0;
    winner = 0;

    setPublicChainlinkToken();
    oracle = 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e;
    jobId = "6d1bfe27e7034b1d87b5270556b17277";
    fee = 0.1 * 10 ** 18; // 0.1 LINK


    EMERGENCY_PERIOD = _emergencyPeriod;
    /*
    {
      "author": "BetSwap",
      "description": "Winner Oracle",
      "asset": "Sports",
      "type": "onchain",
      "source": "chainlink",
      "logic": "none",
      "path": "winner"
    }
    */
    emit MetadataSet("{\"author\":\"BetSwap\",\"description\":\"Winner Oracle\",\"asset\":\"Sports\",\"type\":\"onchain\",\"source\":\"chainlink\",\"logic\":\"none\",\"path\":\"winner()\"}");
  }

  /** OPIUM */
  function fetchData(uint256 _timestamp) external payable {
    require(_timestamp > 0, "Timestamp must be nonzero");

    bytes32 queryId = keccak256(abi.encodePacked(address(this), _timestamp));
    pendingQueries[queryId] = _timestamp;
    emit Requested(queryId, _timestamp);
  }

  function recursivelyFetchData(uint256 _timestamp, uint256 _period, uint256 _times) external payable {
    require(_timestamp > 0, "Timestamp must be nonzero");

    for (uint256 i = 0; i < _times; i++) {
      uint256 moment = _timestamp + _period * i;
      bytes32 queryId = keccak256(abi.encodePacked(address(this), moment));
      pendingQueries[queryId] = moment;
      emit Requested(queryId, moment);
    }
  }

  function calculateFetchPrice() external returns (uint256) {
    return 0;
  }

  function _callback(bytes32 _queryId) public {
    uint256 timestamp = pendingQueries[_queryId];
    require(
      !oracleAggregator.hasData(address(this), timestamp) &&
      timestamp < now,
      "Only when no data and after timestamp allowed"
    );

    uint256 result = winner;
    oracleAggregator.__callback(timestamp, result);

    emit Provided(_queryId, timestamp, result);
  }

  /** CHAINLINK */
  function requestWinner() public returns (bytes32 requestId)
      {
          Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
          // Set the URL to perform the GET request on
          request.add("get", "http://betswap.xyz/api/superbowl");
          // Set the path to find the desired data in the API response, where the response format is:
          // {"winner":1}
          request.add("path", "winner");
          // Sends the request
          return sendChainlinkRequestTo(oracle, request, fee);
      }

  function fulfill(bytes32 _requestId, uint256 _winner) public recordChainlinkFulfillment(_requestId)
  {
      winner = _winner;
    }
  /** GOVERNANCE */
  /**
    Emergency callback allows to push data manually in case EMERGENCY_PERIOD elapsed and no data were provided
   */
   function emergencyCallback(bytes32 _queryId, uint256 _result) public onlyOwner {
     uint256 timestamp = pendingQueries[_queryId];
     require(
       !oracleAggregator.hasData(address(this), timestamp) &&
       timestamp + EMERGENCY_PERIOD  < now,
       "Only when no data and after emergency period allowed"
     );

     oracleAggregator.__callback(timestamp, _result);

     emit Provided(_queryId, timestamp, _result);
   }

   function setEmergencyPeriod(uint256 _emergencyPeriod) public onlyOwner {
     EMERGENCY_PERIOD = _emergencyPeriod;
   }
}
