import { woodenBowFBX, woodenBowImg } from "src/app/assets";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { EventList } from "./Keyboard";

export class Bow {
  mixer!: THREE.AnimationMixer;
  scene!: THREE.Scene;
  action!: THREE.AnimationAction;
  arrow!: THREE.Group;
  arrowFire: THREE.Group[] = [];
  counter = 0;
  bow = new THREE.Group();
  position = new THREE.Vector3(0, 0, -120);
  isMouseDown = false;
  rotY = 0;
  rotZ = 0;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    const fBXLoader = new FBXLoader();
    fBXLoader.load(woodenBowFBX, (object) => {
      this.mixer = new THREE.AnimationMixer(object);

      this.action = this.mixer.clipAction(object.animations[0]);
      this.action.play();
      this.action.weight = 1;
      this.action.repetitions = 1;
      this.action.setDuration(0.4);
      this.bow.add(object);
      const textureLoader = new THREE.TextureLoader();
      const map = textureLoader.load(woodenBowImg);
      object.traverse((object: any) => {
        if (!object["isSkinnedMesh"]) return;
        if (object["material"].isMaterial) {
          object["material"].map = map;
          object["material"].needsUpdate = true;
        }
      });
      console.log(object);
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
    this.bow.add(this.arrow);
    this.scene.add(this.bow);
    for (let i = 0; i < 5; i++) {
      this.arrowFire.push(this.arrow.clone());
      this.scene.add(this.arrowFire[i]);
      this.arrowFire[i].name = "arrowFire";
      this.arrowFire[i].visible = false;
    }
  }
  power = (x: number) => x * x * 1.3;
  render(delta: number, eventList: EventList) {
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
      if (this.action.time < 7) {
        this.setArrow();
      }
      this.action.time = 7;
    }

    if (this.action.time > 0.595) {
      this.arrow.visible = false;
    } else {
      this.arrow.visible = true;
    }
    this.arrowFire.forEach((arr) => {
      if (arr.visible) {
        arr.translateX(-20);
        arr.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.003);
      }
    });
    if (k?.reset) {
      k.reset = false;
      this.action.reset();
    }

    if (eventList.isMouseDown) {
      if (this.isMouseDown == false) {
        this.rotY = this.bow.rotation.y;
        this.rotZ = this.bow.rotation.z;
      }
      const moveX = eventList.mouseDownPos.x - eventList.mouse.x;
      const moveY = eventList.mouseDownPos.y - eventList.mouse.y;
      this.bow.rotation.y = this.rotY - moveX * 2;
      this.bow.rotation.z = this.rotZ - moveY * 2;

      this.isMouseDown = true;
    } else {
      if (this.isMouseDown) {
        if (this.action.time > 0.59) this.action.reset();
      }
      this.isMouseDown = false;
    }
    if (this.bow.rotation.y > -0.75) {
      this.bow.rotation.y = -0.75;
    }
    if (this.bow.rotation.y < -2.55) {
      this.bow.rotation.y = -2.55;
    }
    if (this.bow.rotation.z < -0.85) {
      this.bow.rotation.z = -0.85;
    }
    if (this.bow.rotation.z > 0.65) {
      this.bow.rotation.z = 0.65;
    }
  }
  setVisible(visible: boolean) {
    this.bow.visible = visible;
    this.arrowFire.forEach((arr) => {
      arr.visible = false;
    });
  }
  getArrowPosition() {
    const pos = new THREE.Vector3();
    this.arrowFire[0]?.children[0].getWorldPosition(pos);
    return pos;
  }
  setArrow() {
    const rot = new THREE.Quaternion();
    this.arrow.getWorldQuaternion(rot);
    const pos = new THREE.Vector3();
    this.arrow.getWorldPosition(pos);

    this.arrowFire.forEach((arr) => {
      if (
        !arr.visible ||
        Math.abs(arr.position.z) > 400 ||
        Math.abs(arr.position.x) > 600
      ) {
        console.log(arr.visible);
        arr.position.copy(pos);
        arr.quaternion.copy(rot);
        arr.visible = true;
      }
    });
  }
}
