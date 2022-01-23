import React,{useEffect, useState} from 'react'
import Node from './Node'
import './PathfindingVisualizer.css'
import {dijkstra, getNodesInShortestPathOrder} from './Dijkstra.js'
import { dfs, getDfsPath } from './Dfs'
import { bfs, getBfsPath } from './Bfs'

var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;

function PathfindingVisualizer() {

    const [grid, setGrid] = useState([]);
    const [mousePressed, setMousePressed]=useState(false);

    // var START_NODE_ROW = 10;
    // var START_NODE_COL = 15;  
    // var FINISH_NODE_ROW = 10;
    // var FINISH_NODE_COL = 35;
    const [changeSNode, setSNode] = useState(false);
    const [changeENode, setENode] = useState(false);


    useEffect(()=>{
        const tempgrid=[];
        for(let row=0; row<22;row++){
            const currentRow=[];
            for(let column=0;column<60;column++){
                currentRow.push(createNode(row, column));
            }
            tempgrid.push(currentRow);
        }
        setGrid(tempgrid);
    },[])
    

    function createNode(row, column){
        return {
            column, row, isStart: row===START_NODE_ROW && column===START_NODE_COL, isFinish:row===FINISH_NODE_ROW && column===FINISH_NODE_COL, distance: Infinity, isVisited:false, isWall:false, previousNode:null
        }
    }

    function handleMouseDown(row, column){
        if(changeSNode){
            const newGrid=newGridWithNewStart(grid, row, column);
            setGrid(newGrid);
            setMousePressed(true);
            setSNode(false);
        }
        else if (changeENode){
            const newGrid=newGridWithNewEnd(grid, row, column);
            setGrid(newGrid);
            setMousePressed(true);
            setENode(false);
        }
        else{
            const newGrid=newGridWithWallToggled(grid, row, column);
            setGrid(newGrid);
            setMousePressed(true);
        }
    }

    function handleMouseUp(){
        setMousePressed(false);
    }

    function handleMouseEnter(row, column){
        if(!mousePressed){
            return;
        }
        const newGrid = newGridWithWallToggled(grid, row, column);
        setGrid(newGrid);
    }

    function newGridWithWallToggled(grid, row, column){
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node, isWall: !node.isWall
        };
        newGrid[row][column]=newNode;
        return newGrid;
    }

    function newGridWithNewStart(grid, row, column){
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node, isStart: !node.isStart
        };
        newGrid[row][column]=newNode;

        const prevnode = newGrid[START_NODE_ROW][START_NODE_COL];
        const newPrevnode = {
            ...prevnode, isStart:!prevnode.isStart
        }
        newGrid[START_NODE_ROW][START_NODE_COL]=newPrevnode;

        START_NODE_ROW=row;
        START_NODE_COL=column;
        return newGrid;
    }

    function newGridWithNewEnd(grid, row, column){
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node, isFinish: !node.isFinish
        };
        newGrid[row][column]=newNode;

        const prevnode = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const newPrevnode = {
            ...prevnode, isFinish:!prevnode.isFinish
        }
        newGrid[FINISH_NODE_ROW][FINISH_NODE_COL]=newPrevnode;
        FINISH_NODE_ROW=row;
        FINISH_NODE_COL=column;
        return newGrid;
    }

    function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder){
        for(let i=0; i<=visitedNodesInOrder.length; i++){
            if(i===visitedNodesInOrder.length){
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10*i);
                return;
            }
            setTimeout(()=>{
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.column}`).className='node node-visited';
            }, 10* i);
        }
    }

    function animateShortestPath(nodesInShortestPathOrder){
        for(let i=0;i<nodesInShortestPathOrder.length;i++){
            setTimeout(()=>{
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.column}`).className='node node-shortest-path';
            }, 50*i);
        }
    }

    function visualizeDijkstra () {
         const startNode = grid[START_NODE_ROW][START_NODE_COL];
         const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
         const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
         const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
         animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    function visualizeDfs () {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const nodesToAnimate=[];
        dfs(grid, startNode, nodesToAnimate, finishNode);
        const nodesInDFSOrder = getDfsPath(finishNode);
        animateDijkstra(nodesToAnimate, nodesInDFSOrder);
   }

   function visualizeBfs () {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const nodesToAnimate=[];
        bfs(grid, startNode, nodesToAnimate, finishNode);
        const nodesInBFSOrder = getBfsPath(finishNode);
        animateDijkstra(nodesToAnimate, nodesInBFSOrder);
    }      

    function changeStart () {
        setSNode(true);
        console.log(START_NODE_ROW)
    }

    function changeEnd () {
        setENode(true);
    }

    function removePopup(){
        var popup = document.querySelector('.popup');
        popup.classList.replace('popup','hidden');
        var grid = document.querySelector('.gridopaque');
        grid.classList.replace('gridopaque','grid');
    }

    return (
        <div className='algo'>
            <button className='btn btn-info btn-md' onClick = {visualizeDijkstra}>
                VISUALIZE DIJKSTRA
            </button>
            <button className='btn btn-info btn-md' onClick = {visualizeDfs}>
                VISUALIZE DFS
            </button>
            <button className='btn btn-info btn-md' onClick = {visualizeBfs}>
                VISUALIZE BFS
            </button>
            <button className='btn btn-success btn-md' onClick = {changeStart}>
                Change start node
            </button>
            <button className='btn btn-danger btn-md' onClick = {changeEnd}>
                Change end node
            </button>

            <div className='popup'>
                <h3>Hi and welcome to Algoliser. Visualise the famous graph algorithms here and forge your concepts.</h3>
                <br/>
                <h4>Instructions to use</h4>
                <ul>
                    <li>Please click on Change start node button and click on the node you want as the starting node for graph traversal.</li>
                    <li>Similarly Click on Change End node button and click on the node you want as the ending node for graph traversal.</li>
                    <li>If none of these buttons is selected and you click on a node, it will be treated as an obstacle during graph traversal.</li>
                    <li>Once you finalise the start and end nodes, kindly select the traversal algorithm you want to visualise.</li>
                    <li>Have fun with learning.</li>
                </ul>
                <br/>
                <h5> This is a practice project made by Kannan Gill, Punjab Engineering College, India. It was inspired by Pathfinding visualiser made by Clement Mihailescu.</h5>
                <button className='btn btn-md btn-primary' onClick={removePopup}>Got it!!</button>
            </div>

            <div className='gridopaque'>
            {
                grid.map((row, rowID)=>{
                    return(
                        <div className="rowdiv" key={rowID}>
                            {
                                row.map((node, nodeID)=>{
                                    const {row,column,isFinish,isStart,isWall}=node
                                    return (
                                        <div key={nodeID}>
                                            <Node 
                                            
                                            column={column}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mousePressed={mousePressed}
                                            onMouseDown={(row, column) => handleMouseDown(row, column)}
                                            onMouseEnter={(row, column) =>
                                                handleMouseEnter(row, column)
                                            }
                                            onMouseUp={() => handleMouseUp()}
                                            row={row}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default PathfindingVisualizer
