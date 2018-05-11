var
	colN = [0,1,2,3,4],
	rowN = [0,1,2,3,4];
var 
	colVector = document.getElementById('col-vector'),
	rowVector = document.getElementById('row-vector'),
	table = document.getElementById('table');

for (let i = 1; i < rowN.length; i++)
{
	createCell(i, 0, rowVector);
	for (let j = 1; j < colN.length; j++){
		createCell(i, j, table);

	}
}

for (let j = 1; j < colN.length; j++){
		createCell(0, j, colVector);
	}

	



function createCell(rowNum, colNum, parent){
	var nextColID,
		nextRowID,
		div = document.createElement('div');

	div.id = toID(rowN[rowNum], colN[colNum]);
	div.onmouseover = function(){
		hoverCell(div, true);
	};

	div.onmouseout = function(){
		hoverCell(div, false);
	}

// looking for correct position
	if (parent == table){
		div.className = "cell";		

		if (colNum >= colN.length - 1){
				nextColID = colN[1];
				nextRowID = rowN[rowNum + 1];
				parent.insertBefore(div, document.getElementById(toID(nextRowID, nextColID)));	
			}else{
				parent.insertBefore(div, null);
			}


	}else{
		div.className = "cell del";
		div.innerHTML="<i class='fas fa-minus'></i>";

		if (parent == colVector){
			div.onclick = function() {
				deleteCol(div);
			}
		}else{
			div.onclick = function() {
				deleteRow(div);
			}
		}
		parent.insertBefore(div, null);
	}
	
}

function addCol() {
	colN[colN.length] = colN[colN.length-1]+1;
	for (let i = 1; i < rowN.length; i++){
		createCell(i, colN.length -1, table);
	}
	createCell(0, colN.length -1, colVector);

	let len = colN.length -1;
	table.style.gridTemplateColumns = "repeat(" + len + ", auto)";
	colVector.style.gridTemplateColumns = "repeat(" + len + ", auto)";
}

function addRow() {
	rowN[rowN.length] = rowN[rowN.length-1]+1;
	for (let i = 1; i < colN.length; i++){
		createCell(rowN.length - 1, i,table);
	}
	createCell(rowN.length -1, 0, rowVector);

	let len = rowN.length -1;
	table.style.gridTemplateRows = "repeat(" + len + ", auto)";
	rowVector.style.gridTemplateRows = "repeat(" + len + ", auto)";
}

function deleteCol(elem){
	if (colN.length<=2) return;
	let 
		col = +elem.id.slice(-3);
	for (let i = 1; i < rowN.length; i++){
		table.removeChild(document.getElementById(toID(rowN[i], col)));
	}

	colVector.removeChild(document.getElementById(toID(0, col)));
	colN.splice(colN.findIndex(function(element, index){
		if (element == col) return index;
	}), 1);

	let len = colN.length -1;
	table.style.gridTemplateColumns = "repeat(" + len + ", auto)";
	colVector.style.gridTemplateColumns = "repeat(" + len + ", auto)";
}

function deleteRow(elem){
	if (rowN.length<=2) return;
	let 
		row = +elem.id.slice(0,3);
	for (let i = 1; i < colN.length; i++){
		table.removeChild(document.getElementById(toID(row, colN[i])));
	}

	rowVector.removeChild(document.getElementById(toID(row, 0)));
	rowN.splice(rowN.findIndex(function(element, index){
		if (element == row) return index;
	}), 1);

	let len = rowN.length - 1;
	table.style.gridTemplateRows = "repeat(" + len + ", auto)";
	rowVector.style.gridTemplateRows = "repeat(" + len + ", auto)";
}

function hoverCell(elem, key){
	let
		row,
		col;
	
	row = +elem.id.slice(0,3);
	col = +elem.id.slice(-3);
	if (!key) {
		hideAllDel();	
		return;
	}
	if (col != 0 || row != 0 && key){
		hideAllDel();
		showDel(row,col);    	
	}
}

function hideAllDel(){
	let
		delElem = document.getElementsByClassName('del');
	for(let i = 0; i < delElem.length; i++){
		delElem[i].classList.remove("visible");	
	}
}

function showDel(row, col){
	if (col && colN.length>2) document.getElementById(toID(0, col)).classList.add("visible");
	if (row && rowN.length>2) document.getElementById(toID(row, 0)).classList.add("visible");

}

function toID(row, col){
	let
		rowID = '000' + row,
		colID = '000' + col;
	return rowID.slice(-3)+colID.slice(-3);
}
