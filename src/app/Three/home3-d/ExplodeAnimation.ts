import { particleShader } from "src/app/Shaders";
import * as THREE from "three";
export class ExplodeAnimation {
  movementSpeed = 10;
  totalObjects = 1000;
  objectSize = 10;
  sizeRandomness = 4000;
  colors = [0xff0fff, 0xccff00, 0xff000f, 0x996600, 0xffffff];
  dirs = [];
  parts = [];
  scene!: THREE.Scene;
  object!: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  status = false;
  geometry = new THREE.BufferGeometry();
  positions!: Float32Array;
  velocity!: Float32Array;
  uniforms = {
    color: { value: new THREE.Color(0xffffff) },
    u_time: { value: 0 },
  };
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createExplodeAnimation(0, 0);
  }
  createExplodeAnimation(x: number, y: number) {
    this.positions = new Float32Array(this.totalObjects * 3);
    this.velocity = new Float32Array(this.totalObjects * 3);
    for (let i = 0; i < this.totalObjects; i++) {
      this.positions.set([x, y, 0], i * 3);
      this.velocity.set(
        [
          Math.random() * this.movementSpeed - this.movementSpeed / 2,
          Math.random() * this.movementSpeed - this.movementSpeed / 2,
          Math.random() * this.movementSpeed - this.movementSpeed / 2,
        ],
        i * 3
      );
    }
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.geometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(this.velocity, 3)
    );
    // var material = new THREE.PointsMaterial({
    //   size: this.objectSize,
    //   color: this.colors[Math.round(Math.random() * this.colors.length)],
    // });
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: particleShader.vertex,
      fragmentShader: particleShader.fragment,
      transparent: true,
    });

    this.object = new THREE.Points(this.geometry, material);
    this.scene.add(this.object);
    this.status = false;
  }
  update = () => {
    this.status = true;
    if (this.status == true) {
      for (let i = 0; i < this.totalObjects; i++) {
        this.positions[i] += this.velocity[i];
        if (i % 3 == 1) {
          this.velocity[i] -= 0.1;
        }
      }
      this.geometry.attributes["position"].needsUpdate = true;
    }
    if (window.setKey?.sx > 0) {
      window.setKey.sx = 0;
      this.reset();
    }
  };
  reset(pos?: THREE.Vector3) {
    for (let i = 0; i < this.totalObjects; i++) {
      this.positions[i] = 0;
      this.velocity[i] =
        Math.random() * this.movementSpeed - this.movementSpeed / 2;
    }
    this.geometry.attributes["position"].needsUpdate = true;
    if (pos) this.object.position.copy(pos);
  }
}
