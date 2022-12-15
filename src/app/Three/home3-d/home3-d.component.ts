import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
interface Morph {
  mesh: THREE.Mesh;
  speed: number;
}
@Component({
  selector: "app-home3-d",
  templateUrl: "./home3-d.component.html",
  styleUrls: ["./home3-d.component.sass"],
})
export class Home3DComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvas")
  canvasRef!: ElementRef;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  clock = new THREE.Clock();
  morphs: Morph[] = [];
  mixer!: THREE.AnimationMixer;
  addMorph(
    mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>,
    clip: THREE.AnimationClip,
    speed: number,
    duration: number,
    x: number,
    y: number,
    z: number,
    fudgeColor: boolean
  ) {
    mesh = mesh.clone();
    const mat = mesh.material as THREE.Material;
    mesh.material = mat.clone();

    if (fudgeColor) {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.offsetHSL(
        0,
        Math.random() * 0.5 - 0.25,
        Math.random() * 0.5 - 0.25
      );
    }

    // mesh.speed = speed;

    this.mixer
      .clipAction(clip, mesh)
      .setDuration(duration)
      // to shift the playback out of phase:
      .startAt(-duration * Math.random())
      .play();

    mesh.position.set(x, y, z);
    mesh.rotation.y = Math.PI / 2;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.scene.add(mesh);

    this.morphs.push({ mesh, speed });
  }

  canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  animate() {
    const game = this;
    requestAnimationFrame(() => {
      game.animate();
    });
    const delta = this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);

    this.mixer.update(delta * 10);
    this.morphs.forEach((morph) => {
      morph.mesh.position.x += morph.speed * delta * 1;
      if (morph.mesh.position.x > 2000) {
        morph.mesh.position.x = -1000 - Math.random() * 500;
      }
    });
  }
  createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const light = new THREE.AmbientLight(0x404040, 3); // soft white light
    this.scene.add(light);
    const dDight = new THREE.DirectionalLight(0x404040); // soft white light
    this.scene.add(dDight);
    this.camera.position.set(0, 0, 10);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas() });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const gltfloader = new GLTFLoader();
    this.mixer = new THREE.AnimationMixer(this.scene);
    const game = this;
    gltfloader.load(
      "https://hututusoftwares.com/3D/Flamingo.glb",
      function (gltf) {
        const mesh = gltf.scene.children[0] as THREE.Mesh;
        const clip = gltf.animations[0];
        for (let i = 0; i < 5; i++) {
          game.addMorph(
            mesh.clone(),
            clip,
            300+Math.random()*300,
            10,
            1000 - Math.random() * 2000,
            300 - Math.random() * 600,
            -500 + Math.random() * 100,
            
            true
          );
        }
        game.addMorph(mesh, clip, 500, 10, 0, 0, -500, false);
      }
    );
    gltfloader.load(
      "https://hututusoftwares.com/3D/Parrot.glb",
      function (gltf) {
        const mesh = gltf.scene.children[0] as THREE.Mesh;
        const clip = gltf.animations[0];
        for (let i = 0; i < 5; i++) {
          game.addMorph(
            mesh.clone(),
            clip,
            300+Math.random()*300,
            10,
            1000 - Math.random() * 2000,
            300 - Math.random() * 600,
            -500 + Math.random() * 100,
            
            true
          );
        }
        game.addMorph(mesh, clip, 400, 10, 50, 350, -500, true);
      }
    );
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize);
  }

  constructor() {
    console.log("~~~~~~constructor~~~~~~~~");
  }
  ngOnDestroy(): void {
    console.log("~~~~~~ngOnDestroy~~~~~~~~");
    window.removeEventListener("resize", this.onWindowResize);
  }
  ngAfterViewInit(): void {
    console.log("~~~~~~~ngAfterViewInit~~~~~~~", this.canvas());
    this.createScene();
    this.animate();

    // throw new Error("Method not implemented.");
  }
  ngOnInit(): void {
    console.log("~~~~~~~ngOnInit~~~~~~~");

    // throw new Error("Method not implemented.");
  }
  onWindowResize() {
    console.log("~~~~~~~ngOnInit~~~~~~~", this.camera);
    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = window.innerHeight;

    this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  }
}
