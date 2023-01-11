import { ref, onMounted, onUnmounted } from 'vue'


export function useMouseNormalised( element ) {

  const x = ref(0)
  const y = ref(0)


  function computePos( event ){
  
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
      
        x.value = (((event.offsetX +  element.value.offsetWidth / 2) /  element.value.offsetWidth) - 1) * 2

        y.value = (((event.offsetY +  element.value.offsetHeight / 2) /  element.value.offsetHeight) - 1) * -2
  
    }
  
    
  }

  onMounted(() => element.value.addEventListener('mousemove', computePos))
  onUnmounted(() => element.value.removeEventListener('mousemove', computePos))

  // expose managed state as return value
  return { x, y }

}
