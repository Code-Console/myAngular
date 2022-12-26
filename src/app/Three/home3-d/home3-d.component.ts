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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Waves } from "./Waves";
import { Galaxy } from "./Galaxy";
import { parrotGLBPath } from "src/app/assets";
import { Bow } from "./Bow";
import { dealWithKeyboard } from "./Keyboard";
import { TouchType } from "src/app/Interface";
import { Road } from "./RoadLight/Road";
import { RoadLight } from "./RoadLight";

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
  wave!: Waves;
  galaxy!: Galaxy;
  bow!: Bow;
  controls!: OrbitControls;
  roadLight!:RoadLight;
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
    this.morphs.forEach((morph, i) => {
      morph.mesh.position.x += morph.speed * delta;

      if (i == 0) {
        morph.mesh.position.set(
          Math.sin(morph.speed) * 100,
          350,
          Math.cos(morph.speed) * 100
        );
        morph.speed += 0.5;
        // morph.speed = 20;
        const radian = morph.speed * (Math.PI / 180);
        morph.mesh.position.set(
          395 * Math.sin(radian),
          0,
          -250 + 150 * Math.cos(radian)
        );
        morph.mesh.rotation.set(0, Math.PI * 0.5 + radian, 0);
        morph.mesh.scale.set(0.5, 0.5, 0.5);
      }

      if (morph.mesh.position.x > 600) {
        morph.mesh.position.x = -600;
        morph.mesh.position.y = Math.random() * 300;
      }
    });
    this.wave?.render();
    this.galaxy?.render();
    this.bow?.render(delta);
    this.controls?.update();
    this.roadLight?.render(delta);
  }
  createScene() {
    this.scene = new THREE.Scene();
    // const geometry = new THREE.RingGeometry(10, 9, 32);
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   side: THREE.DoubleSide,
    // });
    // const mesh = new THREE.Mesh(geometry, material);
    // mesh.rotation.set(Math.PI * 0.5, 0, 0);
    // this.scene.add(mesh);

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
    this.camera.position.set(0, 0, 20);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas() });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0015);
    const gltfloader = new GLTFLoader();
    this.mixer = new THREE.AnimationMixer(this.scene);
    const game = this;
    gltfloader.load(parrotGLBPath, function (gltf) {
      const mesh = gltf.scene.children[0] as THREE.Mesh;
      const clip = gltf.animations[0];
      for (let i = 0; i < 0; i++) {
        game.addMorph(
          mesh.clone(),
          clip,
          130 + Math.random() * 130,
          8,
          600 - Math.random() * 1200,
          Math.random() * 300,
          -400 + Math.random() * 30,

          true
        );
      }
      // game.addMorph(mesh, clip, 400, 10, 50, 350, -500, true);
    });
    // this.wave = new Waves();
    // this.scene.add(this.wave.particles);
    // this.galaxy = new Galaxy(this.scene);
    
    this.bow = new Bow(this.scene);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.roadLight = new RoadLight(this);
    // this.controls.zoomO = 100;
  }
  addEventListeners() {
    this.onWindowResize = this.onWindowResize.bind(this);
    document.addEventListener("keydown", dealWithKeyboard);

    document.addEventListener("mousedown", this.eventDown);
    document.addEventListener("touchstart", this.eventDown);

    document.addEventListener("mousemove", this.eventMove);
    document.addEventListener("touchmove", this.eventMove);

    document.addEventListener("mouseup", this.eventUp);
    document.addEventListener("touchend", this.eventUp);

    window.addEventListener("resize", this.onWindowResize, false);
  }
  constructor() {
    dealWithKeyboard(0);
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

  eventDown(e: any) {
    this.touchEvent(e, TouchType.touchDown, 0);
  }
  eventMove(e: any) {
    this.touchEvent(e, TouchType.touchMove, 0);
  }
  eventUp(e: any) {
    this.touchEvent(e, TouchType.touchUp, 0);
  }

  touchEvent(e: any, type: TouchType, sys: Number) {}
}
