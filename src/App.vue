<template>

	<div ref="mainWrapper" class="wrapper">

		<Renderer  
			ref="rendererElement"
		  	antialias 
		  	resize="window"
		>
		  <!-- :orbit-ctrl="{ enableDamping: true }"  -->

		  <Camera :position="{ z: 10 }" />

		  <Scene>

			<PointLight 
				:position="{ 
					x: -50 * mouseX,
					z: -1
				}" 
				:intensity="Math.abs(mouseY / -10)" 
			/>

			<PointLight 
				:position="{ 
					x: -5 * mouseX,
					y: -5 * mouseY
				}" 
				:intensity="Math.abs(mouseX / 10) * 1.7"
				color="#FF0000"
			/>

			<Box 
				:size="1" 
				ref="boxOneElement" 
				:rotation="{ 
					x: Math.PI / 4 + mouseX,
					y: Math.PI / 4 + mouseY 
				}"
				:position="{ 
					z: 3 * Math.abs(mouseX) 
				}" 
			>

				<SubSurfaceMaterial />

			</Box>

			<EffectComposer>

				<RenderPass />

				<UnrealBloomPass 
					:strength="0.6" 
				/>

				<BokehPass 
					:maxblur="0.008"
				/>
				
			</EffectComposer>

		  </Scene>

		</Renderer>

	</div>

</template>

<script setup>

import { ref, onMounted } from 'vue'

import { useMouseNormalised } from "./composables/computePos"

const mainWrapper = ref(null)
const rendererElement = ref(null)
const boxOneElement = ref(null)

const mesh = ref()

const { x: mouseX, y: mouseY } = useMouseNormalised(mainWrapper)

onMounted(() => {

  // update rotation PERMANENT
  rendererElement.value.onBeforeRender(() => {
    updateMesh();
  })

})

function updateMesh(){

	mesh.value = boxOneElement.value.mesh

	mesh.value.rotation.y += 0.0008
    mesh.value.rotation.x -= 0.0003

}


</script>

<style lang="scss">
body {
	margin: 0;
	padding: 0;

	.wrapper {
		display: block;
		position: relative;
		width: 100%;
		height: 100vh;
	}

}

</style>