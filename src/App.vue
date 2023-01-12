<template>
	<div class="app-wrapper">

		<button @click="handleToggle">toggle enable cube</button>
		<interactive-cube ref="cube" />

	</div>
</template>

<script setup>
import InteractiveCube from "./InteractiveCube.vue"

import { ref } from "vue"

const cube = ref(null)


function handleToggle(){

	cube.value.renderEnabled = !cube.value.renderEnabled

}
	
</script>

<style lang="scss" scoped>

body {
  padding: 0;
  margin: 0;
}

.app {
  &-wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: orange;

  }
}
</style>