// import { useState } from 'react';
// import '../index.css';
// import Board from './Board';
// import { useChess } from '../ChessContext';
// const ChessBoard = () => {
  
//   const {socket,setSocket,grid,setGrid,userSide,turn,setTurn,lock,setLock,totalMoves,setTotalMoves} = useChess();
//   const [win,setWin] = useState(3);
//   const [move, setMove] = useState([]);
//   const [pawnpromo,setPawnPromo] = useState(false);
//   const [isWpp,setWpp] = useState(false);
//   const [isBpp,setBpp] = useState(false);
//   const [pToP,setPToP] = useState(null);
//   const bpp = ['bq','bb','bn','br'];
//   const wpp = ['wq','wb','wn','wr'];

//   const piece = (cell) => {
//     const pieces = {
//       'br': '/br.png',
//       'bn': '/bn.png',
//       'bb': '/bb.png',
//       'bq': '/bq.png',
//       'bk': '/bk.png',
//       'bp': '/bp.png',
//       'wr': '/wr.png',
//       'wn': '/wn.png',
//       'wb': '/wb.png',
//       'wq': '/wq.png',
//       'wk': '/wk.png',
//       'wp': '/wp.png'
//     };
//     return pieces[cell] || '';
//   };

//   const isSameSidePiece = (start, end) => {
//     const isWhite = cell => cell && cell.startsWith('w');
//     const isBlack = cell => cell && cell.startsWith('b');
//     return (isWhite(start.cell) && isWhite(end.cell)) || (isBlack(start.cell) && isBlack(end.cell));
//   };

//   const pawnPromotion = (start,end)=>{
//     setPawnPromo(true);
//     if(start.cell==='bp'){
//       setBpp(true);
//     }else if(start.cell==='wp'){
//       setWpp(true);
//     }
//     setPToP({start,end});
//   }

//   const movePiece = (start,end)=>{
//     const newGrid = grid.map((row, rIdx) => 
//       row.map((c, cIdx) => {
//         if (rIdx === start.rowIndex && cIdx === start.cellIndex) return '';
//         if (rIdx === end.rowIndex && cIdx === end.cellIndex) return start.cell;
//         return c;
//       })
//     );
    
//     if((start.cell==='bp' && end.rowIndex===7) ||(start.cell==='wp'&& end.rowIndex===0)){
//       pawnPromotion(start,end);
//     }

//     let winner = null;
//     if (end.cell === 'wk' || end.cell === 'bk') {
//       winner = userSide;
//       alert('You win.');
//       setWin(userSide);
//       console.log(winner);
//       setLock(true);
//     }

//     setGrid(newGrid);
//     setTotalMoves(prevTotalMoves => {
//       const updatedMoves = [...prevTotalMoves, {start, end}];
//       console.log('Updated Moves:', updatedMoves);
//       return updatedMoves;
//     });
    
  
//     setTurn(turn === 1 ? 0 : 1);  // switch turns
//     socket.emit('grid', { grid: newGrid, turn: turn === 1 ? 0 : 1, win: winner, move: {start,end} });
//     console.log(totalMoves);
//     setMove([]);
  
//   }

//   const isValidMove = (cell, cellIndex, rowIndex) => {
//     if(lock){
//       return;
//     }
//     console.log('Clicked');

//     if(userSide===turn){
      

//       if(!(move.length==0 && cell==='')){
//         const newMove = [...move, { cell, cellIndex, rowIndex }];
//         setMove(newMove);

//         if (newMove.length === 1 && ((userSide === 1 && !cell.startsWith('w')) || (userSide === 0 && !cell.startsWith('b')))) {
//           setMove([]);
//           return;
//         }
    
//         setMove(newMove);    
      
//         if (move.length === 1 && (isSameSidePiece(move[0], newMove[1]))) {
//           setMove([newMove[1]]);
//         } else {
//           setMove(newMove);
//         }
//         console.log(newMove);
//         console.log(move);
        
//         if (newMove.length >= 2) {
//           const [start, end] = newMove;

