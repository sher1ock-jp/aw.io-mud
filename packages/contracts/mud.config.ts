import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {

    //
    // common component
    //

    Name: "string", // player name and object name and effect name
    Score: "uint32", // player score and team score and object socre in a game

    //
    // player component
    //
    Character: "string",
    IsPlay: "bool",
    PlayerMainEntity: "bytes32",
    PlayerSubEntity: "SubObject",
    BestScore: {
      keySchema: {
        player: "bytes32",
      },
      valueSchema: {
        score: "uint32",
        mainObjectKind: "MainObject",
        gameName: "string",
      },
    },
    // Xp: "uint32", 
    // Level: "uint32", 
    // Qualification: "bool", // for add game object
    
    //
    // game component
    //
    PlayerCount: "uint32", 
    MaxPlayers: "uint32", // fiexed 10

    Game: {
      valueSchema: {
        name: "string",
        entity: "bytes32[]",
      },
    },
    Duration: "uint32",
    Rule: "VictoryCondition",
    Terrain: "TerrainKind",

    // fixed when create Entity
    MainObjectKind: "MainObject",
    ObjectAttribution: "Attribution",
    ObjectCollision: "CollisionDetection",
    ObjectCollisionEffect: "CollisionEffect",
    // ObjectLifeTime: "uint32",
    ObjectEffectTime: "uint32",
    ObjectQuantity: "uint32",
    ObjectUsedQuantity: {
      keySchema: {
        gameName: "bytes32",
        entity: "bytes32",
      },
      valueSchema: {
        count: "uint32",
      },
    },
    ObjectCoordinate: {
      keySchema: {
        gameName: "bytes32",
        player: "bytes32",
      },
      valueSchema: {
        x: "uint32",
        y: "uint32",
      },
    },
    ObjectDrawing: {
      keySchema: {
        gameName: "bytes32",
        player: "bytes32",
      },
      valueSchema: {
        x: "uint32[]",
        y: "uint32[]",
      },
    },
    // changing in game
    GameProgress: "Progress",
    ObjectMoveEffect: "MoveEffect",
    ObjectSize: "uint32",
    ObjectLives: "uint32",
    ObjectSpeed: "uint32",
    
    // TeamId: "uint32", //nextscope
    
  },

  enums: {
    // Gamemode: ["Solo", "Team"],
    VictoryCondition: ["LastManStanding", "MostPoints", "MostTeritory"],
    TerrainKind: ["Square","Flat"],
    MainObject: ["Cell","Food","Virus","Trail"],
    SubObject: ["SplitCell","Territory"],
    Attribution: ["Movable", "Immovable"],
    CollisionDetection: ["NoCollision", "PartialOverlap", "FullOverlap", "Crossing", "Touching"],
    CollisionEffect:["GainLives","LoseLives","GainPoints", "LosePoints","SpeedUp", "SpeedDown","Absorb", "Stun"],
    
    MoveEffect: ["Movable", "Stunned", "Expanding", "Splitting"],
    Progress: ["Waiting", "Started", "Dead","Finished"],
  },

  modules: [
    {
      name: "UniqueEntityModule",
      root: true,
      args: [],
    },
  ],

});
