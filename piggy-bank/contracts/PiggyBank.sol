// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

///
/// @title 
/// @dev 
///
contract PiggyBank is ERC721, Ownable, ReentrancyGuard {

  using Strings for uint256;
  uint public initialDeposit = 0.005 ether;
  string private _baseTokenURI; 
  uint public tipJar;

  event Withdrawn(string message, uint tokenId);

  struct Account {
    uint readyTime;
    uint accountBalances;
  }

  Account[] private accounts;

  constructor() ERC721("PiggyBank","PIG"){}

  function setInitialDeposit(uint _initial) external onlyOwner {
    initialDeposit = _initial;
  }

  function formingDiamondHands(uint _readyTime) external payable {
    require(_readyTime > block.timestamp, "Choose a date in the future");
    require(msg.value >= initialDeposit, "Opening deposit required");
    accounts.push(Account(_readyTime, msg.value));
    uint tokenId = accounts.length - 1;
    _safeMint(msg.sender, tokenId);
    tokenURI(tokenId);
  }

  function _tokenExists(uint256 tokenId) internal view returns (bool) {
    return tokenId < accounts.length;
  }

  function deposit(uint _tokenId) external payable {
    require (_tokenExists(_tokenId), "Token does not exist. Check token id");
    accounts[_tokenId].accountBalances += msg.value;
  }

  function withdraw(uint _tokenId) external nonReentrant {
    address theOwner = ownerOf(_tokenId);
    require(theOwner == msg.sender, "You do not own this token ");
    require(block.timestamp >= accounts[_tokenId].readyTime, "Eth is still locked. Try again later");
    require(accounts[_tokenId].accountBalances > 0, "There is no Eth in here");
    uint amount = accounts[_tokenId].accountBalances;
    payable(theOwner).transfer(amount);
    accounts[_tokenId].accountBalances -= amount;
    emit Withdrawn("Withdraw successful", _tokenId);
  }
  
  function getAccountBalance(uint _tokenId) external view returns (uint) {
    require (_tokenExists(_tokenId), "Token does not exist. Check token id");
    return accounts[_tokenId].accountBalances;
  }

  function getReadyTime(uint _tokenId) external view returns (uint) {
    require (_tokenExists(_tokenId), "Token does not exist. Check token id");
    return accounts[_tokenId].readyTime;
  }

  // metadata URI
   
  function _baseURI() internal view virtual override returns(string memory) {
    return _baseTokenURI;
  }
  
  function setBaseURI(string calldata baseURI) external onlyOwner {
    _baseTokenURI = baseURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    string memory baseURI = _baseURI();
    return bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI, tokenId.toString()))
        : "";   
  }

  //List of Accounts by Owner Array
  function getAccountsByOwner(address _owner) external view returns(uint[] memory){
    uint number = balanceOf(_owner);
    uint [] memory result = new uint[](number);
    uint counter = 0;
    for (uint i = 0; i < accounts.length; i++) {
      if(ownerOf(i) == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function totalSupply() public view returns (uint256) {
    return accounts.length;
  }
}
