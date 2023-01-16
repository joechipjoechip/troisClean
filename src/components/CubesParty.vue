<script setup>

import InteractiveCube from "./InteractiveCube.vue"

</script>

<template>
	<div>

		<interactive-cube 
			content-type="image"
			content-source="/src/assets/images/imageTest.jpeg"
		
			:mouse-sensitive="true"
			:mouse-influence="{ x: 0.4, y: 0.2 }"
			:scroll-sensitive="true"
			:scroll-anim-duration="0.4"
			:scroll-anim-delta="8"
			
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
						start: -Math.PI / 16,
						end: Math.PI / 16
					}, 
					duration: 1.5
				},
			}"
			
		/>

		<interactive-cube 
			:mouse-sensitive="true"
			:mouse-influence="{ x: 0.4, y: 0.2 }"
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
						end: Math.PI / 8
					}, 
					duration: 4 
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