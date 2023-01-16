<script setup>

import InteractiveCube from "./InteractiveCube.vue"

</script>

<template>
	<div>

		<interactive-cube 
			content-type="image"
			content-source="https://media.istockphoto.com/id/1191719793/photo/3d-abstract-background-with-ultraviolet-neon-lights-empty-frame-cosmic-landscape-glowing.jpg?b=1&s=612x612&w=0&k=20&c=xV2aK40vtrlr_Bx8Rl9SDnWRDG3AUgRcYGKTeSTWP6k="
		
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