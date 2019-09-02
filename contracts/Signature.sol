pragma solidity >=0.4.22 <0.6.0;

// contract sign{
    
//     mapping(int=>string) public signatures;
//     function addSignature(string memory s, int a) public {
//         signatures[a]=s;
//     }
//     function returnSignature(int a) public view returns(string memory){
//         return signatures[a];
//     }
    
    
// }

contract sign{
    int id= 0;
    struct detail{
        int orderId ;
        int chainId;
        string s;
    }
    mapping(int => detail) public signatures;
    function addSignature(string memory s, int a, int b) public {
        id++;
        signatures[id]=detail(a, b, s);
    }
    //a =getid , b= chainid;
    function returnId() public view returns(int) {
        return id;
    }
    
    function returnOrderId(int a) public view returns(int){
        return signatures[a].orderId;
    }
    
    function returnChainId(int a) public view returns(int){
        return signatures[a].chainId;
    }
    
    function returnSignature(int a) public view returns(string memory){
        return signatures[a].s;
    }
    
    
}