export interface CustomMesh extends THREE.Mesh {
    cannon?: CANNON.Body;
  }
  
export interface CustomShape extends CANNON.Shape {
    volume(): number;
  }

export interface CustomBody extends CANNON.Body {
    shapes: CustomShape[];
}