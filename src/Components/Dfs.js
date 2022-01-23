export function dfs(grid, startNode, nodesToAnimate, finishNode){
    const visitedNodesInOrder = [];
    visitedNodesInOrder.push(startNode);
    while(!!visitedNodesInOrder.length){
        const currentNode = visitedNodesInOrder.pop();
        if(currentNode.isWall) continue;
        nodesToAnimate.push(currentNode);
        if(currentNode === finishNode) return;
        currentNode.isVisited=true;
        const neighbours = getAllValidNeighbours(grid, currentNode);
     //   if(neighbours.length===0) return;
        updateNeighbours(neighbours, currentNode);
        for(const neighbour of neighbours){
            visitedNodesInOrder.push(neighbour);
        }
    }
    
}

function getAllValidNeighbours(grid, currentNode){
    const neighbours = [];
    const {row, column} = currentNode;
    if(column>0)neighbours.push(grid[row][column-1]);
    if(row<grid.length-1) neighbours.push(grid[row+1][column]);
    if(column<grid[0].length-1) neighbours.push(grid[row][column+1]);
    if(row>0) neighbours.push(grid[row-1][column]);
    return neighbours.filter(neighbour => !neighbour.isVisited) 
}

function updateNeighbours(neighbours, currentNode){
    for(const neighbour of neighbours){
        neighbour.previousNode = currentNode;
    }
}

export function getDfsPath(finishNode){
    const nodesInDfs = [];
    let currentNode = finishNode;
    while(currentNode){
        nodesInDfs.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInDfs;
}