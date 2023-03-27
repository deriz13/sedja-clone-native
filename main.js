const pdfFile = document.getElementById('pdf-file');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

pdfFile.addEventListener('change', function() {
	const file = pdfFile.files[0];
	const fileReader = new FileReader();

	fileReader.onload = function() {
		const typedArray = new Uint8Array(this.result);
		pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
			pdf.getPage(1).then(function(page) {
				const viewport = page.getViewport({scale: 1});
				pdfCanvas.width = viewport.width;
				pdfCanvas.height = viewport.height;

				page.render({
					canvasContext: pdfContext,
					viewport: viewport
				});
			});
		});
	};

	fileReader.readAsArrayBuffer(file);
});

const selected = document.getElementById('selected');
selected.addEventListener('input', function() {
  alert(selected.value)
});