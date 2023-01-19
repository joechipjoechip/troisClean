<script setup>

import { inject } from "vue"

import { fragmentShader } from "./../shaders/fragment.js";
import { vertexShader } from "./../shaders/vertex.js";

import { TimelineLite } from "gsap"

const props = defineProps({
	isVisible: {
		type: Boolean,
		default: false
	},
	isContent: {
		type: Boolean,
		default: false
	},
	animations: {
		type: Object,
		required: true
	},
	scrollInfluenceCameraY: {
		type: Number,
		default: 0
	},
	contentSource: {
		type: String,
		default: ""
	},
	contentType: {
		type: String,
		default: ""
	},
	mousePosition: {
		type: Object,
		default: { x: 0, y: 0 }
	}
})

const store = inject("STORE")



// * * * * Content logic
const imageContent = new Image()
const animatedObject = { progress: 0 }
const uniforms = { 
	uProgress: { 
		value: 0.0
	},
	uMouse: {
		value: {
			x: 0,
			y: 0
		}
	},
	uScrollInfluence: {
		value: 0.0
	}
}
let tl

if( props.contentType === "image" ){
	imageContent.src = props.contentSource
}

function handleImageClick( event ){
	console.log("image clicked")

	if( tl ){
		tl.kill()
		animatedObject.progress = 0
		tl = null
	}
	
	tl = new TimelineLite()

	tl.to(
		animatedObject, 
		{
			duration: 2, 
			progress : 1,
			ease: "easeIn",

			onUpdate: () => {
				console.log("onUpdate : ", uniforms.uMouse.value.x)
				uniforms.uProgress.value = animatedObject.progress
				// uniforms.uMouse.value.x = props.mousePosition.x
				// uniforms.uMouse.value.y = props.mousePosition.y
			},
			
			onComplete: () => {
				tl = null
				animatedObject.progress = 0
			}
		}
	);

}

// watch(
// 	() => store.userInteractions.scrollInfluence, 
// 	newVal => uniforms.uScrollInfluence.value = newVal / 10
	
// )




// * * * * Model logic
function gltfOnReady( model ){
	console.log("wsh le gltf on ready", model)	
}

function gltfOnError( event ){
	console.log("wsh le gltf on error", event)	
}

function gltfOnProgress( event ){
	console.log("wsh le gltf on progress", event)	
}


</script>

<template>

	<Camera 
		:position="{ 
			z: 10,
			y: scrollInfluenceCameraY
		}" 
		:far="30"
		:lookAt="new Object({ x: 0, y: 0, z: 0 })"
	/>

	<Scene>

		<!-- éventuellement pour faire du canvasTexture -->
		<!-- <canvas style="display: none"></canvas> -->

		<AmbientLight color="#30f1ff" :intensity="0.3" />

		<Group v-if="isVisible">

			<Group v-if="isContent">

				<Group v-if="props.contentType === 'image'">

					<Plane 
						:widthSegments="20"
						:heightSegments="20"
						:scale="new Object({ 
							x: imageContent.width / 50, 
							y: imageContent.height / 50
						})"
						:rotation="animations.object3d.rotation"
						:position="animations.object3d.position"
						@click="handleImageClick"
					>

						<ShaderMaterial :props="{ fragmentShader, vertexShader, uniforms, wireframe: true }">
							<Texture :src="contentSource" uniform="myTextureOne"/>
							<Texture :src="contentSource.replace('imageTest.jpeg', 'wallpaper.jpg')" uniform="myTextureTwo"/>
						</ShaderMaterial>

					</Plane>

				</Group>

				<Group v-if="props.contentType === 'model'">

					<PointLight 
						:position="new Object({
							y: 5,
							z: 30
						})" 
						:intensity="animations.light.first.intensity" 
						color="#FFFFFF"
					/>
					
					<GltfModel
						:src="contentSource"
						@load="gltfOnReady"
						@progress="gltfOnProgress"
						@error="gltfOnError"

						:rotation="animations.object3d.rotation"
						:position="animations.object3d.position"
						:scale="new Object({ 
							x: 5, 
							y: 5
						})"
					/>

				</Group>

			</Group>

			<Group v-else>

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

				<Box 
					:size="2.5" 
					:rotation="animations.object3d.rotation"
					:position="animations.object3d.position"
				>
					<SubSurfaceMaterial />
				</Box>

			</Group>


		</Group>

	</Scene>

</template>

<style scoped>

</style>