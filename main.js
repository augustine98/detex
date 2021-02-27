let model;
let CLASSES = {
	0 : 'Disease',
	1 : 'Normal'
};

console.log(typeof(CLASSES));
let selected_model;

async function loadModel() {
	console.log("model loading..");
	model = undefined;
	
	selected_model = document.getElementById("model-selector").value;

	if(selected_model == "pneumonia")
		{
			model = await tf.loadLayersModel('./models/pneumonia_model/model.json');
			CLASSES[0] = 'Pneumonia';
		}
	else if(selected_model == "brain-tumour")
		{
			model = await tf.loadLayersModel('./models/tumor_model/model.json');
			CLASSES[0] = 'Brain Tumour';
		}
	console.log("model loaded..");
}

async function loadFile() {
	document.getElementsByClassName("demo-output")[0].style.display = "flex";
	document.getElementById("select-file-box").style.display = "table-cell";
  	document.getElementById("predict-box").style.display = "table-cell";
	document.getElementById("predict-list").innerHTML = "";
	document.getElementById("prediction").innerHTML = "";

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
	let tensor = preprocessImage(image);

	let predictions = await model.predict(tensor).data();
	let className , probablity;
	let tmp;
	if(predictions[0] > 0.5)
		{
			className = CLASSES[0];
			probablity = predictions[0];
			tmp = "has ";
		}
	else 
		{
			className = CLASSES[1];
			probablity = 1 - predictions[0];
			tmp = "is ";
		}
	probablity*=100;
	document.getElementById("predict-box").style.display = "block";
	document.getElementById("prediction").innerHTML = "The patient "+ tmp + className + "<br> with a <strong>" + probablity.toFixed(2) + "%</strong> chance";

}

function preprocessImage(image) {
	return tf.browser.fromPixels(image)
		.resizeNearestNeighbor([150, 150])
		.toFloat().div(tf.scalar(255.0)).expandDims();
}


function refresh()
{
	document.getElementById("predict-list").innerHTML = "";
	document.getElementById("prediction").innerHTML = "";
	loadModel();
}