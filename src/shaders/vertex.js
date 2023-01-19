export const vertexShader = `
	uniform float uScrollInfluence;
	uniform vec2 uMouse;

	varying vec2 vUv;
	varying float vScrollInfluence;

	void main()
	{
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

		vUv = uv;

		vScrollInfluence = uScrollInfluence;

	}
`
