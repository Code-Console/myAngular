import { galaxyShader } from "src/app/Shaders";
import * as THREE from "three";
export class Galaxy {
  mesh!: THREE.Mesh;
  uniforms = {
    iResolution: { value: new THREE.Vector3(1024, 1024, 1024) },
    iTime: { value: 1.0 },
    iMouse: { value: new THREE.Vector4() },
    uPerspective: { value: 0.1 },
    uViewport: { value: new THREE.Vector4(1, 1, 128, 128) },
    uMaterialColor: { value: new THREE.Vector4(0.1, 1, 1, 1) },
  };

  constructor(scene?: THREE.Scene) {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2048, 1024),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: galaxyShader.vertex,
        fragmentShader: galaxyShader.fragment,
      })
    );
    scene?.add(this.mesh);
    this.mesh.position.set(0,0,-400)
  }
  render() {
    this.uniforms.iTime.value += 0.01;
  }
}
