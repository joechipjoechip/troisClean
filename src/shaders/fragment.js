// note : fragmentShader is about colorize each pixel
// ce programme est joué pour les différents fragments visibles d'une géométrie

// il peut recevoir : 
// des uniforms : données communes
// des varying : données qui viennent du vertexShader
// pas d'attributes

// les couleurs ENTRE plusieurs vertices sont interpolées (dégradés)

export const fragmentShader = `
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform sampler2D mask;
  uniform float uProgress;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vScrollInfluence;

  void main() {
    vec4 color1 = texture2D(texture1, vUv);
    vec4 color2 = texture2D(texture2, vUv);

    float maskValue = texture2D(mask, vUv).r;
    float alpha = smoothstep(uProgress, uProgress + 0.5, maskValue);

    gl_FragColor = mix(color1, color2, alpha);
  }
`