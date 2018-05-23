class Table {
  constructor(id, rowSize, colSize) {
    this.rowN = [];
    this.colN = [];
    this.nextCol = colSize + 1;
    this.nextRow = rowSize + 1;
    this.currentCol = null;
    this.currentRow = null;
    this.isDragging = false;

    this.elemDOM = document.getElementById(id);
    this.elemDOM.onmouseover = this.hoverCell.bind(this);
    this.elemDOM.onmouseout = this.hideDel.bind(this);
    this.elemDOM.onclick = this.click.bind(this);
    this.elemDOM.onmousedown = this.cutCell.bind(this);
    document.addEventListener("mousemove", this.followCursor.bind(this));
    document.addEventListener("mouseup", this.pasteCell.bind(this));

    this.tableDOM = this.elemDOM.querySelectorAll(".table-test")[0];
    this.rowDelDOM = this.elemDOM.querySelectorAll(".vector-row > .del")[0];
    this.colDelDOM = this.elemDOM.querySelectorAll(".vector-col > .del")[0];
    this.dragDOM = null;

    for (let i = 1; i <= rowSize; i++) {
      this.rowN.push(i);
    }
    for (let i = 1; i <= colSize; i++) {
      this.colN.push(i);
    }

    for (let i = 1; i <= rowSize; i++) {
      for (let j = 1; j <= colSize; j++) {
        this.createCell(i, j);
      }
    }
    this.upgradeTable();
  }

  createCell(row, col) {
    let div = document.createElement("DIV");
    div.className = "cell";
    div.dataset.row = row;
    div.dataset.col = col;

    if (col === this.nextCol && row != this.rowN[this.rowN.length - 1]) {
      this.tableDOM.insertBefore(div, this.getCell(row, col, true));
    } else {
      this.tableDOM.insertBefore(div, null);
    }
  }

  getCell(row, col, next) {
    let nextColID = this.colN[0],
      nextRowID = this.rowN[this.rowN.indexOf(row) + 1];
    if (!next) {
      nextColID = col;
      nextRowID = row;
    }

    for (let i = this.tableDOM.childNodes.length - 1; i >= 0; i--) {
      if (
        +this.tableDOM.childNodes[i].dataset.row === nextRowID &&
        +this.tableDOM.childNodes[i].dataset.col === nextColID
      ) {
        return this.tableDOM.childNodes[i];
      }
    }

    return null;
  }

  addCol() {
    this.colN.push(this.nextCol);
    for (let i = 0; i < this.rowN.length; i++) {
      this.createCell(this.rowN[i], this.nextCol);
    }
    this.nextCol++;
    this.upgradeTable();
  }

  addRow() {
    this.rowN.push(this.nextRow);
    for (let i = 0; i < this.colN.length; i++) {
      this.createCell(this.nextRow, this.colN[i]);
    }
    this.nextRow++;
    this.upgradeTable();
  }

  upgradeTable() {
    this.tableDOM.style.gridTemplateColumns =
      "repeat(" + this.colN.length + ", auto";
    this.tableDOM.style.gridTemplateRows =
      "repeat(" + this.rowN.length + ", auto";

    for (let i = this.tableDOM.childNodes.length - 1; i >= 0; i--) {
      this.tableDOM.childNodes[i].dataset.row = this.rowN[
        Math.floor(i / this.colN.length)
      ];
      this.tableDOM.childNodes[i].dataset.col = this.colN[i % this.colN.length];
    }
  }

  hoverCell(event) {
    let cell = event.target,
      left,
      top;
    while (cell !== this.elemDOM) {
      if (cell.parentNode === this.tableDOM) {
        [left, top] = this.checkCoords(cell);

        this.rowDelDOM.style.top = top + "px";
        this.colDelDOM.style.left = left + "px";
        this.currentRow = +cell.dataset.row;
        this.currentCol = +cell.dataset.col;
      }

      if (
        (cell.parentNode === this.tableDOM ||
          cell == this.rowDelDOM ||
          cell == this.colDelDOM) &&
        this.isDragging === false
      ) {
        if (this.rowN.length > 1) this.rowDelDOM.classList.add("visible");
        if (this.colN.length > 1) this.colDelDOM.classList.add("visible");
      }

      cell = cell.parentNode;
    }
  }

  checkCoords(cell) {
    let left, top;
    left = cell.offsetLeft - this.tableDOM.offsetLeft;
    if (left > this.tableDOM.offsetWidth - cell.offsetWidth) {
      left = this.tableDOM.offsetWidth - cell.offsetWidth;
    } else if (left < 0) left = 0;

    top = cell.offsetTop - this.tableDOM.offsetTop;
    if (top > this.tableDOM.offsetHeight - cell.offsetHeight) {
      top = this.tableDOM.offsetHeight - cell.offsetHeight;
    } else if (top < 0) top = 0;
    return [left, top];
  }

  hideDel() {
    this.rowDelDOM.classList.remove("visible");
    this.colDelDOM.classList.remove("visible");
  }

  click(event) {
    /*
      if we clicked on an inner element like <i>, <span> etc. 
      the event.target will be equal to this inner element but 
      we still need to delete/add col/row because this element
      is inside the button. So i go "upstairs" of DOM-elements
      until i can decide was that click on a button or no.
    */
    let cell = event.target;
    while (cell !== this.elemDOM) {
      if (cell === this.rowDelDOM) this.deleteRow();
      if (cell === this.colDelDOM) this.deleteCol();
      if (cell === this.elemDOM.querySelectorAll(".row-add")[0]) this.addRow();
      if (cell === this.elemDOM.querySelectorAll(".col-add")[0]) this.addCol();
      cell = cell.parentNode;
    }
  }

  deleteCol() {
    let col = this.currentCol;
    if (this.colN.length <= 1 || col == 0) return;
    for (let i = 0; i < this.rowN.length; i++) {
      this.tableDOM.removeChild(this.getCell(this.rowN[i], col, false));
    }

    this.colN.splice(this.colN.indexOf(col), 1);
    this.upgradeTable();
    this.hideDel();
    this.currentCol = 0;
    this.currentRow = 0;
  }

  deleteRow() {
    let row = this.currentRow;
    if (this.rowN.length <= 1 || row == 0) return;
    for (let i = 0; i < this.colN.length; i++) {
      this.tableDOM.removeChild(this.getCell(row, this.colN[i], false));
    }

    this.rowN.splice(this.rowN.indexOf(row), 1);
    this.upgradeTable();
    this.hideDel();
    this.currentCol = 0;
    this.currentRow = 0;
  }

  cutCell(event) {
    let cell = event.target;
    if (cell.parentNode === this.tableDOM && this.isDragging === false) {
      this.isDragging = true;
      this.dragDOM = cell;
      this.dragDOM.classList.add("dragging");
    }
    this.hideDel();
    this.followCursor(event);
  }

  pasteCell(event) {
    // get element under cursor
    this.dragDOM.style.visibility = "hidden";
    let cell = document.elementFromPoint(event.clientX, event.clientY);
    this.dragDOM.style.visibility = "";

    if (this.isDragging === true) {
      if (cell === this.tableDOM) {
        this.stopFollowing(true);
      } else if (cell.parentNode === this.tableDOM) {
        this.stopFollowing(true, cell);
      } else this.stopFollowing(false);
    }
    this.upgradeTable();
  }

  followCursor(event) {
    if (this.isDragging === true) {
      this.dragDOM.style.top =
        event.pageY - this.dragDOM.offsetHeight / 2 + "px";
      this.dragDOM.style.left =
        event.pageX - this.dragDOM.offsetWidth / 2 + "px";
    }
  }

  stopFollowing(move, elem) {
    if (move) {
      this.dragDOM.remove();
      this.tableDOM.insertBefore(this.dragDOM, elem);
    }
    this.isDragging = false;
    this.dragDOM.classList.remove("dragging");
    this.dragDOM.style.top = "";
    this.dragDOM.style.left = "";
  }
}

var table1 = new Table("tab1", 4, 4);
