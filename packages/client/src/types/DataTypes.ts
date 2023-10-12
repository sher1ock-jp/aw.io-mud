export type FoodData = {
    type: 'box' | 'moon' | 'sphere';
    params: number[];
    x: number;
    y: number;
    z: number;
};

export type PlayerData = {
    foodEaten: number;
    id: string;
    nickname: string;
    playersEaten: number;
    qw: number;
    qx: number;
    qy: number;
    qz: number;
    scale: number;
    socketId: string;
    volume: number;
    world: string;
    x: number;
    y: number;
    z: number;
};