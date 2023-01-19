export const fragmentShader = `
  uniform sampler2D myTextureOne;
  uniform sampler2D myTextureTwo;
  uniform float uProgress;

  varying vec2 vUv;
  varying float vScrollInfluence;

  void main() {
    vec4 image1 = texture2D(myTextureOne, vUv);
    vec4 image2 = texture2D(myTextureTwo, vUv);
    gl_FragColor = mix(image1, image2, uProgress);
  }
`