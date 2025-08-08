declare module "three/examples/jsm/exporters/ColladaExporter.js" {
  import * as THREE from "three";
  export class ColladaExporter {
    parse(input: THREE.Object3D): { data: string; textures?: any[] };
  }
}

declare module "three/examples/jsm/exporters/X3DExporter.js" {
  import * as THREE from "three";
  export class X3DExporter {
    parse(input: THREE.Object3D): string;
  }
}
