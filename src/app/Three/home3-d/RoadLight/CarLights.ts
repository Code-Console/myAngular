import { Home3DComponent } from "../home3-d.component";
import * as THREE from "three";
import { RoadLight } from ".";
import { MeshBasicMaterial } from "three";
export class CarLights {
  webgl: Home3DComponent;
  options: any;
  colors: any;
  speed: number[];
  fade: THREE.Vector2;
  roadLight: RoadLight;
  mesh!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
  constructor(
    webgl: Home3DComponent,
    options: any,
    colors: any,
    speed: number[],
    fade: THREE.Vector2,
    roadLight: RoadLight
  ) {
    this.webgl = webgl;
    this.options = options;
    this.colors = colors;
    this.speed = speed;
    this.fade = fade;
    this.roadLight = roadLight;
    this.init();
  }
  init() {
    const options = this.options;
    // Curve with length 1
    let curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    );
    // Tube with radius = 1
    let geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);

    let instanced = new THREE.InstancedBufferGeometry().copy(geometry);
    instanced.instanceCount = options.lightPairsPerRoadWay * 2;

    let laneWidth = options.roadWidth / options.lanesPerRoad;

    let aOffset = [];
    let aMetrics = [];
    let aColor = [];

    let colors = this.colors;
    if (Array.isArray(colors)) {
      colors = colors.map((c) => new THREE.Color(c));
    } else {
      colors = new THREE.Color(colors);
    }

    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      let radius = random(options.carLightsRadius);
      let length = random(options.carLightsLength);
      let speed = random(this.speed[0]);

      let carLane = i % 3;
      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;

      let carWidth = random(options.carWidthPercentage) * laneWidth;
      // Drunk Driving
      let carShiftX = random(options.carShiftX) * laneWidth;
      // Both lights share same shiftX and lane;
      laneX += carShiftX;

      let offsetY = random(options.carFloorSeparation) + radius * 1.3;

      let offsetZ = -random(options.length);

      aOffset.push(laneX - carWidth / 2);
      aOffset.push(offsetY);
      aOffset.push(offsetZ);

      aOffset.push(laneX + carWidth / 2);
      aOffset.push(offsetY);
      aOffset.push(offsetZ);

      aMetrics.push(radius);
      aMetrics.push(length);
      aMetrics.push(speed);

      aMetrics.push(radius);
      aMetrics.push(length);
      aMetrics.push(speed);

      let color = pickRandom(colors);
      aColor.push(color.r);
      aColor.push(color.g);
      aColor.push(color.b);

      aColor.push(color.r);
      aColor.push(color.g);
      aColor.push(color.b);
    }
    instanced.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false)
    );
    instanced.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false)
    );
    instanced.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
    );
    let material = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex,
      transparent: true,
      uniforms: Object.assign(
        {
          // uColor: new THREE.Uniform(new THREE.Color(this.color)),
          uTime: new THREE.Uniform(0),
          uTravelLength: new THREE.Uniform(options.length),
          uFade: new THREE.Uniform(this.fade),
        },
        this.roadLight.fogUniforms,
        options.distortion.uniforms
      ),
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        options.distortion.getDistortion
      );
      // console.log(shader.vertex);
    };
    const material1 = new MeshBasicMaterial();
    let mesh = new THREE.Mesh(instanced, material);
    mesh.frustumCulled = false;
    this.webgl.scene.add(mesh);
    this.mesh = mesh;
    const pos = this.options.position as number[] || [0,0,0];
    this.mesh.position.set(pos[0],pos[1],pos[2]);
  }
  update(time: number) {
    const uni = this.mesh?.material.uniforms as any;
    
    if(uni){
      uni.uTime.value +=.01;
    }
    
  }
}

const carLightsFragment = `
  
    #define USE_FOG;
    ${THREE.ShaderChunk["fog_pars_fragment"]}
    varying vec3 vColor;
    varying vec2 vUv; 
    uniform vec2 uFade;
    void main() {
    vec3 color = vec3(vColor);
    float fadeStart = 0.4;
    float maxFade = 0.;
    float alpha = 1.;
    
    alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color,alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${THREE.ShaderChunk["fog_fragment"]}
    }
  `;

const carLightsVertex = `
    #define USE_FOG;
    ${THREE.ShaderChunk["fog_pars_vertex"]}
    attribute vec3 aOffset;
    attribute vec3 aMetrics;
    attribute vec3 aColor;
  
    
  
    uniform float uTravelLength;
    uniform float uTime;
    uniform float uSpeed;
  
    varying vec2 vUv; 
    varying vec3 vColor; 
    #include <getDistortion_vertex>
  
    void main() {
      vec3 transformed = position.xyz;
      float radius = aMetrics.r;
      float myLength = aMetrics.g;
      float speed = aMetrics.b;
  
      transformed.xy *= radius ;
      transformed.z *= myLength;
    
      // Add my length to make sure it loops after the lights hits the end
      transformed.z += myLength-mod( uTime *speed + aOffset.z, uTravelLength);
      transformed.xy += aOffset.xy;
  
  
      float progress = abs(transformed.z / uTravelLength);
      transformed.xyz += getDistortion(progress);
  
      vec4 mvPosition = modelViewMatrix * vec4(transformed,1.);
      gl_Position = projectionMatrix * mvPosition;
      vUv = uv;
      vColor = aColor;
      ${THREE.ShaderChunk["fog_vertex"]}
    }`;
const random = (base: number) => {
  if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
  return Math.random() * base;
};
const pickRandom = (arr: string | any[]) => {
  if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
  return arr;
};
