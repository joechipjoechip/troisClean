
<script setup>

import { ref, onMounted } from "vue"

import { useElementVisibility } from "@vueuse/core"


import { wordingCover } from "./../wordings/cover"

import { TimelineLite } from "gsap"


const coverWrapper = ref(null)

const isVisible = useElementVisibility(coverWrapper)

const wording = ref(wordingCover.presentation)

const animationData = {
	state: {
		init: {
			opacity: 0,
			transform: "translate3d(0, 40px, 0)"
		},
		altered: {
			opacity: 1,
			transform: "translate3d(0, 0, 0)"
		}
	},
	timing: {
		duration: 0.4,
		stagger: 0.15
	}
}


function handleButtonClickAdd(){
	console.log("clciked add")
	wording.value.push("testtest")
}

function resetStyles( element ){
	element.style.opacity = animationData.state.init.opacity
	element.style.transform = animationData.state.init.transform
}

function onEnter( element, done ){
	buildStaggerTimeline(element, done, true)
}

function onLeave( element, done ){
	buildStaggerTimeline(element, done, false)
}

function buildStaggerTimeline( element, done, polarity ){
	const tl = new TimelineLite()
	const goodKey = polarity ? "altered" : "init"

	tl.to(element, {
		...animationData.state[goodKey],

		duration: animationData.timing.duration,
		delay: (element.dataset.spanIndex * (animationData.timing.stagger)),

		onComplete: done
	})

}

</script>

<template>
	<div class="cover-wrapper" ref="coverWrapper">
		
		<div class="cover-inner">

			<img src="https://via.placeholder.com/350" alt="">

			<div class="cover-inner_text">

				<transition-group 
					tag="div"
					:css="false"
					class="transition-container"
					@before-enter="resetStyles"
					@enter="onEnter"
					@leave="onLeave"
					@after-leave="resetStyles"
				>
				
					<span 
						class="animated-span"
						v-if="isVisible"
						v-for="(sentence, index) in wording"
						:key="index"
						:data-span-index="index"
						v-html="sentence"
					>
					</span>

				</transition-group>

			</div>

		</div>

	</div>
</template>

<style lang="scss" scoped>
@import "./../styles/mixins.scss";

.cover {
  &-wrapper {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  &-inner {
	@include glass-base;
	
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    column-gap: 3rem;

    width: 80%;
	padding: 20px;

	img {
		border-radius: var(--border-radius-base);
	}

    &_text {
      width: 100%;
	  font-size: 2em;

	  padding: 20px;

	  .animated-span {
		display: block;
		overflow: hidden;
	  }
    }
  }
}

</style>
