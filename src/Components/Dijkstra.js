export function dijkstra (grid, startNode, finishNode) {
    const visitedNodesInOrder=[];
    startNode.distance=0;
    const unvisitedNodes = getAllNodes(grid);
    
    while(!!unvisitedNodes.length){
        sortByDistance(unvisitedNodes);     
        const closestNode = unvisitedNodes.shift();
        if(closestNode.isWall) continue; 
        if(closestNode.distance===Infinity) return visitedNodesInOrder;
        closestNode.isVisited=true;
        visitedNodesInOrder.push(closestNode);
        if(closestNode===finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbours(closestNode,grid);
    }
    
}

function sortByDistance (unvisitedNodes) { 
    unvisitedNodes.sort((nodeA, nodeB)=> nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbours (node, grid) { 
    const unvisitedNeighbour = getUnvisitedNeighbours(node,grid);
    for(const neighbour of unvisitedNeighbour){
        neighbour.distance = node.distance+1;
        neighbour.previousNode = node;
    }
}

function getUnvisitedNeighbours(node, grid){
    const neighbours = [];
    const {row, column} = node;
    if(row>0) neighbours.push(grid[row-1][column]);
    if(row<grid.length-1) neighbours.push(grid[row+1][column]);
    if(column>0)neighbours.push(grid[row][column-1]);
    if(column<grid[0].length-1) neighbours.push(grid[row][column+1]);
    return neighbours.filter(neighbour => !neighbour.isVisited) 
}

function getAllNodes (grid) {
    const nodes = [];
    for(const row of grid){
        for(const node of row){
            nodes.push(node);
        }
    }
    return nodes;
 }

 export function getNodesInShortestPathOrder(finishNode){
     const nodesInShortestPathOrder = [];
     let currentNode = finishNode;
     while(currentNode!==null){
         nodesInShortestPathOrder.unshift(currentNode);
         currentNode = currentNode.previousNode;
     }
     return nodesInShortestPathOrder;
 }