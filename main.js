const pdfFile = document.getElementById('pdf-file');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');
const itemCanvas = document.getElementById('item-canvas');
const itemContext = itemCanvas.getContext('2d');
var settingsPanel = document.getElementById('action');
// const selectedMenu = document.getElementById('selected').value;
var items = [];
var editingItem = null;

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

				itemCanvas.width = viewport.width;
				itemCanvas.height = viewport.height;

				page.render({
					canvasContext: pdfContext,
					viewport: viewport
				});
			});
		});
	};

	fileReader.readAsArrayBuffer(file);
});

itemCanvas.addEventListener('click', function(event) {
	const selectedMenu = document.getElementById('selected').value;
  // var x = event.pageX - itemCanvas.offsetLeft;
  // var y = event.pageY - itemCanvas.offsetTop;
	var x = event.offsetX;
	var y = event.offsetY;
  for (var i = items.length - 1; i >= 0; i--) {
		console.log(items)
    var item = items[i];
    var itemX = item.x;
    var itemY = item.y;
    var itemWidth = itemContext.measureText(item.text).width;
    var itemHeight = parseInt(item.fontSize);
    if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemHeight) {
      editingItem = item;
			showSettings(item);
      return;
    }
  }
	if (selectedMenu == "text") {
		const itemText = addText(x, y);
		if (itemText) {
			items.push(itemText);
		}
    drawItems();
	}
	hideSettings();
});

function deleteItem() {
  var index = items.indexOf(editingItem);
  items.splice(index, 1);
  drawItems();
	editingItem = null;
	hideSettings();
}

function showSettings(item) {
	const selectedMenu = document.getElementById('selected').value;
	if (selectedMenu == "text") {
		settingsPanel.innerHTML = generateTextSettings(item);
	}
}

function hideSettings() {
	settingsPanel.innerHTML = '';
}

function drawItems() {
  itemContext.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
		if (item.type == "text") {
			itemContext.font = item.fontStyle + " " + item.fontWeight + " " + item.fontSize + " " + item.font;
			itemContext.fillStyle = item.color;
			itemContext.textBaseline = "top";
			itemContext.textAlign = "left";
			itemContext.fillText(item.text, item.x, item.y);
		}
  }
}
