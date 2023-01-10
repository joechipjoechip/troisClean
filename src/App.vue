<template>

	<div @mousemove="mousemoveHandler" class="wrapper">

		<Renderer 
		  ref="rendererMainWrapper" 
		  antialias 
		  resize="window"
		>
		  <!-- :orbit-ctrl="{ enableDamping: true }"  -->

		  <Camera :position="{ z: 10 }" />

		  <Scene>

			<PointLight :position="{ y: 50 * mousePos.y, z: 50 * mousePos.x }" :intensity="Math.abs(mousePos.y / 10)" />
			<PointLight 
				:position="{ y: -50 * mousePos.y, z: -50 * mousePos.x }" 
				color="#FF0000"
				:intensity="Math.abs(mousePos.x / 10) * 1.7"
			/>

			<Box 
				:size="1" 
				ref="boxOneElement" 
				:rotation="{ y: Math.PI / 4, z: Math.PI / 4 }"
			>
			  
				<!-- <LambertMaterial /> -->
				<!-- <MatcapMaterial name="686E55_353C2F_869B7F_444434" /> -->
				<SubSurfaceMaterial :uniform="{ thicknessColor: '#ffffff' }" :transparent="true" :opacity="0.1" />

			</Box>

		  </Scene>

		</Renderer>

	</div>

</template>

<script setup>


import { ref, onMounted, reactive } from 'vue'
// import { Box, Camera, LambertMaterial, PointLight, Renderer, Scene } from 'troisjs'

const rendererMainWrapper = ref(null)
const boxOneElement = ref(null)
const renderSize = reactive({ width: window.innerWidth, height: window.innerHeight })

const mesh = ref()

const mousePos = reactive({x: 0, y: 0})

onMounted(() => {

  // update rotation PERMANENT
  rendererMainWrapper.value.onBeforeRender(() => {
    updateMesh();
  })

})

function updateMesh(){

	mesh.value = boxOneElement.value.mesh

	mesh.value.rotation.y += 0.0008
    mesh.value.rotation.x -= 0.0003
}

function mousemoveHandler( event ){

	// normalise x, y
	const { x, y } = useComputedPos(event)
	
	// update rotation EVENEMENTIEL
	mousePos.x = x;
	mousePos.y = y;

	mesh.value.rotation.y += y / 35
	mesh.value.rotation.x += x / 35
  
}

function useComputedPos( input ){
	// "input" is straight mousemove event

	// @TODO : externalise as composable

	if( input.touches?.[0] ){

		const goodTouch = Array.from(input.touches).find(touch => touch.target.dataset.role === this.role);

		return {
			x: Math.min(1,
				Math.max(
					-1,
					(((goodTouch.clientX - left) / width) - 0.5) * 2
				)
			),
			y: Math.min(1,
				Math.max(
					-1,
					(((goodTouch.clientY - top) / height) - 0.5) * -2
				)
			)
		}


	} else {

		return {
			x: (((input.offsetX + renderSize.width / 2) / renderSize.width) - 1) * 2,
			y: (((input.offsetY + renderSize.height / 2) / renderSize.height) - 1) * -2
		};

	}

	
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