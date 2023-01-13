<script setup>
import InteractiveCube from "./InteractiveCube.vue"

</script>

<template>
	<div>

		<interactive-cube 
			ref="cube" 
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
			ref="cube" 
			:mouse-sensitive="false"

			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"
			:scroll-anim-delta="15"
		/>

		<interactive-cube 
			ref="cube" 
			:mouse-sensitive="false"
			:scroll-sensitive="true"
			:scroll-anim-duration="0.5"
		/>

		<interactive-cube 
			ref="cube" 
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