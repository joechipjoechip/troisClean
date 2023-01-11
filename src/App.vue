<template>
	<div class="app-wrapper">
		<interactive-cube />
	</div>
</template>

<script setup>
import InteractiveCube from "./InteractiveCube.vue"
	
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

    p {
      display: block;
    }
  }
}
</style>