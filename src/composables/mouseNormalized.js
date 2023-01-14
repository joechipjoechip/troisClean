import { ref } from 'vue'

import { useEventListener } from "@vueuse/core"

export function useMouseNormalised( element ) {
  // Can handle :
  // - HTMLElement : specific element as reference for the compute
  // - empty : general window as reference for the compute

  // The aim of this function is to provide mouse position
  // with this format : [-1, 1] (from -1 to 1)
  // for both x and y

  const x = ref(0)
  const y = ref(0)
  const isWindow = !element


  // EVENT MANAGER
  useEventListener( (isWindow ? window : element.value), "mousemove", computePosition)


  // DO THE MAGIC
  function computePosition( event ){
  
    if( event.touches?.[0] ){
  
      const goodTouch = Array.from(event.touches).find(touch => touch.target.dataset.role === this.role);
      
        x.value = Math.min(1,
          Math.max(
            -1,
            (((goodTouch.clientX - left) / width) - 0.5) * 2
          )
        )

        y.value = Math.min(1,
          Math.max(
            -1,
            (((goodTouch.clientY - top) / height) - 0.5) * -2
          )
        )
      
  
  
    } else {

      if( isWindow ){

        x.value = (((event.clientX +  window.innerWidth / 2) /  window.innerWidth) - 1) * 2

        y.value = (((event.clientY +  window.innerHeight / 2) /  window.innerHeight) - 1) * -2

      } else {

        x.value = (((event.offsetX +  element.value.offsetWidth / 2) /  element.value.offsetWidth) - 1) * 2
  
        y.value = (((event.offsetY +  element.value.offsetHeight / 2) /  element.value.offsetHeight) - 1) * -2

      }
  
    }
    
  }

  // expose managed state as return value
  return { x, y }

}
