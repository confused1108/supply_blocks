import Web3 from 'web3';
const provider = window.web3.currentProvider; 
provider.enable(); 
const web3 = new Web3(provider);

const address = '0x3daa3a249b9f17c1086afe051390b4ca6a7924fe';

const abi = [
{
	"constant": false,
	"inputs": [
		{
			"name": "s",
			"type": "string"
		},
		{
			"name": "a",
			"type": "int256"
		},
		{
			"name": "b",
			"type": "int256"
		}
	],
	"name": "addSignature",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"constant": true,
	"inputs": [
		{
			"name": "a",
			"type": "int256"
		}
	],
	"name": "returnChainId",
	"outputs": [
		{
			"name": "",
			"type": "int256"
		}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
},
{
	"constant": true,
	"inputs": [],
	"name": "returnId",
	"outputs": [
		{
			"name": "",
			"type": "int256"
		}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
},
{
	"constant": true,
	"inputs": [
		{
			"name": "a",
			"type": "int256"
		}
	],
	"name": "returnOrderId",
	"outputs": [
		{
			"name": "",
			"type": "int256"
		}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
},
{
	"constant": true,
	"inputs": [
		{
			"name": "a",
			"type": "int256"
		}
	],
	"name": "returnSignature",
	"outputs": [
		{
			"name": "",
			"type": "string"
		}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
},
{
	"constant": true,
	"inputs": [
		{
			"name": "",
			"type": "int256"
		}
	],
	"name": "signatures",
	"outputs": [
		{
			"name": "orderId",
			"type": "int256"
		},
		{
			"name": "chainId",
			"type": "int256"
		},
		{
			"name": "s",
			"type": "string"
		}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
 }
]

export default new web3.eth.Contract(abi, address);