
<script setup>

</script>

<template>
	<div class="cover-wrapper">
		
		<div class="cover-inner">

			<img src="https://via.placeholder.com/350" alt="">

			<div class="cover-inner_text">
				hey salut
			</div>
			
		</div>

	</div>
</template>

<style lang="scss" scoped>

.cover {
  &-wrapper {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  &-inner {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    border: solid 2px red;

    column-gap: 20px;


    &_text {
      width: 100%;
      border: solid 1px green;
    }
  }
}
</style>
