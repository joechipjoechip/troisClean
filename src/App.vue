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

<style lang="scss">

body {
  padding: 0;
  margin: 0;

  color: white;
}

.app {
  &-wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100vh;
    // background-color: #000;

	background: url(https://images.unsplash.com/photo-1581610186406-5f6e9f9edbc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1400&q=80);

	background-size: cover;

  }
}
</style>