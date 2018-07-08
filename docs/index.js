
class Cell extends React.Component {
  render() {
    const cellStyle = {
      width: this.props.cellSize + "px",
      height: this.props.cellSize + "px"
    };
    return (
      <div
        className="cell"
        data-row={this.props.row}
        data-col={this.props.col}
        style={cellStyle}
      />
    );
  }
}

class DelRow extends React.Component {
  render() {
    const delClass = this.props.visible
      ? "cell edit del visible"
      : "cell edit del";
    const delStyle = {
      top: this.props.top + "px",
      width: this.props.cellSize + "px",
      height: this.props.cellSize + "px"
    };
    return (
      <button className={delClass} style={delStyle}>
        <i className="fas fa-minus" />
      </button>
    );
  }
}

class DelCol extends React.Component {
  render() {
    const delClass = this.props.visible
      ? "cell edit del visible"
      : "cell edit del";
    const delStyle = {
      left: this.props.left + "px",
      width: this.props.cellSize + "px",
      height: this.props.cellSize + "px"
    };
    return (
      <button className={delClass} style={delStyle}>
        <i className="fas fa-minus" />
      </button>
    );
  }
}

class Table extends React.Component {
  renderCell(row, col) {
    return (
      <Cell
        row={row}
        col={col}
        cellSize={this.props.cellSize}
        key={"" + row + col}
      />
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      cols: +this.props.initialWidth,
      rows: +this.props.initialHeight,
      delTop: null,
      delLeft: null,
      isVisibleDelRow: false,
      isVisibleDelCol: false
    };
    this.rowN = [];
    this.colN = [];
    this.nextCol = +this.props.initialWidth + 1;
    this.nextRow = +this.props.initialHeight + 1;
    this.currentCol = null;
    this.currentRow = null;

    for (let i = 1; i <= this.props.initialWidth; i++) {
      this.rowN.push(i);
    }
    for (let i = 1; i <= this.props.initialHeight; i++) {
      this.colN.push(i);
    }

    this.refElem = React.createRef();
    this.elemDOM = null;
  }

  createTable() {
    let cells = [];
    for (let i = 0; i < this.rowN.length; i++)
      for (let j = 0; j < this.colN.length; j++)
        cells.push(this.renderCell(this.rowN[i], this.colN[j]));
    return cells;
  }

  render() {
    const cellStyle = {
      width: this.props.cellSize + "px",
      height: this.props.cellSize + "px"
    };
    return (
      <div className="container" ref={this.refElem}>
        <div className="vector vector-col">
          <DelCol
            visible={this.state.isVisibleDelCol}
            left={this.state.delLeft}
            cellSize={this.props.cellSize}
          />
        </div>
        <div className="vector vector-row">
          <DelRow
            visible={this.state.isVisibleDelRow}
            top={this.state.delTop}
            cellSize={this.props.cellSize}
          />
        </div>
        <div className="table-test">{this.createTable()}</div>
        <button className="cell edit add col-add" style={cellStyle}>
          <i className="fas fa-plus" />
        </button>
        <button className="cell edit add row-add" style={cellStyle}>
          <i className="fas fa-plus" />
        </button>
      </div>
    );
  }

  componentDidMount() {
    this.elemDOM = this.refElem.current;
    this.elemDOM.addEventListener("mouseover", this.hoverCell.bind(this));
    this.elemDOM.addEventListener("mouseout", this.hideDel.bind(this));
    this.elemDOM.addEventListener("click", this.click.bind(this));

    this.tableDOM = this.elemDOM.querySelectorAll(
      ".container > .table-test"
    )[0];
    this.rowDelDOM = this.elemDOM.querySelectorAll(
      ".container > .vector-row > .del"
    )[0];
    this.colDelDOM = this.elemDOM.querySelectorAll(
      ".container > .vector-col > .del"
    )[0];
  }

  addCol() {
    this.colN.push(this.nextCol);
    this.nextCol++;
    this.setState({ cols: this.colN.length });
    this.upgradeTable();
  }

  addRow() {
    this.rowN.push(this.nextRow);
    this.nextRow++;
    this.setState({ rows: this.rowN.length });
    this.upgradeTable();
  }

  upgradeTable() {
    this.tableDOM.style.gridTemplateColumns =
      "repeat(" + this.colN.length + ", auto";
    this.tableDOM.style.gridTemplateRows =
      "repeat(" + this.rowN.length + ", auto";
  }

  hoverCell(event) {
    let cell = event.target,
      left,
      top;
    while (cell !== this.elemDOM) {
      if (cell.parentNode === this.tableDOM) {
        [left, top] = this.checkCoords(cell);
        this.setState({ delTop: top });
        this.setState({ delLeft: left });
        this.currentRow = +cell.dataset.row;
        this.currentCol = +cell.dataset.col;
      }

      if (
        cell.parentNode === this.tableDOM ||
        cell === this.rowDelDOM ||
        cell === this.colDelDOM
      ) {
        if (this.rowN.length > 1) this.setState({ isVisibleDelRow: true });
        if (this.colN.length > 1) this.setState({ isVisibleDelCol: true });
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
    this.setState({ isVisibleDelRow: false });
    this.setState({ isVisibleDelCol: false });
  }

  click(event) {
    let cell = event.target;
    while (cell !== this.elemDOM) {
      if (cell === this.rowDelDOM) this.deleteRow();
      if (cell === this.colDelDOM) this.deleteCol();
      if (cell === this.elemDOM.querySelectorAll(".container > .row-add")[0])
        this.addRow();
      if (cell === this.elemDOM.querySelectorAll(".container > .col-add")[0])
        this.addCol();
      cell = cell.parentNode;
    }
  }

  deleteCol() {
    let col = this.currentCol;
    if (this.colN.length <= 1 || col === null) return;
    this.colN.splice(this.colN.indexOf(col), 1);
    this.setState({ cols: this.colN.length });
    this.upgradeTable();
    this.hideDel();
    this.currentCol = null;
    this.currentRow = null;
  }

  deleteRow() {
    let row = this.currentRow;
    if (this.rowN.length <= 1 || row === null) return;
    this.setState({ rows: this.rowN.length });

    this.rowN.splice(this.rowN.indexOf(row), 1);
    this.upgradeTable();
    this.hideDel();
    this.currentCol = null;
    this.currentRow = null;
  }
}

Table.defaultProps = {
  initialWidth: "4",
  initialHeight: "4",
  cellSize: "50"
};

ReactDOM.render(<Table />, document.getElementById("tab1"));