//             if((start.cell === 'bp' && (!isSameSidePiece(start,end)) && ((end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex + 1)||(start.rowIndex===1 && end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex + 2) || 
//             ((Math.abs(start.cellIndex-end.cellIndex)===1) && start.rowIndex+1===end.rowIndex && !isSameSidePiece(start,end) && end.cell!==''))) ||
//             (start.cell === 'wp' && (!isSameSidePiece(start,end)) && ((end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex - 1)||(start.rowIndex===6 && end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex - 2)||
//             ((Math.abs(start.cellIndex-end.cellIndex)===1) && start.rowIndex-1===end.rowIndex && !isSameSidePiece(start,end) && end.cell!=='')))){
//               movePiece(start, end);
//             }
//             else if((start.cell === 'bb' || start.cell === 'wb') && (!isSameSidePiece(start,end)) &&  ((start.cellIndex + start.rowIndex === end.cellIndex + end.rowIndex)||(7-start.cellIndex + start.rowIndex === 7-end.cellIndex + end.rowIndex))){
//               movePiece(start, end);
//             }
//             else if((start.cell ==='bn' || start.cell==='wn') && (!isSameSidePiece(start,end)) && 
//             ((Math.abs(start.cellIndex - end.cellIndex)===2 && Math.abs(start.rowIndex - end.rowIndex)=== 1)) || 
//             ((Math.abs(start.cellIndex -end.cellIndex)===1) && (Math.abs(start.rowIndex - end.rowIndex)===2))){
//               movePiece(start, end);
//             }
//             else if((start.cell ==='br' || start.cell==='wr') && (!isSameSidePiece(start,end)) && ((start.cellIndex===end.cellIndex)||(start.rowIndex===end.rowIndex))){
//               movePiece(start,end);
//             }
//             else if((start.cell ==='bq' || start.cell==='wq') && (!isSameSidePiece(start,end)) && ((start.cellIndex + start.rowIndex === end.cellIndex + end.rowIndex)||(7-start.cellIndex + start.rowIndex === 7-end.cellIndex + end.rowIndex)||(start.cellIndex===end.cellIndex)||(start.rowIndex===end.rowIndex))){
//               movePiece(start,end);
//             }
//             else if((start.cell ==='bk' || start.cell==='wk') && (!isSameSidePiece(start,end)) && 
//             ((start.cellIndex===end.cellIndex && (Math.abs(start.rowIndex-end.rowIndex)===1))||
//             (start.rowIndex===end.rowIndex && (Math.abs(start.cellIndex-end.cellIndex)===1 ))||
//             (Math.abs(start.rowIndex-end.rowIndex)===1 && Math.abs(start.cellIndex-end.cellIndex)===1))){
//               movePiece(start,end);
//             }
//             else{
//               setMove([]);
//             }
//         }
//       }
//     }
//   };

//   const handlePawnPromotion = (cell)=>{
//     const newGrid = grid.map((row, rIdx) => 
//       row.map((c, cIdx) => {
//         if (rIdx === pToP
//     .end.rowIndex && cIdx === pToP
//     .end.cellIndex) return cell;
//         return c;
//       })
//     );
//     let {start,end} = pToP;
//     end.cell = cell;
//     setGrid(newGrid);
//     setTotalMoves(prevTotalMoves => {
//       const updatedMoves = [...prevTotalMoves, {start, end}];
//       console.log('Updated Moves:', updatedMoves);
//       return updatedMoves;
//     });
//     let winner = null;
//     socket.emit('grid', { grid: newGrid, turn, win: winner, move: {start,end}});
//     console.log(totalMoves);
//     setMove([]);
//     if(isWpp){
//       setWpp(false);
//     }else if(isBpp){
//       setBpp(false);
//     }
//     setPawnPromo(false);
//     setPToP(null);
//   }

//   const boxColor = (rowIndex, cellIndex) => {
//     return (rowIndex + cellIndex) % 2 === 0 ?  'bg-beige':'bg-green';
//   };

//   return (
//     <div className='flex justify-center items-center py-10'>
//       <Board grid={grid} boxColor={boxColor} piece={piece} isValidMove={isValidMove} />
//       {pawnpromo && isWpp && (
//         <div className='absolute w-1/4 bg-[hsl(40deg_2.56%_22.94%)] opacity-90 flex gap-2 rounded-xl'>
//           {wpp.map((cell,index)=>(
//             <div onClick={()=>handlePawnPromotion(cell)}><img src={piece(cell)} className='cursor-pointer' alt="" /></div>
//           ))}
//         </div>
//       )}
//       {pawnpromo && isBpp && (
//         <div className='absolute w-1/4 bg-[hsl(40deg_2.56%_22.94%)] opacity-90 flex gap-2 rounded-xl'>
//           {bpp.map((cell,index)=>(
//             <div onClick={()=>handlePawnPromotion(cell)}><img src={piece(cell)} className='cursor-pointer' alt="" /></div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChessBoard;


