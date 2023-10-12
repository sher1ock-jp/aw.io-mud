export interface CustomMesh extends THREE.Mesh {
  cannon?: CANNON.Body;
  sprite?: THREE.Sprite;
  nickname?: string;
}

export interface CustomPlayerMesh extends CustomMesh {
  sprite?: THREE.Sprite;
  nickname?: string;
}
