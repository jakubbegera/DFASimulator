/**
 * Created by Jakub on 14.06.17.
 */
import {
    NODE_START,
    NODE_NORMAL,
    NODE_TERMINATE
} from './Node';
import Node from './Node';
import Edge from './Edge';

var alphabet = ['0', '1'];
var nodeId = 0;
var edgeId = 0;
var nodes = [];
var edges = [];

// init graph
var cy = cytoscape({

    container: $('#cy'), // container to render in

    // elements: [ // list of graph elements to start with
    //     { // node a
    //         data: {id: 'a'}
    //     },
    //     { // node b
    //         data: {id: 'b'}
    //     },
    //     { // edge ab
    //         data: {id: 'ab', source: 'a', target: 'b', label: '0'}
    //     }
    // ],

    style: cytoscape.stylesheet()
        .selector('node').css({
            'content': 'data(label)',
            'text-valign': 'center',
            'color': '#000',
            'background-color': '#eee',
            'border-width': 1,
            'border-color': 'data(color)',
            'font-family': 'Source Code Pro',
            'font-size': 10
        })
        .selector('edge').css({
            'width': 1,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'content': 'data(label)',
            'line-color': '#888',
            'target-arrow-color': '#888',
            'text-outline-width' : 3,
            'text-outline-color' : '#fff',


        }),

    layout: {
        name: 'grid',
        rows: 1
    },

    boxSelectionEnabled: true,
});

addNode(NODE_START);

function addNode(type) {
    let n = new Node(nodeId, type);
    nodes.push(n);
    let color;
    switch (type) {
        case NODE_START:
            color = '#0b0';
            break;
        case NODE_TERMINATE:
            color = '#b00';
            break;
        default:
            color = '#000';
    }

    cy.add({
        group: "nodes",
        data: {id: nodeId, label: "q" + nodeId, color: color},
        classes: 'center-center',
        position: {x: 200, y: 200}
    });
    nodeId++;
}

function addEdge(nodeFromId, nodeToId, transitionChar) {
    let e = new Edge(edgeId, nodeFromId, nodeToId, transitionChar);
    edges.push(e);
    cy.add({
        group: "edges",
        data: {id: 'e' + nodeId, source: nodeFromId, target: nodeToId, label: transitionChar}
    });
    nodeId++;
}


$(window).keypress(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) { // space
        addNode(NODE_NORMAL);
        addEdge(nodes[nodes.length- 2].id, nodes[nodes.length - 1].id, '1');
    }
});