import Web3 from 'web3';
const provider = window.web3.currentProvider; 
provider.enable(); 
const web3 = new Web3(provider);

const address = '0x22b1ffd17ff0dbaed665f15b6fd5478fb551e0fa';

const abi = [
  {
	"constant": false,
	"inputs": [
		{
			"name": "x",
			"type": "string"
		}
	],
	"name": "sendHash",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
   },
	{
		"constant": true,
		"inputs": [
			{
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "getHash",
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
		"inputs": [],
		"name": "getId",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

export default new web3.eth.Contract(abi, address);