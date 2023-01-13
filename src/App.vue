<script setup>

import CubesParty from "./components/CubesParty.vue"

import { useUserInteractions } from "./composables/userInteractions"

useUserInteractions()

	
</script>

<template>
	<div class="app-wrapper">

    <button @click="handleCheckBus">bus check</button>
    <cubes-party />

	</div>
</template>

<style lang="scss">

body {
  padding: 0;
  margin: 0;
  color: white;
}

.app {
  &-wrapper {
    background-color: rgb(33, 33, 33);
  }
}
</style>
