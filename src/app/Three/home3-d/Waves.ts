import { wavesShader } from "src/app/Shaders";
import * as THREE from "three";
const s = 0.05;
const SEPARATION = 100 * s,
  AMOUNTX = 50,
  AMOUNTY = 50;
export class Waves {
  particles!: THREE.Points;
  count = 0;
  positions!: Float32Array;
  scales!: Float32Array;
  constructor() {
    console.log("Waves");
    this.createWave();
  }
  uniforms = {
    color: { value: new THREE.Color(0xffffff) },
    u_time: { value: 0 },
  };
  createWave() {
    const numParticles = AMOUNTX * AMOUNTY;
    this.positions = new Float32Array(numParticles * 3);
    this.scales = new Float32Array(numParticles);
    let i = 0,
      j = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        //this.positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
        this.positions[i] =
          ix * SEPARATION * (AMOUNTY - iy) * (i % 2 == 0 ? 0.05 : -0.05);
        this.positions[i + 1] = 0; // y
        this.positions[i + 2] =
          Math.floor(iy / 2) * SEPARATION * 2 - (AMOUNTY * SEPARATION) / 2; // z

        this.scales[j] = 2;

        i += 3;
        j++;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    geometry.setAttribute("scale", new THREE.BufferAttribute(this.scales, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: wavesShader.vertex,
      fragmentShader: wavesShader.fragment,
    });

    //

    this.particles = new THREE.Points(geometry, material);
    return this.particles;
  }
  render() {
    let i = 0,
      j = 0;
    this.uniforms.u_time.value++;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        this.positions[i + 1] =
          Math.sin((ix + this.count) * 0.3) * SEPARATION * 0.1 +
          Math.sin((iy + this.count) * 0.3) * SEPARATION * 0.3;

        this.scales[j] =
          (Math.sin((ix + this.count) * 0.3) + 1) * 1 +
          (Math.sin((iy + this.count) * 0.5) + 1) * 1;

        i += 3;
        j++;
      }
    }
    this.particles.geometry.attributes["position"].needsUpdate = true;
    this.particles.geometry.attributes["scale"].needsUpdate = true;
    this.count += 0.1;
    this.particles.position.set(0, -50, -120);
  }
}
