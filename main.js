class Table {
  constructor(id, rowSize, colSize) {
    this.rowN = [];
    this.colN = [];
    this.nextCol = colSize + 1;
    this.nextRow = rowSize + 1;
    this.currentCol = null;
    this.currentRow = null;

    this.elemDOM = document.getElementById(id);
    this.elemDOM.onmouseover = this.hoverCell.bind(this);
    this.elemDOM.onmouseout = this.hideDel.bind(this);
    this.elemDOM.onclick = this.click.bind(this);

    this.tableDOM = this.elemDOM.querySelectorAll(".table-test")[0];
    this.rowDelDOM = this.elemDOM.querySelectorAll(".vector-row > .del")[0];
    this.colDelDOM = this.elemDOM.querySelectorAll(".vector-col > .del")[0];

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

    this.upgradeSize();
  }

  createCell(row, col) {
    let td = document.createElement("TD");
    td.className = "cell";
    td.setAttribute("row", row);
    td.setAttribute("col", col);

    if (col === this.nextCol && row != this.rowN[this.rowN.length - 1]) {
      this.tableDOM.insertBefore(td, this.getCell(row, col, true));
    } else {
      this.tableDOM.insertBefore(td, null);
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
        +this.tableDOM.childNodes[i].getAttribute("row") === nextRowID &&
        +this.tableDOM.childNodes[i].getAttribute("col") === nextColID
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
    this.upgradeSize();
  }

  addRow() {
    this.rowN.push(this.nextRow);
    for (let i = 0; i < this.colN.length; i++) {
      this.createCell(this.nextRow, this.colN[i]);
    }
    this.nextRow++;
    this.upgradeSize();
  }

  upgradeSize() {
    this.tableDOM.style.gridTemplateColumns =
      "repeat(" + this.colN.length + ", auto";
    this.tableDOM.style.gridTemplateRows =
      "repeat(" + this.rowN.length + ", auto";
  }

  hoverCell(event) {
    let cell = event.target;
    if (cell.tagName == "TD") {
      this.colDelDOM.style.left =
        cell.offsetLeft - this.tableDOM.offsetLeft + "px";
      this.rowDelDOM.style.top =
        cell.offsetTop - this.tableDOM.offsetTop + "px";
      this.currentRow = +cell.getAttribute("row");
      this.currentCol = +cell.getAttribute("col");
    }

    if (
      cell.tagName == "TD" ||
      cell == this.rowDelDOM ||
      cell == this.colDelDOM
    ) {
      if (this.rowN.length > 1) this.rowDelDOM.classList.add("visible");
      if (this.colN.length > 1) this.colDelDOM.classList.add("visible");
    }
  }

  hideDel() {
    this.rowDelDOM.classList.remove("visible");
    this.colDelDOM.classList.remove("visible");
  }

  click(event) {
    let cell = event.target;
    while (cell != this.elemDOM) {
      if (cell == this.rowDelDOM) this.deleteRow();
      if (cell == this.colDelDOM) this.deleteCol();
      if (cell == this.elemDOM.querySelectorAll(".row-add")[0]) this.addRow();
      if (cell == this.elemDOM.querySelectorAll(".col-add")[0]) this.addCol();
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
    this.upgradeSize();
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
    this.upgradeSize();
    this.hideDel();
    this.currentCol = 0;
    this.currentRow = 0;
  }
}

var table1 = new Table("tab1", 4, 4);
