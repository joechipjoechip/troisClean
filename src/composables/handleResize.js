import { onMounted, onBeforeUnmount } from 'vue'

import { useEventListener } from "@vueuse/core"

export function useHandleResize( fn, element ) {
 
    if( element ){
        // console.log("resize event set -> via resizeObserver on ", element)

        const resizeObserver = new ResizeObserver(() => {
            // console.log("resizeObserver triggered")
            fn()
        });
        
        onMounted(() => resizeObserver.observe(element.value))
        onBeforeUnmount(() => resizeObserver.unobserve(element.value))

    } else {
        // console.log("resize event set -> directly on window")

        useEventListener(window, "resize", fn)

    }

}
