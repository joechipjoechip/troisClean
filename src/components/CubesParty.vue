<script setup>

import InteractiveCube from "./InteractiveCube.vue"

</script>

<template>
	<div>

		<interactive-cube 
			content-source="/src/assets/images/imageTest.jpeg"
		
			:mouse-sensitive="true"
			:mouse-influence="{ x: 0.1, y: 0.02 }"
			:scroll-sensitive="true"
			:scroll-anim-duration="0.8"
			:scroll-anim-delta="3"
			
			:permanent-rotation-increment="{
				y: { 
					angle: {
						start: -Math.PI / 22,
						end: Math.PI / 22
					}, 
					duration: 4 
				},
				z: { 
					angle: {
						start: -Math.PI / 26,
						end: Math.PI / 26
					}, 
					duration: 15
				},
			}"
			
		/>

		<interactive-cube 
			content-source="/src/assets/models/eclair.gltf"

			:mouse-sensitive="true"
			:mouse-influence="{ x: -0.6, y: -0.6 }"
			:scroll-sensitive="true"
			:scroll-anim-duration="0.4"
			:scroll-anim-delta="8"
			
			:permanent-rotation-increment="{ 
				x: { 
					angle: {
						start: -Math.PI / 8,
						end: Math.PI / 4
					}, 
					duration: 4
				},
				y: { 
					angle: {
						start: -Math.PI / 8,
						end: Math.PI * 8
					}, 
					duration: 9
				}
			}"
		/>

		<interactive-cube  
			:mouse-sensitive="true"
			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"
			:scroll-anim-delta="17"

			:permanent-rotation-increment="{ 
				y: { 
					angle: {
						start: -Math.PI / 8,
						end: Math.PI / 8
					}, 
					duration: 4 
				},
				z: { 
					angle: {
						start: -Math.PI / 2,
						end: Math.PI * 4
					}, 
					duration: 1.5
				},
			}"
		/>

	</div>
</template>


<style scoped>

</style>