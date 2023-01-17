export function useExtensionDetector( contentSource ){

	let sourceType = "none"

	// determiner si on a image / video / model
	const extension = contentSource.split(".")[1]

	const imageRegEx = new RegExp("jpg|jpeg|gif|png", "i")
	const modelRegEx = new RegExp("gltf|glb|fbx", "i")
	const videoRegEx = new RegExp("mp4", "i")

	if( extension.match(imageRegEx) ){
		sourceType = "image"
	} else if ( extension.match(modelRegEx) ){
		sourceType = "model"
	} else if ( extension.match(videoRegEx) ){
		sourceType = "video"
	}

	return sourceType
}