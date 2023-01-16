<script setup>

import CubesParty from "./components/CubesParty.vue"

import { watch, inject } from "vue"

import { useScroll } from "@vueuse/core"
import { useFps } from "@vueuse/core"

const store = inject("STORE")

const fps = useFps()


// * * * * Scroll logic * * * * *
const { directions, isScrolling } = useScroll(window, { behavior: "smooth" })

watch(
	[isScrolling, directions], 
	([freshIsScrolling, freshDirections]) => {

		store.userInteractions.scroll.isScrolling = freshIsScrolling
		store.userInteractions.scroll.directions = freshDirections

	}
)
// * * * * * * * * * * * * * * *
	
</script>

<template>
	<div class="app-wrapper">

		<p class="debug-fps">
			{{ fps }}
		</p>
	
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

    .debug {
      &-fps {
        position: fixed;
      }
    }
  }
}
</style>
