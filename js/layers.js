let model;
const CLASSES = {
	0 : 'Normal',
	1 : 'Pneumonia'
};

async function loadModel() {
	console.log("model loading..");
	modelName = "mobilenet";
	model = undefined;
	model = await tf.loadLayersModel('./model/model.json');
	console.log("model loaded..");
}

async function loadFile() {
	document.getElementById("select-file-box").style.display = "table-cell";
  	document.getElementById("predict-box").style.display = "table-cell";
	document.getElementById("prediction").innerHTML = "Click predict to find my label!";
	document.getElementById("predict-list").innerHTML = "";
  	var fileInputElement = document.getElementById("select-file-image");
    renderImage(fileInputElement.files[0]);
}

function renderImage(file) {
  var reader = new FileReader();
  reader.onload = function(event) {
    img_url = event.target.result;
    document.getElementById("test-image").src = img_url;
  }
  reader.readAsDataURL(file);
}


async function predButton() {
	if (document.getElementById("predict-box").style.display == "none") {
		alert("Please load an image using the 'Upload Image' button..")
	}
	let image  = document.getElementById("test-image");
	let tensor = preprocessImage(image, modelName);

	let predictions = await model.predict(tensor).data();
	let className , probablity;
	if(predictions[0] > 0.5)
		{
			className = CLASSES[0];
			probablity = predictions[0];
		}
	else 
		{
			className = CLASSES[1];
			probablity = 1 - predictions[0];
		}

	document.getElementById("predict-box").style.display = "block";
	document.getElementById("prediction").innerHTML = "Prediction <br><b>" + className + "</b>";

	var ul = document.getElementById("predict-list");
	ul.innerHTML = "";
	var li = document.createElement("LI");
	li.innerHTML = className + " " + probablity.toFixed(6);
	ul.appendChild(li);

}

function preprocessImage(image, modelName) {
	return tf.browser.fromPixels(image)
		.resizeNearestNeighbor([150, 150])
		.toFloat().div(tf.scalar(255.0)).expandDims();
}

