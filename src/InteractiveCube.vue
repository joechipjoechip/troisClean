<template>

	<p class="debug">
		x: {{ mouseX.toFixed(3) }}
	</p>

	<div ref="mainWrapper" class="wrapper">

		<Renderer  
			v-if="renderEnabled"
			ref="rendererElement"
			class="renderer"
			antialias
			:alpha="true"
			:width="rendererElementBoundings.width"
			:height="rendererElementBoundings.height"
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

					<UnrealBloomPass 
						:strength="2"
					/> 


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

import { ref, reactive, onMounted, watch, nextTick } from 'vue'

import { useMouseNormalised } from "./composables/computePos"
import { useHandleResize } from "./composables/handleResize"

const mainWrapper = ref(null)
const rendererElement = ref(null)
const boxOneElement = ref(null)

const renderEnabled = ref(false)

const rendererElementBoundings = reactive({})

const { x: mouseX, y: mouseY } = useMouseNormalised()

defineExpose({ renderEnabled })

useHandleResize(handleResize, mainWrapper)


onMounted(() => {
	
	handleResize()

	launchRendering()

})

function launchRendering(){

	if( !renderEnabled.value ){

		renderEnabled.value = true

		nextTick(() => {

			// ! update rotation PERMANENTLY !
			// onBeforeRender() is a specific event coming from TroisJS (not vue)
			// https://troisjs.github.io/guide/core/renderer.html#events-api-v0-3
			rendererElement.value.onBeforeRender(() => {
				updateMesh();
			})

		})
	}

}

function handleResize(){
	
	// we use new String() because the renderer canvas element (under the hood) 
	// expects some Strings (getBoundingClientRect() provides Numbers) in attributes width and height

	// + we can't destructure or directly assign getBoundingClientRect() returned value to rendererElementBoundings, 
	// ex : rendererElementBoundings = mainWrapper.value.getBoundingClientRect() // <- won't work
	//   because our object rendererElementBoundings is a reactive() thing (and need to stay a reactive() thing)

	rendererElementBoundings.width = new String(mainWrapper.value.getBoundingClientRect().width)
	rendererElementBoundings.height = new String(mainWrapper.value.getBoundingClientRect().height)
	
}

watch(rendererElementBoundings, ( newVal ) => {

	rendererElement.value?.three.setSize(newVal.width, newVal.height)

})

function updateMesh(){

	boxOneElement.value.mesh.rotation.y += 0.0008

	boxOneElement.value.mesh.rotation.x -= 0.0003

}


</script>

<style lang="scss">

.wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
  border: solid 2px green;

  .debug {
    display: block;
  }

  .renderer {
	border: solid 1px red;
  }
}
</style>