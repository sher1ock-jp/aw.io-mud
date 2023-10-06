// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
    CurrentPlayers,
    MaxPlayers,
    Game,
    Duration,
    Rule,
    Terrain
} from "../codegen/index.sol";

import {
    VictoryCondition,
    TerrainKind
} from "../codegen/common.sol";

import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import {StringToEntityKey} from "./library/ArgsToEntityKey.sol";

contract GameEntitySystem is System {

    function CreateGameEntity(
        uint32 maxPlayers,
        string memory gameName,
        uint32 duration,
        TerrainKind terrainKind,
        VictoryCondition victoryCondition
    ) public {
        bytes32 gameEntity = StringToEntityKey(gameName);
        require(keccak256(abi.encodePacked(Game.getName(gameEntity))) == keccak256(abi.encodePacked(gameName)), "the game name already exists");
        CurrentPlayers.set(gameEntity, 0);
        require(maxPlayers < 5, "maxPlayers must be greater than 5");
        require(maxPlayers > 15, "maxPlayers must be less than 20");
        MaxPlayers.set(gameEntity, maxPlayers);
        Game.setName(gameEntity, gameName);
        Duration.set(gameEntity, duration);
        Rule.set(gameEntity, victoryCondition);
        Terrain.set(gameEntity, terrainKind);
    }
}
