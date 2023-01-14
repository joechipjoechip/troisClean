<script setup>

import { inject, ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'

import { TimelineLite } from "gsap/all";
import { useHandleResize } from "../composables/handleResize"
import { useMouseNormalised } from "../composables/computePos"
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
	},
	scrollAnimDuration: {
		type: Number,
		default: 0.5
	},
	scrollAnimDelta: {
		type: Number,
		default: 5
	}
})

const bus = inject("BUS")
const store = inject("STORE")

const renderEnabled = ref(false)
const reduceItemSize = ref(false)

defineExpose({ 
	renderEnabled 
})

onMounted(() => {
	
	renderEnabled.value = true

	handleResize()

})



// * * * Resize Logic :
const handleResizeThrolttled = useThrottleFn(handleResize, 150)
const rendererElementBoundings = reactive({})

const mainWrapper = ref(null)
const rendererElement = ref(null)

function handleResize(){
	// console.log("handleResize")
	rendererElementBoundings.width = mainWrapper.value.getBoundingClientRect().width
	rendererElementBoundings.height = mainWrapper.value.getBoundingClientRect().height
}

useHandleResize(handleResizeThrolttled, mainWrapper)

watch(rendererElementBoundings, 
	( newVal ) => {
		rendererElement.value?.three.setSize(newVal.width, newVal.height)
	}
)
// * * * * * * * * * * *



// * * * * Mouse Sensitive Logic :
let mouseX, mouseY

if( props.mouseSensitive ){
	mouseX = useMouseNormalised().x
	mouseY = useMouseNormalised().y
} else {
	mouseX = 0.000
	mouseY = 0.000
}
// * * * * * * * * * * * * * * * * * * * 


// * * * * * Scroll Logic 

const cameraDeltaY = ref(0)

if( props.scrollSensitive ){

	onMounted(() => {
		bus.on("main-touch-end", () => dispatchDirection("stop"))
	})

	onBeforeUnmount(() => {
		bus.off("main-touch-end", () => dispatchDirection("stop"))
	})

	watch(
		store.userInteractions.scroll, 
		newObjScroll => {

			const { isScrolling, directions } = newObjScroll

			if( !isScrolling ){
				dispatchDirection("stop")
			} else {
				const goodDirection = Object.keys(directions).find(key => directions[key]) || "stop"
				dispatchDirection(goodDirection)
			}
	
		}
	)



	function dispatchDirection( direction ){
		// console.log("dispatch triggered : direction : ", direction)

		if( direction === "stop" ){

			buildTween(0)

		} else {

			buildTween(
				(direction === "top" ? props.scrollAnimDelta : -props.scrollAnimDelta)
			)
			
		}

	}


	let tl = null

	function buildTween(destinationY){

		const isStop = destinationY === 0
		let tweenDuration = isStop ? props.scrollAnimDuration * 6 : props.scrollAnimDuration

		if( tl ){
			tl.kill()
			tl = null
		}

		tl = new TimelineLite()

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
const axes = ["x", "y", "z"]
const permanentRotationMoving = reactive({})

if( Object.keys(props.permanentRotationIncrement).length ) {

	dispatchRotations()

	function dispatchRotations(){

		Object.keys(props.permanentRotationIncrement).forEach(key => {

			if( !axes.includes(key) ){ return }

			buildTweenForPermanentRotation(key, 0, props.permanentRotationIncrement[key].angle)

		})

	}

	function buildTweenForPermanentRotation(key, beginAngle, endAngle){

		let tl = new TimelineLite()

		const animatedObject = { rotationValue: beginAngle }

		tl.to(
			animatedObject,
			{
				duration: props.permanentRotationIncrement[key].duration,
				rotationValue: endAngle,
				ease: "easeInOut",

				onUpdate: () => {
					permanentRotationMoving[key] = animatedObject.rotationValue
				},

				onComplete: () => {
					tl = null
					buildTweenForPermanentRotation(key, endAngle, beginAngle)
				}
			}
		)

	}

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
	
					<AmbientLight color="#30f1ff" :intensity="0.3" />
	
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
						:rotation="{ 
							x: Math.PI / 2 + mouseX + (permanentRotationMoving.x || 0),
							y: Math.PI / 4 + mouseY + (permanentRotationMoving.y || 0),
							z: Math.PI / 8 + (cameraDeltaY / 100) + (permanentRotationMoving.z || 0)
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
    position: relative;
    display: block;
    width: 100%;
    height: 100%;

    .debug {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 50;
      display: block;
    }
  }

  &-wrapper {
    position: relative;
    z-index: 40;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 450px;
    color: currentColor;
    border: solid 1px rgb(131, 131, 131);
    transition: all 2s ease;

    &.reduced {
      width: 40%;
      height: 200px;
    }
  }
}
</style>
