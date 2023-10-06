// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { 
    MainObject
 } from "../../codegen/common.sol";

function EnumToString(MainObject mainObject) pure returns (string memory) {
    if (mainObject == MainObject.Food) return "Food";
    if (mainObject == MainObject.Cell) return "Cell";
    revert("Unknown mainObject");
}

function StringToEntityKey(string memory args) pure returns (bytes32) {
    bytes32 encodedArgs = keccak256(abi.encodePacked(args));
    return encodedArgs;
} 