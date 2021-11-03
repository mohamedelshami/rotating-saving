// SPDX-License-Identifier: Apache
pragma solidity >=0.6.0 <0.7.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {rToken} from "./rToken.sol";

contract RotatingSaving {

  rToken public constant rDAI = rToken(0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0);
  IERC20 public constant token = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

  uint256 MAX_PARTICIPANTS = 20;

  enum Status {
    UNDEFINED,
    ACTIVE,
    COMPLETED,
    PASS
  }

  struct Pardner {
    Status status;
    address addr;
    uint256 principal;
    uint256 position;
  }

  mapping (address => Pardner) pardnersPool;

  bool initialized;
  uint256 currentHatID;
  address operator;
  address beneficiary;

  address [] pardners;
  uint256 currentPardner;

  uint256 minPoolPrincipal;
  uint256 epochStartTime;
  uint256 rotationPeriod;

  event NewPool(address indexed sender, uint256 hatID);

  constructor(uint256 period) public {
    initialized = false;
    currentPardner = 0;
    currentHatID   = 0;
    rotationPeriod = period * 1 seconds;
  }

  /*
  *
  * Who ever creates the pool becomes the first beneficiary of the pool and the first to accrue
  * interest.
  *
  */
  function joinNewPool(uint256 principal) external returns(bool) {
    if (initialized == true) {
      return false;
    }
    beneficiary = operator = address(msg.sender);
    minPoolPrincipal = principal;

    token.approve(address(rDAI), minPoolPrincipal * MAX_PARTICIPANTS); // Give rDAI enough allowance to cover pool size
    token.transferFrom(msg.sender, address(this), minPoolPrincipal);
    selectHat(minPoolPrincipal, false);

    pardners.push(beneficiary);
    pardnersPool[msg.sender] = Pardner(Status.ACTIVE,
                                       msg.sender,
                                       principal,
                                       0);
    epochStartTime = now;
    uint256 poolID = 0;
    initialized    = true;

    emit NewPool(beneficiary, poolID);

    return true;
  }

  /*
  * Join an existing pool creates a hat for the existing beneficiary and takes the next place in the rota
  */
  function joinPool(uint256 principal) external returns(bool) {
    require(pardnersPool[msg.sender].status == Status.UNDEFINED, "Account address already in the pool");
    require(principal >= minPoolPrincipal, "Minimum Principal Amount Required to Join the Pool");
    require(pardners.length < MAX_PARTICIPANTS);

    token.transferFrom(msg.sender, address(this), principal);
    selectHat(principal, false);

    pardners.push(msg.sender);
    pardnersPool[msg.sender] = Pardner(Status.ACTIVE,
                                        msg.sender,
                                        principal,
                                        pardners.length - 1);
    return true;
  }

  function claimInterest() external returns(bool) {
    require(rDAI.payInterest(beneficiary), "Interest not paid");
    if(now > epochStartTime + rotationPeriod) {
      currentPardner = (currentPardner + 1) % pardners.length;
      beneficiary = pardners[currentPardner];
      require(selectHat(0, true), "Hat selection failed.");
      epochStartTime = now;
    }
    return true;
  }

  function withdraw() external returns(bool) {
    require(pardnersPool[msg.sender].status == Status.ACTIVE);
    //todo: additional time/cycle lock condition
    pardnersPool[msg.sender].status = Status.COMPLETED;
    rDAI.redeemAndTransfer(msg.sender,pardnersPool[msg.sender].principal);
    pardnersPool[msg.sender].principal = 0;
    removePardner( pardnersPool[msg.sender].position );
    if (pardners.length > 0){
      currentPardner = (currentPardner + 1) % pardners.length;
    }
    //token.transferFrom(address(this), msg.sender, pardnersPool[msg.sender].principal);
    //balance = balance - token.balanceOf(address(this));
    return true;
  }

 function removePardner(uint idx) private {
    if (pardners.length == 1) {
      pardners.pop();
      return;
    }

    for (uint i = idx; i<pardners.length - 1; i++){
      pardnersPool[pardners[i]].position = i - 1;
      pardners[i] = pardners[i + 1];
    }

    pardners.pop();
  }

  function selectHat(uint256 _principal, bool rotate) private returns(bool) {
    address [] memory participants = new address[](1);
    uint32 [] memory proportions = new uint32[](1);
    participants[0] = beneficiary;
    proportions[0]  = 100;

    if (rotate){
      uint256 oldHatID = currentHatID;
      currentHatID = rDAI.createHat(participants, proportions, true);
      return (oldHatID != currentHatID);
    }

    if (currentHatID == 0) {
      bool done = rDAI.mintWithNewHat(_principal, participants, proportions);
      (currentHatID,,) = rDAI.getHatByAddress(address(this));
      return done;
    } else {
      return rDAI.mintWithSelectedHat(_principal, currentHatID);
    }
  }

  function getCurrentPardner() public view returns(address) {
    if (pardners.length > 0){
      return pardners[currentPardner];
    }
    return address(0);
  }

  function getBalance() public view returns(uint256) {
    return rDAI.balanceOf(address(this));
  }

  function getPoolSize() public view returns(uint) {
    return pardners.length;
  }

}
