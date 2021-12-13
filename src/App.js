import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const pallet = {
    '0': '#90CAF9',
    '30': '#1DE9B6',
    '60': '#FFAB91', 
    '3': '#D1C4E9',
    '33': '#FFF59D',
    '63': '#A5D6A7', 
    '6': '#80CBC4', 
    '36': '#F48FB1', 
    '66': '#81D4FA', 
  };

  const [matrix, setMatrix] = useState([
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
  ]);

  const find_empty = (matrix) => {
    for (let i=0; i<9; i++) {
      for (let j=0; j<9; j++) {
        if (parseInt(matrix[i][j]) === 0) {
          return [i,j];
        }
      }
    }
    return null
  }

  const valid = (matrix, num, row, col) => {
    for (let i=0; i<9; i++) {
      if (parseInt(matrix[row][i]) === num && col !== i) return false
    }
    for (let i=0; i<9; i++) {
      if (parseInt(matrix[i][col]) === num && row !== i) return false
    }

    let box_x = parseInt(col/3)
    let box_y = parseInt(row/3)

    for (let i=box_y*3; i<box_y*3+3; i++) {
      for (let j=box_x*3; j<box_x*3+3; j++) {
        if (parseInt(matrix[i][j]) === num && i !== row && j !== col) return false
      }
    } 

    return true
  }

  const _solve = (matrix) => {
    let find = find_empty(matrix)
    if (find === null) {
      return true;
    } else {
      let row = find[0]
      let col = find[1]
      for (let i=1; i<=9; i++) {
        if (valid(matrix, i, row, col)) {
          handleChange(row, col, i);
          if (_solve(matrix)) return true
          handleChange(row, col, 0);
        }
      }
    }
    return false
  }

  const handleChange = (row, column, value) => {
    let copy = [...matrix];
    copy[row][column] = + value;
    setMatrix(copy);
  };

  const getBoxColor = (row, col) => {
    let rowGroup = row - (row % 3);
    let colGroup = (col - (col % 3)) * 10; 
    return pallet[rowGroup + colGroup];
  };

  const clear = () => {
    setMatrix([
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ])
  }

  const check = (matrix) => {
    for (let i=0; i<9; i++) {
      for (let j=0; j<9; j++) {
        if (parseInt(matrix[i][j]) < 0 || parseInt(matrix[i][j]) > 9) return false;
        if (matrix[i][j] !== 0 && !valid(matrix, matrix[i][j], i, j)) return false;
      }
    }
    return true;
  }

  const solve = () => {
    if (check(matrix)) {
      if (_solve(matrix)) {
        toast.success("Successfully!")
      } else {
        toast.error("Error!")
      }
    } else {
      toast.error("Invalid input!")
    }  
  }

  return (
    <div className="App">
      <div className="container">   
        <ToastContainer/>
        <div className="row justify-content-center" >
          <h1>Sudoku solver</h1>
        </div>
        <div className="row">
        {matrix.map((value, i) => {
          return <div className="col-md-12" >
            {value.map((v, j)=> {
              return <input 
              style={{backgroundColor: getBoxColor(i, j)}}
              value={v}
              onChange={(e) => handleChange(i, j, e.target.value)}/>
            })}
          </div>
        })}
        </div>
        <div className="row justify-content-center">
          <button
            onClick={clear}
          >
            Clear
          </button>
          <button
            className='solve'
            onClick={solve}
          >
            Solve
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