import { useState } from 'react';
import '../index.css';
import Board from './Board';
import { useChess } from '../ChessContext';

const ChessBoard = () => {
  const {socket,user,room,setSocket,grid,setGrid,userSide,turn,setTurn,lock,setLock,totalMoves,setTotalMoves} = useChess();
  const [win, setWin] = useState(3);
  const [move, setMove] = useState([]);
  const [pawnPromo, setPawnPromo] = useState(false);
  const [isWpp, setWpp] = useState(false);
  const [isBpp, setBpp] = useState(false);
  const [pToP, setPToP] = useState(null);
  const bpp = ['bq', 'bb', 'bn', 'br'];
  const wpp = ['wq', 'wb', 'wn', 'wr'];

  const piece = (cell) => {
    const pieces = {
      'br': '/br.png',
      'bn': '/bn.png',
      'bb': '/bb.png',
      'bq': '/bq.png',
      'bk': '/bk.png',
      'bp': '/bp.png',
      'wr': '/wr.png',
      'wn': '/wn.png',
      'wb': '/wb.png',
      'wq': '/wq.png',
      'wk': '/wk.png',
      'wp': '/wp.png'
    };
    return pieces[cell] || '';
  };

  const isSameSidePiece = (start, end) => {
    const isWhite = cell => cell && cell.startsWith('w');
    const isBlack = cell => cell && cell.startsWith('b');
    return (isWhite(start.cell) && isWhite(end.cell)) || (isBlack(start.cell) && isBlack(end.cell));
  };

  const movePiece = (start, end) => {
    const newGrid = grid.map((row, rIdx) => 
      row.map((c, cIdx) => {
        if (rIdx === start.rowIndex && cIdx === start.cellIndex) return '';
        if (rIdx === end.rowIndex && cIdx === end.cellIndex) return start.cell;
        return c;
      })
    );
    
    if((start.cell === 'bp' && end.rowIndex === 7) || (start.cell === 'wp' && end.rowIndex === 0)){
      pawnPromotion(start, end);
    }

    let winner = null;
    if (end.cell === 'wk' || end.cell === 'bk') {
      winner = userSide;
      setWin(userSide);
      setLock(true);
      socket.emit('gameFinish',{user,room});
    }

    setGrid(newGrid);
    setTotalMoves(prevTotalMoves => [...prevTotalMoves, { start, end }]);
    setTurn(turn === 1 ? 0 : 1);
    socket.emit('grid', { grid: newGrid, turn: turn === 1 ? 0 : 1, win: winner, move: { start, end } });
    setMove([]);
  };

  const pawnPromotion = (start, end) => {
    setPawnPromo(true);
    setPToP({ start, end });
    if(start.cell === 'bp'){
      setBpp(true);
    } else if(start.cell === 'wp'){
      setWpp(true);
    }
  };

  const handlePawnPromotion = (cell) => {
    const newGrid = grid.map((row, rIdx) => 
      row.map((c, cIdx) => {
        if (rIdx === pToP.end.rowIndex && cIdx === pToP.end.cellIndex) return cell;
        return c;
      })
    );
    let { start, end } = pToP;
    end.cell = cell;
    setGrid(newGrid);
    setTotalMoves(prevTotalMoves => [...prevTotalMoves, { start, end }]);
    socket.emit('grid', { grid: newGrid, turn, win: null, move: { start, end } });
    setMove([]);
    setPawnPromo(false);
    setWpp(false);
    setBpp(false);
    setPToP(null);
  };

  const isValidMove = (cell, cellIndex, rowIndex) => {
    if (lock) return;

    if (userSide === turn) {
      if (!(move.length === 0 && cell === '')) {
        const newMove = [...move, { cell, cellIndex, rowIndex }];
        setMove(newMove);

        if (newMove.length === 1 && ((userSide === 1 && !cell.startsWith('w')) || (userSide === 0 && !cell.startsWith('b')))) {
          setMove([]);
          return;
        }

        if (move.length === 1 && isSameSidePiece(move[0], newMove[1])) {
          setMove([newMove[1]]);
        } else {
          setMove(newMove);
        }

        if (newMove.length >= 2) {
          const [start, end] = newMove;

          const isPawnMove = validatePawnMove(start, end);
          const isKnightMove = validateKnightMove(start, end);
          const isBishopMove = validateBishopMove(start, end);
          const isRookMove = validateRookMove(start, end);
          const isQueenMove = validateQueenMove(start, end);
          const isKingMove = validateKingMove(start, end);

          if (isPawnMove || isKnightMove || isBishopMove || isRookMove || isQueenMove || isKingMove) {
            movePiece(start, end);
          } else {
            setMove([]);
          }
        }
      }
    }
  };

  const validatePawnMove = (start, end) => {
    if (start.cell === 'bp') {
      if ((end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex + 1 && end.cell === '') ||
          (start.rowIndex === 1 && end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex + 2 && end.cell === '') ||
          (Math.abs(start.cellIndex - end.cellIndex) === 1 && start.rowIndex + 1 === end.rowIndex && end.cell.startsWith('w'))) {
        return true;
      }
    } else if (start.cell === 'wp') {
      if ((end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex - 1 && end.cell === '') ||
          (start.rowIndex === 6 && end.cellIndex === start.cellIndex && end.rowIndex === start.rowIndex - 2 && end.cell === '') ||
          (Math.abs(start.cellIndex - end.cellIndex) === 1 && start.rowIndex - 1 === end.rowIndex && end.cell.startsWith('b'))) {
        return true;
      }
    }
    return false;
  };

  const validateKnightMove = (start, end) => {
    if ((Math.abs(start.cellIndex - end.cellIndex) === 2 && Math.abs(start.rowIndex - end.rowIndex) === 1) ||
        (Math.abs(start.cellIndex - end.cellIndex) === 1 && Math.abs(start.rowIndex - end.rowIndex) === 2)) {
      return !isSameSidePiece(start, end);
    }
    return false;
  };

  const validateBishopMove = (start, end) => {
    if (Math.abs(start.cellIndex - end.cellIndex) === Math.abs(start.rowIndex - end.rowIndex)) {
      return !isSameSidePiece(start, end) && isPathClear(start, end);
    }
    return false;
  };

  const validateRookMove = (start, end) => {
    if (start.cellIndex === end.cellIndex || start.rowIndex === end.rowIndex) {
      return !isSameSidePiece(start, end) && isPathClear(start, end);
    }
    return false;
  };

  const validateQueenMove = (start, end) => {
    if (validateBishopMove(start, end) || validateRookMove(start, end)) {
      return true;
    }
    return false;
  };

  const validateKingMove = (start, end) => {
    if (Math.abs(start.cellIndex - end.cellIndex) <= 1 && Math.abs(start.rowIndex - end.rowIndex) <= 1) {
      return !isSameSidePiece(start, end);
    }
    return false;
  };

  const isPathClear = (start, end) => {
    const [sRow, sCol] = [start.rowIndex, start.cellIndex];
    const [eRow, eCol] = [end.rowIndex, end.cellIndex];

    if (sRow === eRow) {
      const step = eCol > sCol ? 1 : -1;
      for (let col = sCol + step; col !== eCol; col += step) {
        if (grid[sRow][col] !== '') return false;
      }
    } else if (sCol === eCol) {
      const step = eRow > sRow ? 1 : -1;
      for (let row = sRow + step; row !== eRow; row += step) {
        if (grid[row][sCol] !== '') return false;
      }
    } else {
      const rowStep = eRow > sRow ? 1 : -1;
      const colStep = eCol > sCol ? 1 : -1;
      for (let row = sRow + rowStep, col = sCol + colStep; row !== eRow && col !== eCol; row += rowStep, col += colStep) {
        if (grid[row][col] !== '') return false;
      }
    }

    return true;
  };

  const boxColor = (rowIndex, cellIndex) => {
    return (rowIndex + cellIndex) % 2 === 0 ? 'bg-beige' : 'bg-green';
  };

  return (
    <div className='flex justify-center py-5'>
      <Board grid={grid} boxColor={boxColor} piece={piece} isValidMove={isValidMove} />
      {pawnPromo && win===3 && isWpp && (
        <div className='absolute w-1/4 bg-[hsl(40deg_2.56%_22.94%)] opacity-90 flex gap-2 rounded-xl'>
          {wpp.map((cell, index) => (
            <div key={index} onClick={() => handlePawnPromotion(cell)}><img src={piece(cell)} className='cursor-pointer' alt="" /></div>
          ))}
        </div>
      )}
      {pawnPromo && win===3 && isBpp && (
        <div className='absolute w-1/4 bg-[hsl(40deg_2.56%_22.94%)] opacity-90 flex gap-2 rounded-xl'>
          {bpp.map((cell, index) => (
            <div key={index} onClick={() => handlePawnPromotion(cell)}><img src={piece(cell)} className='cursor-pointer' alt="" /></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
