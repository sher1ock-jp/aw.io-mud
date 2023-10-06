// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
    Game,
    MainObjectKind,
    ObjectAttribution,
    ObjectCollision,
    ObjectCollisionEffect,
    ObjectEffectTime,
    ObjectQuantity,
    ObjectCount
    // ObjectLifeTime,
} from "../codegen/index.sol";
import { 
    MainObject,
    Attribution,
    CollisionDetection,
    CollisionEffect
 } from "../codegen/common.sol";

import {StringToEntityKey} from "./library/ArgsToEntityKey.sol";

import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";

contract ObjectEntitySystem is System {

    function CreateObjectEntity(
        string memory gameName,
        // uint32 lifeTime,
        uint32 effectTime,
        uint32 quantity,
        // enum
        MainObject mainObject,
        Attribution attribution,
        CollisionDetection collisionDetection,
        CollisionEffect collisionEffect
    ) public {
        bytes32 objectEntityKey = getUniqueEntity();
        bytes32 gameEntity = StringToEntityKey(gameName);
        MainObjectKind.set(objectEntityKey, mainObject);
        ObjectAttribution.set(objectEntityKey, attribution);
        ObjectCollision.set(objectEntityKey, collisionDetection);
        ObjectCollisionEffect.set(objectEntityKey, collisionEffect);
        // ObjectLifeTime.set(objectEntityKey, lifeTime);
        ObjectEffectTime.set(objectEntityKey, effectTime);
        ObjectQuantity.set(objectEntityKey, quantity);
        ObjectCount.set(gameEntity,objectEntityKey, 0);
        Game.pushEntity(gameEntity, objectEntityKey);
    }
}
