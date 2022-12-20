import { IShader } from "../Interface";

export const basicShader: IShader = {
  vertex: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
  fragment: `
        void main() {
            gl_FragColor = vec4(1.0,0.0,1.0,1.0);
        }`,
};

export const wavesShader: IShader = {
  vertex: `
    attribute float scale;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
        vUv = uv ;
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = 3.;//scale * ( 300.0 / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
    }`,
  fragment: `
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float u_time;
    void main() {
        vec2 uv = vec2(abs(sin(vPosition.x)), abs(sin(vPosition.z)))*.5; 
        vec2 uv2 = vec2(vPosition.x,vPosition.z)*.01; 
        vec2 uv1 = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y); 
      if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
      gl_FragColor = vec4(.5,abs(sin(uv2.x+u_time*.02)),abs(sin(uv2.y+u_time*.02)),1.);
  }`,
};
export const galaxyShader: IShader = {
  vertex: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
  fragment: `
        uniform vec4      iMouse; 
        uniform vec3 iResolution;
        uniform float iTime;
        float mat = 0.0;
        float ss = 0.1;
        varying vec2 vUv;
        const int MAX_ITER = 8;
        float field(vec3 p, float s, int iter){
            float accum = s / 4.0;
            float prev = 0.0;
            float tw = 0.0;
            for (int i = 0; i < MAX_ITER; ++i){
                if (i >= iter) // drop from the loop if the number of iterations has been completed - workaround for GLSL loop index limitation
                {
                    break;
                }
                float mag = dot(p, p);
                p = abs(p) / mag + vec3(-0.5, -0.4, -1.487);
                float w = exp(-float(i) / 5.0);
                accum += w * exp(-9.025 * pow(abs(mag - prev), 2.2));
                tw += w;
                prev = mag;
            }
            return max(0.0, 5.2 * accum / tw - 0.65);
        }

        vec3 nrand3(vec2 co) {
            vec3 a = fract(cos(co.x*8.3e-3 + co.y) * vec3(1.3e5, 4.7e5, 2.9e5));
            vec3 b = fract(sin(co.x*0.3e-3 + co.y) * vec3(8.1e5, 1.0e5, 0.1e5));
            vec3 c = mix(a, b, 0.5);
            return c;
        }

        vec4 starLayer(vec2 p, float time) {
            vec2 seed = 1.9 * p.xy;
            seed = floor(seed * max(iResolution.x, 600.0) / 1.5);
            vec3 rnd = nrand3(seed);
            vec4 col = vec4(pow(rnd.y, 17.0));
            float mul = 10.0 * rnd.x;
            col.xyz *= sin(time * mul + mul) * 0.25 + 1.0;
            return col;
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
            float time = iTime / (iResolution.x / 1000.0);
            
            // first layer of the kaliset fractal
            vec2 uv = 2.0 * fragCoord / iResolution.xy - 1.0;
                vec2 uvs = uv * iResolution.xy / max(iResolution.x, iResolution.y);
            vec3 p = vec3(uvs / 2.5, 0.0) + vec3(0.8, -1.3, 0.0);
            p += 0.45 * vec3(sin(time / 32.0), sin(time / 24.0), sin(time / 64.0));
            
            // adjust first layer position based on mouse movement
            p.x += mix(-0.02, 0.02, (iMouse.x / iResolution.x));
            p.y += mix(-0.02, 0.02, (iMouse.y / iResolution.y));
            
            // float freqs[4];
            // freqs[0] = 0.45;
            // freqs[1] = 0.4;
            // freqs[2] = 0.15;
            // freqs[3] = 0.9;

            // float t = field(p, freqs[2], 13);
            // float v = (1.0 - exp((abs(uv.x) - 1.0) * 6.0)) * (1.0 - exp((abs(uv.y) - 1.0) * 6.0));
            
            // second layer of the kaliset fractal
            vec3 p2 = vec3(uvs / (4.0 + sin(time * 0.11) * 0.2 + 0.2 + sin(time * 0.15) * 0.3 + 0.4), 4.0) + vec3(2.0, -1.3, -1.0);
            p2 += 0.16 * vec3(sin(time / 32.0), sin(time / 24.0), sin(time / 64.0));
            
            // adjust second layer position based on mouse movement
            p2.x += mix(-0.01, 0.01, (iMouse.x / iResolution.x));
            p2.y += mix(-0.01, 0.01, (iMouse.y / iResolution.y));
            //float t2 = field(p2, freqs[3], 18);
            //vec4 c2 = mix(0.5, 0.2, v) * vec4(5.5 * t2 * t2 * t2, 2.1 * t2 * t2, 2.2 * t2 * freqs[0], t2);
            
            // add stars (source: https://glslsandbox.com/e#6904.0)
            vec4 starColour = vec4(0.0);
            starColour += starLayer(p.xy, time); // add first layer of stars
            starColour += starLayer(p2.xy, time); // add second layer of stars

            const float brightness = 0.50;
            // vec4 colour = mix(freqs[3] - 0.3, 1.0, v) * vec4(1.5 * freqs[2] * t * t * t, 1.2 * freqs[1] * t * t, freqs[3] * t, 1.0) + c2 + starColour;
            fragColor = vec4(brightness * starColour.xyz, 1.0);
        }
  
        void main() {
            gl_FragColor = vec4(1.,1.,1.,1.);
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }`,
};
