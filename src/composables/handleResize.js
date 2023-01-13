import { onMounted, onUnmounted } from 'vue'

export function useHandleResize( fn, element ) {
 
    if( element ){
        // console.log("resize event set -> via resizeObserver on ", element)

        const resizeObserver = new ResizeObserver(() => {
            // console.log("resizeObserver triggered")
            fn()
        });
        
        onMounted(() => resizeObserver.observe(element.value))
        onUnmounted(() => resizeObserver.unobserve(element.value))

    } else {
        // console.log("resize event set -> directly on window")

        onMounted(() => window.addEventListener('resize', fn))
        onUnmounted(() => window.removeEventListener('resize', fn))

    }

}
