import { reactive } from "vue"

export const store = reactive({
	userInteractions: {
		scroll: {
			isScrolling: false,
			directions: {},
			influence: 0
		}
	}
})
