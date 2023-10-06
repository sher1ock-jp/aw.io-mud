// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  Name,
  Character,
  IsPlay,
  BestScore
} from "../codegen/index.sol";

contract PlayerSettingSystem is System {

  function CreatePlayer(string memory name , string memory character) public {

    bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));

    Name.set(playerEntity, name);
    Character.set(playerEntity, character);
    IsPlay.set(playerEntity, false);
    // Xp.set(playerEntity, 0);
    // Level.set(playerEntity, 0);
  }

  function ChangeName(string memory name) public {
    bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
    Name.set(playerEntity, name);
  }

  function ChangeCharacter(string memory character) public {
    bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
    Character.set(playerEntity, character);
  }

}
