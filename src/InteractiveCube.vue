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

const enlargeMainWrapper = ref(false)

const cameraDeltaY = ref(0)
const { directions } = props.scrollSensitive ? useScroll(window) : { directions: {} }

let mouseX, mouseY



defineExpose({ 
	renderEnabled 
})

onMounted(() => {
	
	renderEnabled.value = true

	handleResize()

})

watch(renderEnabled, () => {
	nextTick(() => {

		if( Object.keys(props.permanentRotationIncrement).length ) {

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
	
	const deltaYforScroll = 8
	const deltaYforScrollDuration = 0.35

	let tl = null

	watch(
		[() => directions.top, () => directions.bottom], 
		( [top, bottom]) => {

			const infos = { top, bottom }

			const goodDirection = Object.keys(infos).find(key => infos[key]) || "stop"

			dispatchDirection(goodDirection)
	
		}
	)

	function dispatchDirection( direction ){
		console.log("dispatch triggered : direction : ", direction)

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

		console.log("buildTween triggered : destinaltionY : ", destinationY)

		const animatedObject = { dynamicCameraY: cameraDeltaY.value }

		tl.to(
			animatedObject, 
			{
				duration: tweenDuration, 
				dynamicCameraY : destinationY,
				ease: isStop ? "elastic" : "easeInOut",

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
function updateMesh(){

	Object.keys(props.permanentRotationIncrement).forEach(key => {
		return // disable when scroll logic is ok
		if( !["x", "y", "z"].includes(key) ){
			return
		}

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

			<button @click="enlargeMainWrapper = !enlargeMainWrapper">toggle main-cube-container width</button>
		</p>
	
		<div ref="mainWrapper" 
			class="main-wrapper"
			:class="{ 'enlarged': enlargeMainWrapper }"
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
					:far="5000"
					:lookAt="{ x: 0, y: 0, z: 0 }"
				/>
	
				<Scene>
	
					<!-- <AmbientLight color="#00FF00" :intensity="1" /> -->
	
					<PointLight 
						:position="{ 
							x: -50 * mouseX,
							z: -10 * mouseY
						}" 
						:intensity="2" 
						color="#3100bb"
					/>
	
					<PointLight 
						:position="{ 
							x: -5 * mouseX,
							y: -5 * mouseY
						}" 
						:intensity="Math.abs(mouseX / 10) * 1.7"
						color="#d797a8"
					/>
	
					<Box 
						:size="3" 
						ref="boxOneElement" 
						:rotation="{ 
							x: Math.PI / 2 + mouseX,
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
		width: 60%;
		height: 300px;
		border: solid 1px rgb(131, 131, 131);
		
		color: currentColor;

		transition: all 2s ease;

		&.enlarged {
			width: 100%;
			height: 400px;
		}
	 
	}
	
}

</style>
