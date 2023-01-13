<script setup>

import { ref, reactive, onMounted, watch, nextTick } from 'vue'

import { TimelineMax } from "gsap/all";
import { useHandleResize } from "./composables/handleResize"
import { useMouseNormalised } from "./composables/computePos"
import { useScroll } from '@vueuse/core'
import { useThrottleFn } from '@vueuse/core'

const props = defineProps({
	mouseSensitive: {
		type: Boolean,
		default: false
	},
	scrollSensitive: {
		type: Boolean,
		default: false
	},
	permanentRotationIncrement: {
		type: Object,
		default: {}
	}
})

const mainWrapper = ref(null)
const rendererElement = ref(null)
const boxOneElement = ref(null)

const renderEnabled = ref(false)

const rendererElementBoundings = reactive({})

const reduceItemSize = ref(false)

const cameraDeltaY = ref(0)
const { directions } = props.scrollSensitive ? useScroll(window) : { directions: {} }

const axes = ["x", "y", "z"]
let mouseX, mouseY



defineExpose({ 
	renderEnabled 
})

onMounted(() => {
	
	renderEnabled.value = true

	handleResize()

})



// * * * * Mouse Sensitive Logic :
if( props.mouseSensitive ){
	mouseX = useMouseNormalised().x
	mouseY = useMouseNormalised().y
} else {
	mouseX = 0.000
	mouseY = 0.000
}
// * * * * * * * * * * * * * * * * * * * 



// * * * Resize Logic :
const handleResizeThrolttled = useThrottleFn(handleResize, 150)

function handleResize(){
	// console.log("handleResize")
	rendererElementBoundings.width = mainWrapper.value.getBoundingClientRect().width
	rendererElementBoundings.height = mainWrapper.value.getBoundingClientRect().height
}

useHandleResize(handleResizeThrolttled, mainWrapper)

watch(rendererElementBoundings, ( newVal ) => {
	rendererElement.value?.three.setSize(newVal.width, newVal.height)
})
// * * * * * * * * * * *



// * * * * * Scroll Logic :
if( props.scrollSensitive ){
	
	const deltaYforScroll = 6
	const deltaYforScrollDuration = 0.4

	let tl = null

	watch(
		[() => directions.top, () => directions.bottom], 
		( [top, bottom]) => {

			const freshDirections = { top, bottom }

			const goodDirection = Object.keys(freshDirections).find(key => freshDirections[key]) || "stop"

			dispatchDirection(goodDirection)
	
		}
	)

	function dispatchDirection( direction ){
		// console.log("dispatch triggered : direction : ", direction)

		if( direction === "stop" ){

			buildTween(0)

		} else {

			buildTween(
				(direction === "top" ? deltaYforScroll : -deltaYforScroll)
			)
			
		}

	}

	function buildTween(destinationY){

		const isStop = destinationY === 0
		let tweenDuration = isStop ? deltaYforScrollDuration * 6 : deltaYforScrollDuration

		if( tl ){
			tl.kill()
			tl = null
		}

		tl = new TimelineMax()

		// console.log("buildTween triggered : destinaltionY : ", destinationY)

		const animatedObject = { dynamicCameraY: cameraDeltaY.value }

		tl.to(
			animatedObject, 
			{
				duration: tweenDuration, 
				dynamicCameraY : destinationY,
				ease: isStop ? "elastic" : "easeIn",

				onUpdate: () => {
					cameraDeltaY.value = animatedObject.dynamicCameraY
				},
				
				onComplete: () => {
					tl = null
				}
			}
		);

	}

}

// * * * * * * * * * * *


// - - - - Permanent rotation logic
watch(renderEnabled, () => {

	nextTick(() => {

		const permanentRotationKeys = Object.keys(props.permanentRotationIncrement)

		if( permanentRotationKeys.length ) {

			// ! update rotation PERMANENTLY !
			// onBeforeRender() is a specific event coming from TroisJS (not vue)
			// https://troisjs.github.io/guide/core/renderer.html#events-api-v0-3
			rendererElement.value.onBeforeRender(() => {
				// "each three render frame : do this :"
				updateMesh();
			})

		}

	})

})

function updateMesh(){

	Object.keys(props.permanentRotationIncrement).forEach(key => {
		boxOneElement.value.mesh.rotation[key] += props.permanentRotationIncrement[key]
	})

}


</script>

<template>

	<div class="main-cube-container">
		
		<p class="debug">

			<div v-if="props.mouseSensitive">
				x: {{ mouseX.toFixed(3) }}
				<br>
				y: {{ mouseY.toFixed(3) }}
			</div>

			<div v-if="props.scrollSensitive">
				scroll : {{ directions }}
			</div>

			<button @click="reduceItemSize = !reduceItemSize">toggle main-cube-container width</button>
		</p>
	
		<div ref="mainWrapper" 
			class="main-wrapper"
			:class="{ 'reduced': reduceItemSize }"
		>
	
			<Renderer  
				v-if="renderEnabled"
				ref="rendererElement"
				antialias
				:alpha="true"
				:width="new String(rendererElementBoundings.width)"
				:height="new String(rendererElementBoundings.height)"
			>
			<!-- we use 'new String() constructor because only string are expected for theses attributes' -->
			<!-- :orbit-ctrl="{ enableDamping: true }"  -->
	
				<Camera 
					:position="{ 
						z: 10,
						y: cameraDeltaY
					}" 
					:far="30"
					:lookAt="new Object({ x: 0, y: 0, z: 0 })"
				/>
	
				<Scene>
	
					<!-- <AmbientLight color="#00FF00" :intensity="1" /> -->
	
					<PointLight 
						:position="{ 
							x: 5 * Math.abs(cameraDeltaY / 100)
						}" 
						:intensity="1.5" 
						color="#3100bb"
					/>
	
					<PointLight 
						:position="{ 
							x: 0.335,
							y: 0.007,
							z: (Math.abs(cameraDeltaY) / 10) * 1
						}" 
						:intensity="0.15 * (Math.abs(cameraDeltaY) / 10)"
						color="#00FF00"
					/>
	
					<Box 
						:size="3" 
						ref="boxOneElement" 
						:rotation="{ 
							x: Math.PI / 2 + mouseX,
							y: Math.PI / 4 + mouseY,
							z: Math.PI / 8 + (cameraDeltaY / 100)
						}"
						:position="{
							z: (cameraDeltaY / 100) + mouseX + mouseY
						}"
					>
	
						<!-- <SubSurfaceMaterial /> -->
						<!-- <ToonMaterial /> -->
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

	</div>

</template>


<style lang="scss" scoped>

.main {

	&-cube-container {
		display: block;
		position: relative;
		width: 100%;
		height: 100%;

		.debug {
			display: block;
			position: absolute;
			top: 10px;
			left: 10px;
			z-index: 50;
		}
	}

	&-wrapper {
		z-index: 40;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 450px;
		border: solid 1px rgb(131, 131, 131);
		
		color: currentColor;

		transition: all 2s ease;

		&.reduced {
			width: 40%;
			height: 200px;
		}
	 
	}
	
}

</style>
