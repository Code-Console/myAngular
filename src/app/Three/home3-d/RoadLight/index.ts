import * as THREE from "three";
import { Home3DComponent } from "../home3-d.component";
import { Road } from "./Road";
import { mountainDistortion } from "./distortion";
import { CarLights } from "./CarLights";
export class RoadLight {
  road!: Road;
  home!: Home3DComponent;
  fogUniforms!: {
    fogColor: { type: string; value: any };
    fogNear: { type: string; value: any };
    fogFar: { type: string; value: any };
  };
    leftCarLights!: CarLights;
    rightCarLights!: CarLights;
  constructor(_home: Home3DComponent) {
    this.home = _home;
    const options = {
      onSpeedUp: (ev: any) => {},
      onSlowDown: (ev: any) => {},
      distortion: mountainDistortion,

      length: 400,
      roadWidth: 9,
      islandWidth: 2,
      lanesPerRoad: 3,

      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,

      totalSideLightSticks: 50,
      lightPairsPerRoadWay: 50,

      // Percentage of the lane's width
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,

      /*** These ones have to be arrays of [min,max].  ***/
      lightStickWidth: [0.12, 0.5],
      lightStickHeight: [1.3, 1.7],

      movingAwaySpeed: [60, 80],
      movingCloserSpeed: [-120, -160],

      /****  Anything below can be either a number or an array of [min,max] ****/

      // Length of the lights. Best to be less than total length
      carLightsLength: [400 * 0.05, 400 * 0.15],
      // Radius of the tubes
      carLightsRadius: [0.05, 0.14],
      // Width is percentage of a lane. Numbers from 0 to 1
      carWidthPercentage: [0.3, 0.5],
      // How drunk the driver is.
      // carWidthPercentage's max + carShiftX's max -> Cannot go over 1.
      // Or cars start going into other lanes
      carShiftX: [-0.2, 0.2],
      // Self Explanatory
      carFloorSeparation: [0.05, 1],

      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0x131318,
        brokenLines: 0x131318,
        /***  Only these colors can be an array ***/
        leftCars: [0xff102a, 0xeb383e, 0xff102a],
        rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
        sticks: 0xdadafa,
      },
    };
    let fog = new THREE.Fog(
        options.colors.background,
        options.length * 0.2,
        options.length * 500
      );
      this.home.scene.fog = fog;
      this.fogUniforms = {
        fogColor: { type: "c", value: fog.color },
        fogNear: { type: "f", value: fog.near },
        fogFar: { type: "f", value: fog.far },
      };
    this.road = new Road(this.home, options);
    this.leftCarLights = new CarLights(
        this.home,
        options,
        options.colors.leftCars,
        options.movingAwaySpeed,
        new THREE.Vector2(0, 1 - options.carLightsFade),
        this
      );
      this.rightCarLights = new CarLights(
        this.home,
        options,
        options.colors.rightCars,
        options.movingCloserSpeed,
        new THREE.Vector2(1, 0 + options.carLightsFade),
        this
      );
  }
  render(delta: number) {
    this.road?.update(delta);
    this.leftCarLights?.update(delta);
    this.rightCarLights?.update(delta);
  }
}
