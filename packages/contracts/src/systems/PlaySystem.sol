// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
    MainObjectKind,
    IsPlay,
    PlayerMainEntity,
    PlayerSubEntity,
    BestScore,
    Score,
    PlayerCount,
    MaxPlayers,
    Game,
    ObjectQuantity,
    ObjectUsedQuantity,
    ObjectCoordinate,
    ObjectDrawing,
    ObjectDrawingData,
    ObjectMoveEffect,
    GameProgress,
    ObjectSize,
    ObjectLives,
    ObjectSpeed
} from "../codegen/index.sol";

import {
    MainObject,
    SubObject,
    Progress,
    MoveEffect
} from "../codegen/common.sol";

import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import {StringToEntityKey} from "./library/ArgsToEntityKey.sol";

contract PlaySystem is System {
    function Join(
        string memory gameName,
        bytes32 objectEntity,
        uint32 x,
        uint32 y
    ) public {
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        bytes32 gameEntity = StringToEntityKey(gameName);
        require(IsPlay.get(playerEntity) == true, "the player is playing");
        require(PlayerCount.get(gameEntity) >= MaxPlayers.get(gameEntity), "the game is full");
        require(ObjectUsedQuantity.get(gameEntity, objectEntity) >= ObjectQuantity.get(objectEntity), "the object is not empty");
        PlayerMainEntity.set(playerEntity, objectEntity);
        uint32 objectUsedQuantity = ObjectUsedQuantity.get(gameEntity, objectEntity);
        ObjectUsedQuantity.set(gameEntity, objectEntity, objectUsedQuantity + 1);
        if(MainObjectKind.get(objectEntity) == MainObject.Cell){
            PlayerSubEntity.set(playerEntity, SubObject.SplitCell);
            ObjectCoordinate.set(gameEntity,playerEntity, x, y);
        } else if(MainObjectKind.get(objectEntity) == MainObject.Food || MainObjectKind.get(objectEntity) == MainObject.Virus ) {
            ObjectCoordinate.set(gameEntity,playerEntity, x, y);
        } else {
            PlayerSubEntity.set(playerEntity, SubObject.Territory);
            ObjectCoordinate.set(gameEntity,playerEntity, x, y);
            ObjectDrawing.pushX(gameEntity,playerEntity, x);
            ObjectDrawing.pushY(gameEntity,playerEntity, y);
        }
        Score.set(playerEntity, 0);
        ObjectMoveEffect.set(playerEntity, MoveEffect.Movable);
        ObjectSize.set(playerEntity, 1);
        ObjectLives.set(playerEntity, 1);
        ObjectSpeed.set(playerEntity, 1);
        if (PlayerCount.get(gameEntity) < 5) {
            GameProgress.set(gameEntity, Progress.Waiting);
        }else {
            GameProgress.set(gameEntity, Progress.Started);
        }
        IsPlay.set(playerEntity, true);
    }

    // move object(player)
        // DetectCollision
        // update Size and Speed and lives and effect and score
        // if lives == 0, delete object
        // check Duration and VictoryCondition
    function Dead(
        // string memory gameName,
        // uint32 lives
        // uint32 BestScore
    ) public {
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        
        uint32 score = Score.get(playerEntity);
        // MainObject mainobject = PlayerMainEntity.get(playerEntity);
        // BestScore.set(playerEntity, gameName, mainobject, score);
        
        // not delete / decrease playerCount
        PlayerMainEntity.deleteRecord(playerEntity);
        IsPlay.set(playerEntity, false);
    }

    function End(
        string memory gameName
        // uint32 lives
        // uint32 BestScore
    ) public {
        bytes32 gameEntity = StringToEntityKey(gameName);
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        uint32 score = Score.get(playerEntity);
        // MainObject mainobject = PlayerMainEntity.get(playerEntity);
        // BestScore.set(playerEntity, gameName, mainobject, score);
        PlayerMainEntity.deleteRecord(playerEntity);
        IsPlay.set(playerEntity, false);
        Game.deleteRecord(gameEntity);
    }

    // case: 
    function Move(
        string memory gameName,
        uint32 x,
        uint32 y  
    ) public {
        bytes32 gameEntity = StringToEntityKey(gameName);
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        ObjectCoordinate.set(gameEntity,playerEntity, x, y);
    }

    function Draw(
        string memory gameName,
        uint32 x,
        uint32 y
    ) public {
        bytes32 gameEntity = StringToEntityKey(gameName);
        bytes32 playerEntity = bytes32(uint256(uint160(_msgSender())));
        ObjectDrawing.pushX(gameEntity,playerEntity, x);
        ObjectDrawing.pushY(gameEntity,playerEntity, y);
    }
}
