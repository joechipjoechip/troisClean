// note : vertex is about one vertex position, is about geometry
// ce programme est joué pour chaque vertex

// il peut recevoir :
// les attributes : données spécifique à chaque vertex
// les uniforms : données communes à tous les vertices

// une fois que tous les vertices sont placés par le vertexShader, 
// le GPU sait quel pixel de la géométry est visible 
// et peut donc le passer au fragmentShader

export const vertexShader = `
	uniform float uScrollInfluence;

	varying vec2 vUv;
	varying float vScrollInfluence;

	void main()
	{  

		vec4 modelPosition = modelMatrix * vec4(position, 1.0);

		float elevation = sin(modelPosition.x * smoothstep(0.0, 5.0, abs(uScrollInfluence))) 
						* sin(modelPosition.y * smoothstep(0.0, 9.0, abs(uScrollInfluence)));

		modelPosition.z += elevation;
		modelPosition.x += -elevation;

		vec4 viewPosition = viewMatrix * modelPosition;
		vec4 projectedPosition = projectionMatrix * viewPosition;
		
		
		vUv = uv;
		vScrollInfluence = uScrollInfluence;

		gl_Position = projectedPosition;

	}
`
