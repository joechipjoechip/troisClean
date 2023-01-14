<script setup>

import CubesParty from "./components/CubesParty.vue"

import { useUserInteractions } from "./composables/userInteractions"

useUserInteractions()

	
</script>

<template>
	<div class="app-wrapper">
    
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
    background: url(./assets/images/wallpaper.jpg);
    background-size: cover;
  }
}
</style>
