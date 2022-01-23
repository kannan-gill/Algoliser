import React from 'react'
import './Node.css'

function Node({ column, isFinish, isStart, isWall, mousePressed, onMouseDown, onMouseEnter, onMouseUp, row}) {

    const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';

    return (
        <div 
        id={`node-${row}-${column}`}
        className={`node ${extraClassName}`}
        onMouseDown={()=> onMouseDown(row,column)}
        onMouseUp={()=>onMouseUp()}
        onMouseEnter={()=>onMouseEnter(row, column)}
        >
        </div>
    )
}

export default Node
