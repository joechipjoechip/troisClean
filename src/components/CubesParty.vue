<script setup>

import InteractiveCube from "./InteractiveCube.vue"

</script>

<template>
	<div>

		<!-- <interactive-cube 

			content-type="image"
			content-source="https://media.istockphoto.com/id/1191719793/photo/3d-abstract-background-with-ultraviolet-neon-lights-empty-frame-cosmic-landscape-glowing.jpg?b=1&s=612x612&w=0&k=20&c=xV2aK40vtrlr_Bx8Rl9SDnWRDG3AUgRcYGKTeSTWP6k="
		
			:mouse-sensitive="true"
			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"
			:scroll-anim-delta="17"
		/> -->

		<interactive-cube  
			:mouse-sensitive="true"

			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"
			:scroll-anim-delta="5"

			:permanent-rotation-increment="{ 
				x: { angle: 6, duration: 15 },
				y: { angle: 2, duration: 2 },
				z: { angle: 10, duration: 30 }
			}"
		/>

		<interactive-cube  
			:mouse-sensitive="false"

			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"
			:scroll-anim-delta="7"

			:permanent-rotation-increment="{ 
				x: { angle: 6, duration: 150 },
				y: { angle: 2, duration: 20 },
				z: { angle: 10, duration: 300 }
			}"
		/>

		<interactive-cube  
			:mouse-sensitive="false"
			
			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"

			:permanent-rotation-increment="{ 
				x: { angle: 5, duration: 5 },
				y: { angle: 25, duration: 10 },
				z: { angle: 1, duration: 2 }
			}"
		/>
		<interactive-cube  
			:mouse-sensitive="true"
			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"
			:scroll-anim-delta="17"

			:permanent-rotation-increment="{ 
				x: { angle: 6, duration: 15 },
				y: { angle: 90, duration: 20 },
				z: { angle: 10, duration: 30 }
			}"
		/>

		<interactive-cube  
			:mouse-sensitive="false"
			
			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"

			:permanent-rotation-increment="{ 
				x: { angle: 5, duration: 5 },
				y: { angle: 25, duration: 10 },
				z: { angle: 1, duration: 2 }
			}"
		/>

	</div>
</template>


<style scoped>

</style>