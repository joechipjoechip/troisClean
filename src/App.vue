<script setup>

import CubesParty from "./components/CubesParty.vue"
import Cover from "./components/Cover.vue"

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

    <cover />
	
		<cubes-party />

	</div>
</template>

<style lang="scss">
@import "./assets/fonts/rubik/stylesheet.css";

:root {
  --color-main-bg: #000;
  --color-glass-shadow-out: rgba(0,0,0, 0.2);
  --color-glass-shadow-in: rgba(255,255,255, 0.2);

  --border-radius-base: 1rem;
}

body {
  padding: 0;
  margin: 0;
  color: white;

  font-family: "Rubik";

  .no-scroll {
		overflow: hidden;
	}

	* {
		-webkit-tap-highlight-color: transparent;
	}

}

.app {
  &-wrapper {
    background-color: var(--color-main-bg);
    background: url(./assets/images/wallpaper.jpg);
    // background-size: cover;

    .debug {
      &-fps {
        position: fixed;
      }
    }
  }
}

.font {
  &-big {
    font-size: 3rem;
    font-weight: 800;
  }
}
</style>
