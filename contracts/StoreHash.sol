pragma solidity ^0.5.1;
contract Contract {
 string ipfsHash;
 
 string[] myHash;
 uint id=0;
 function sendHash(string memory x) public {
   myHash.push(x);
   id++;
 }
 function getId () public view returns (uint) {
     return id-1;
 }
 function getHash(uint i) public view returns (string memory) {
   return myHash[i];
 }
}

