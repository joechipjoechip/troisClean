<template>

	<p class="debug">
		x: {{ mouseX }}
	</p>

	<div ref="mainWrapper" class="wrapper">

		<Renderer  
			ref="rendererElement"
			antialias
			:alpha="true"
		>
		<!-- :orbit-ctrl="{ enableDamping: true }"  -->

			<Camera :position="{ z: 10 }" :far="5000" />

			<Scene>

				<!-- <AmbientLight color="#00FF00" :intensity="1" /> -->

				<PointLight 
					:position="{ 
						x: -50 * mouseX,
						z: -1
					}" 
					:intensity="2" 
					color="#FF0000"
				/>

				<PointLight 
					:position="{ 
						x: -5 * mouseX,
						y: -5 * mouseY
					}" 
					:intensity="Math.abs(mouseX / 10) * 1.7"
				/>

				<Box 
					:size="3" 
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

					<!-- <UnrealBloomPass 
						:strength="0.6" 
					/>  -->


					<BokehPass 
						:maxblur="0.8"
					/>
					<RenderPass />
					
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

const { x: mouseX, y: mouseY } = useMouseNormalised()

onMounted(() => {

	// update rotation PERMANENT
	rendererElement.value.onBeforeRender(() => {
		updateMesh();
	})

})

function updateMesh(){

	boxOneElement.value.mesh.rotation.y += 0.0008
	boxOneElement.value.mesh.rotation.x -= 0.0003

}


</script>

<style lang="scss">

.wrapper {
  position: relative;
  display: block;
  width: 70%;
  height: 100%;
  border: solid 2px green;

  .debug {
    display: block;
  }
}
</style>