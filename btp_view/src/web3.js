import Web3 from 'web3';
const provider = window.web3.currentProvider; 
//provider.enable(); 
const web3 = new Web3(provider);
//const web3=new Web3(window.web3.currentProvider);
export default web3;