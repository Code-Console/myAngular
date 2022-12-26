import { woodenBowFBX } from "src/app/assets";
import * as THREE from "three";
import { Mesh } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class Bow {
  mixer!: THREE.AnimationMixer;
  scene!: THREE.Scene;
  action!: THREE.AnimationAction;
  arrow!: THREE.Group;
  arrowFire!: THREE.Group;
  counter = 0;
  bow = new THREE.Group();
  position = new THREE.Vector3(0, 0, -120);
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    const fBXLoader = new FBXLoader();
    fBXLoader.load(woodenBowFBX, (object) => {
      this.mixer = new THREE.AnimationMixer(object);

      this.action = this.mixer.clipAction(object.animations[0]);
      this.action.play();
      this.action.weight = 1;
      this.action.repetitions = 1;
      this.action.setDuration(1);
      this.bow.add(object);
      this.createArrow();
    });
  }
  createArrow() {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 72, 32, 32),
      new THREE.MeshBasicMaterial()
    );
    mesh.rotation.set(0, 0, Math.PI * 0.5);
    const maxX = 3,
      maxY = 4;
    const triangleShape = new THREE.Shape()
      .moveTo(-maxX, -maxY)
      .lineTo(maxX, -maxY)
      .lineTo(0, maxY)
      .lineTo(-maxX, -maxY); // close path
    const extrudeSettings = {
      depth: 1,
    };
    const geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

    const pMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    pMesh.position.set(0, 40, 0);
    mesh.add(pMesh);

    this.arrow = new THREE.Group();
    this.arrow.add(mesh);
    this.arrow.position.set(-48, 30, 0);
    this.arrow.name = "Arrow";
    this.arrowFire = this.arrow.clone();
    this.bow.add(this.arrow);
    this.scene.add(this.bow);
    this.scene.add(this.arrowFire);
    this.arrowFire.name = "arrowFire";

    console.log(this.arrowFire, this.arrow);
    // this.bow.position.set(0, 0, -120);
    //-48,8
  }
  power = (x: number) => x * x * 1.3;
  render(delta: number) {
    const k = window.setKey;
    if (!this.arrow) return;
    if (this.mixer) {
      this.mixer.update(delta);
    }
    this.counter++;
    if (this.action.time < 0.25) {
      this.arrow.position.x = -48 + this.power(this.action.time) * 280;
    } else if (this.action.time < 0.33) {
      this.arrow.position.x =
        -48 + this.power(this.action.time * (0.8 + this.action.time)) * 280;
    } else if (this.action.time < 0.35) {
      this.arrow.position.x = -40 + this.power(this.action.time) * 280;
    } else if (this.action.time < 0.37) {
      this.arrow.position.x =
        -48 +
        this.power(this.action.time * (0.8 + this.action.time * 0.75)) * 280;
    } else if (this.action.time > 0.47) {
      this.arrow.position.x = 162 - this.power(this.action.time * 1.4) * 280;
    }
    if (this.action.time > 0.595) {
      // this.action.reset();
    }

    if (this.action.time > 0.595) {
      this.arrowFire.translateX(-10);
      this.arrowFire.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.003);
      this.arrow.visible = false;
    } else {
      const rot = new THREE.Quaternion();
      this.arrow.getWorldQuaternion(rot);
      const pos = new THREE.Vector3();
      this.arrow.getWorldPosition(pos);
      this.arrowFire.position.set(pos.x, pos.y, pos.z);
      this.arrowFire.quaternion.copy(rot);
      this.arrow.visible = true;
    }
    // this.bow.position.set(k.sx, k.sy, k.sz);
    // this.bow.rotation.set(0, Math.PI * k.ry, Math.PI * k.rz);
    if (k?.reset) {
      k.reset = false;
      this.action.reset();
    }
  }
}
