<script setup>

import { inject, ref, reactive, computed, watch, onMounted } from 'vue'

import { TimelineLite } from "gsap";
import { useHandleResize } from "../composables/handleResize"
import { useMouseNormalised } from "../composables/mouseNormalized"
import { useThrottleFn } from '@vueuse/core'
import { useElementVisibility } from '@vueuse/core'

import * as THREE from "three"

const props = defineProps({
	contentType: {
		type: String,
		default: "none"
	},
	contentSource: {
		type: String,
		default: ""
	},
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

const store = inject("STORE")

const mainWrapper = ref(null)

const renderEnabled = ref(false)
const reduceItemSize = ref(false)

const isPlane = props.contentType === 'none';

const mouseX = ref(props.mouseSensitive ? useMouseNormalised().x : 0)
const mouseY = ref(props.mouseSensitive ? useMouseNormalised().y : 0)

const cameraDeltaY = ref(0)

const permanentRotationMoving = reactive({
	x: 0,
	y: 0,
	z: 0
})

const animations = computed( () => {
	return {
		object3d: {
			rotation: {
				x: mouseX.value + permanentRotationMoving.x,
				y: mouseY.value + permanentRotationMoving.y,
				z: (cameraDeltaY.value / 100) + permanentRotationMoving.z
			},
			position: {
				x: 0,
				y: 0,
				z: (cameraDeltaY.value / 100) + mouseX.value + mouseY.value
			}
		},
		light: {
			first: {
				position: {
					x: 5 * Math.abs(cameraDeltaY.value / 100)
				},
				intensity: 1.5
			},
			second: {
				position: {
					x: 0.335,
					y: 0.007,
					z: (Math.abs(cameraDeltaY.value) / 10) * 1
				},
				intensity: 0.15 * (Math.abs(cameraDeltaY.value) / 10)
			}
		}
	}
})

onMounted(() => {
	
	renderEnabled.value = true

	handleResize()

})

defineExpose({ 
	renderEnabled 
})

// * * * * * * * * * * * * * * * * * * * * * * end of main stuffs * - * - *



// * * * Visibility logic :
const isVisible = useElementVisibility(mainWrapper)



// * * * Resize Logic :
const handleResizeThrolttled = useThrottleFn(handleResize, 150)
const rendererElementBoundings = reactive({})


const rendererElement = ref(null)

function handleResize(){
	rendererElementBoundings.width = mainWrapper.value?.getBoundingClientRect().width
	rendererElementBoundings.height = mainWrapper.value?.getBoundingClientRect().height
}

useHandleResize(handleResizeThrolttled, mainWrapper)

watch(rendererElementBoundings, 
	( newVal ) => {
		rendererElement.value?.three.setSize(newVal.width, newVal.height)
	}
)
// * * * * * * * * * * *

// * * * * * Scroll Logic 
if( props.scrollSensitive ){

	let tl = null

	watch(
		store.userInteractions.scroll, 
		newObjScroll => {

			const { directions, isScrolling } = newObjScroll

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

if( Object.keys(props.permanentRotationIncrement).length ) {

	dispatchRotations()

	function dispatchRotations(){

		Object.keys(props.permanentRotationIncrement).forEach(key => {

			if( !axes.includes(key) ){ return }

			buildTweenForPermanentRotation(key, 0, props.permanentRotationIncrement[key].angle)

		})

	}

	function buildTweenForPermanentRotation(key, beginAngle, endAngle){

		const tl = new TimelineLite()

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
					buildTweenForPermanentRotation(key, endAngle, beginAngle)
				}
			}
		)

	}

}

// * * * * Image / Video / None : logic : 
// let imageToDisplay = new THREE.Texture(props.contentSource);
// let videoToDisplay = new THREE.Texture(props.contentSource);

// if( props.contentType === "image" ){
// 	//
// }




// const videoTexture = new THREE.VideoTexture(this.video);
// const screenMaterial = new THREE.MeshBasicMaterial({ 
// 	map: videoTexture, 
// 	side: THREE.FrontSide, 
// 	toneMapped: false 
// });


</script>

<template>

	<div class="main-cube-container">
		
		<p class="debug">

			<!-- <div v-if="props.mouseSensitive">
				x: {{ mouseX.toFixed(3) }}
				<br>
				y: {{ mouseY.toFixed(3) }}
			</div> -->

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
						:position="animations.light.first.position" 
						:intensity="animations.light.first.intensity" 
						color="#3100bb"
					/>
	
					<PointLight 
						:position="animations.light.second.position" 
						:intensity="animations.light.second.intensity"
						color="#00FF00"
					/>

					<Group v-if="isVisible">

						<Box 
							v-if="isPlane"
							:size="2.5" 
							:rotation="animations.object3d.rotation"
							:position="animations.object3d.position"
						>
		
							<!-- <SubSurfaceMaterial /> -->
							<!-- <ToonMaterial /> -->
							<SubSurfaceMaterial />
		
						</Box>

						<Plane 
							v-else
							:size="12"
							:scale="new Object({ x: 6, y: 6, z: 6 })"
							:rotation="animations.object3d.rotation"
							:position="animations.object3d.position"
						>
							<PhongMaterial :props="{
								side: THREE.DoubleSide
							}">
								<Texture :src="props.contentSource" />
							</PhongMaterial>
		
						</Plane>

					</Group>
	
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
