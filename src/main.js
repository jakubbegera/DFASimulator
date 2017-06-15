/**
 * Created by Jakub on 14.06.17.
 */
import Node, {NODE_NORMAL, NODE_START, NODE_TERMINATE} from "./Node";
import Edge from "./Edge";

let alphabet = ['0', '1'];
let nodeId = 0;
let edgeId = 0;
let nodes = [];
let edges = [];

let newEdgeNode1 = -1;
let newEdgeNode2 = -1;

//**********************************************************************************************************************
// init graph
//**********************************************************************************************************************
var cy = cytoscape({

    container: $('#cy'), // container to render in

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
            'text-outline-width': 3,
            'text-outline-color': '#fff',


        }),

    layout: {
        name: 'grid',
        rows: 1
    },

    boxSelectionEnabled: true,
});

displayAlphabet();
addNode(NODE_START);
initNodeAdd();

//**********************************************************************************************************************
// node add handling
//**********************************************************************************************************************
document.querySelector("#btnAddNodeRegular").addEventListener('click', (e) => addNode(NODE_NORMAL));
document.querySelector("#btnAddNodeTerminate").addEventListener('click', (e) => addNode(NODE_TERMINATE));
document.querySelector("#btnClear").addEventListener('click', (e) => {
    cy.elements().remove();
    nodeId = 0;
    edgeId = 0;
    nodes = [];
    edges = [];
    addNode(NODE_START);
});

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
        position: {x: 200 + 10 * nodeId, y: 200 + 10 * nodeId}
    });
    nodeId++;
}

//**********************************************************************************************************************
// edge add handling
//**********************************************************************************************************************
document.querySelector("#btnDiscardAddingEdge").addEventListener('click', (e) => initNodeAdd());

function addEdge(nodeFromId, nodeToId, transitionChar) {
    let e = new Edge(edgeId, nodeFromId, nodeToId, transitionChar);
    edges.push(e);
    cy.add({
        group: "edges",
        data: {id: 'e' + nodeId, source: nodeFromId, target: nodeToId, label: transitionChar}
    });
    nodeId++;
}

cy.on('tap', 'node', function (evt) {
    let id = evt.target.id();
    console.log("Clicked node: " + id);
    if (newEdgeNode1 === -1) {
        if (findAllPossibleNewEdgesFromNode(id).length === 0) {
            $('#lblAddEdge').text("No free transition characters for node " + id + ".");
            return;
        }
        newEdgeNode1 = id;
        $('#lblAddEdge').text(id + " => click on destination node");
        document.getElementById('btnDiscardAddingEdge').style.display = "inline";
    } else if (newEdgeNode2 === -1) {
        newEdgeNode2 = id;
        document.getElementById('btnConfirmNewEdge').style.display = "inline";
        document.getElementById('charSelect').style.display = "inline";
        $('#lblAddEdge').text(newEdgeNode1 + " => " + newEdgeNode2 + " Transition character:");
        let possibleChars = findAllPossibleNewEdgesFromNode(newEdgeNode1);
        console.log("Possible chars from node " + newEdgeNode1 + ": " + possibleChars);
        let select = $('#charSelect');//document.getElementById('#charSelect');
        select.find('option').remove();
        for (let i = 0; i < possibleChars.length; i++) {
            let opt = document.createElement('option');
            opt.value = possibleChars[i];
            opt.innerHTML = possibleChars[i];
            select.append(opt);
        }
    }
});

function initNodeAdd() {
    document.getElementById('btnDiscardAddingEdge').style.display = "none";
    document.getElementById('btnConfirmNewEdge').style.display = "none";
    document.getElementById('charSelect').style.display = "none";
    $('#lblAddEdge').text("Click on starting edge");
    newEdgeNode1 = -1;
    newEdgeNode2 = -1;
}

document.querySelector("#btnConfirmNewEdge").addEventListener('click', (e) => {
    let selected = $('#charSelect').find(":selected").text();
    console.log(selected);
    addEdge(newEdgeNode1, newEdgeNode2, selected);
    initNodeAdd();
});

function findAllPossibleNewEdgesFromNode(nodeId) {
    let out = alphabet.slice();
    edges.forEach(function (edge) {
        if (edge.nodeFrom === nodeId) {
            // remove it from alphabet
            for (let i = out.length - 1; i >= 0; i--) {
                if (out[i] === edge.transitionChar) {
                    out.splice(i, 1);
                }
            }
        }
    });
    return out;
}

//**********************************************************************************************************************
// others
//**********************************************************************************************************************
function displayAlphabet() {
    let alp = "";
    for (let i = 0; i < alphabet.length; i++) {
        if (i !== 0) {
            alp = alp + ", ";
        }
        alp = alp + alphabet[i];
        console.log(alp);
    }
    $('#automataAlphabet').text(alp);
}

$(window).keypress(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) { // space
        addNode(NODE_NORMAL);
        addEdge(nodes[nodes.length - 2].id, nodes[nodes.length - 1].id, '1');
    }
});