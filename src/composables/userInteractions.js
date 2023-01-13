import { inject, onMounted, onBeforeUnmount } from 'vue'


export function useUserInteractions() {
	const bus = inject("BUS")

	onMounted(() => {

		window.addEventListener("touchstart", handleTouchStart)
		window.addEventListener("touchend", handleTouchEnd)
		window.addEventListener("touchmove", handleTouchMove)

		window.addEventListener("mousedown", handleTouchStart)
		window.addEventListener("mouseup", handleTouchEnd)
		window.addEventListener("mousemove", handleTouchMove)

	})

	onBeforeUnmount(() => {

		window.removeEventListener("touchstart", handleTouchStart)
		window.removeEventListener("touchend", handleTouchEnd)
		window.removeEventListener("touchmove", handleTouchMove)

		window.removeEventListener("mousedown", handleTouchStart)
		window.removeEventListener("mouseup", handleTouchEnd)
		window.removeEventListener("mousemove", handleTouchMove)

	})

	function handleTouchStart( event ){
		bus.emit("main-touch-start", event)
	}
	
	function handleTouchEnd( event ){
		bus.emit("main-touch-end", event)
	}
	
	function handleTouchMove( event ){
		bus.emit("main-touch-move", event)
	}

}
