<script setup>

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
	contentSource: {
		type: String,
		default: ""
	},
	contentType: {
		type: String,
		default: ""
	},
	scrollInfluenceCameraY: {
		type: Number,
		default: 0
	}
})


// * * * * Content logic
const imageContent = new Image()

if( props.contentType === "image" ){
	imageContent.src = props.contentSource
}




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

		<AmbientLight color="#30f1ff" :intensity="0.3" />

		<Group v-if="isVisible">

			<Group v-if="!isContent">

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

			<Group v-else>

				<Group v-if="props.contentType === 'image'">

					<Plane 
						:size="10"
						:scale="new Object({ 
							x: imageContent.width / 50, 
							y: imageContent.height / 50
						})"
						:rotation="animations.object3d.rotation"
						:position="animations.object3d.position"
					>
						<BasicMaterial>
							<Texture :src="contentSource" />
						</BasicMaterial>

						<!-- <ShaderMaterial :props="{ 
							fragmentShader, vertexShader
						}">
							<Texture src="contentSource" uniform="myCustomTexture"/>
						</ShaderMaterial> -->

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


		</Group>

	</Scene>

</template>

<style scoped>

</style>