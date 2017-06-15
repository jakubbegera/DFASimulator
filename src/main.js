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

let isSimulationRunning = false;
let simulationCurrentNode;
let simulationStep = -1;
let simulationWord;

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
// simulation
//**********************************************************************************************************************
document.querySelector("#btnSimulationStart").addEventListener('click', (e) => {
    stopSimulation();
    let txvError = $('#errorText');
    if ((simulationWord = checkInputWord()) === null) {
        txvError.css("display", "inline");
        txvError.html("Entered word isn't valid. Is is empty or it isn't a subset of &Sigma;")
        $('#simulatorState').css("display", "none");
        return;
    }
    isSimulationRunning = true;
    txvError.css("display", "none");
    $('#simulatorState').css("display", "block");

    $('#btnSimulationStart').css("display", "none");
    $('#btnSimulationStop').css("display", "inline");

    simulationCurrentNode = findNodeById(0);
    simulationStep = 0;
    updateSimulationProgress();
});
document.querySelector("#btnSimulationStop").addEventListener('click', (e) => stopSimulation());


function checkInputWord() {
    let text = $('#inputWord').val();
    console.log(text);
    if (text.length === 0) return null;

    for (let i = 0; i < text.length; i++) {
        if (alphabet.indexOf(text[i]) === -1) {
            return null;
        }
    }
    return text;
}

function doSimulationStep() {
    if (!isSimulationRunning) return;
    let symbol = simulationWord[simulationStep];
    let outEdges = findAllOutEdgesFromNode(simulationCurrentNode.id);
    console.log("Found edges: " + outEdges + "(from node" + simulationCurrentNode.id + ")");
    let selectedEdge = null;
    for (let i = 0; i < outEdges.length; i++) {
        if (outEdges[i].transitionChar === symbol) {
            selectedEdge = outEdges[i];
            break;
        }
    }

    if (selectedEdge === null) {
        console.log("Error - no out edge found");
        let txvError = $('#errorText');
        txvError.text("DFA simulation fail. No out edge found - did you forgot some transition?");
        txvError.css("display", "inline");
        stopSimulation();
        return;
    }

    simulationStep++;
    simulationCurrentNode = findNodeById(selectedEdge.nodeTo);
    updateSimulationProgress();

    if (simulationStep === simulationWord.length) { // last symbol?
        if (simulationCurrentNode.type === NODE_TERMINATE) {
            console.log("success");
            $('#successText').css("display", "inline");
        } else {
            console.log("fail");
        }
        stopSimulation();
    }
}

function updateSimulationProgress() {
    let readChars = '';
    let currentChar = '';
    let remainingChars = '';
    for (let i = 0; i < simulationWord.length; i++) {
        if (i < simulationStep) {
            readChars = readChars + simulationWord[i];
        } else if (i == simulationStep) {
            currentChar = simulationWord[i];
        } else {
            remainingChars = remainingChars + simulationWord[i];
        }
    }
    $('#wordProgress').html(
        "<span class='textDone'>" + readChars + "</span>" +
        "<span class='textCurrent'>" + currentChar + "</span>" +
        "<span class='textRemaining'>" + remainingChars + "</span>"
    )
    $('#currentState').html(
        "q<sub>" + simulationCurrentNode.id + "</sub>"
    );
}

function stopSimulation() {
    $('#btnSimulationStart').css("display", "inline");
    $('#btnSimulationStop').css("display", "none");
    $('#successText').css("display", "none");

    isSimulationRunning = false;
    simulationCurrentNode = null;
    simulationStep = -1;
    simulationWord = null;
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
    $('#automatonAlphabet').text(alp);
}

$(window).keypress(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) { // space
        // addNode(NODE_NORMAL);
        // addEdge(nodes[nodes.length - 2].id, nodes[nodes.length - 1].id, '1');
        doSimulationStep();
    }
});

function findNodeById(id) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id == id) return nodes[i];
    }
    return null;
}

function findAllOutEdgesFromNode(id) {
    let out = [];
    console.log(edges);
    for (let i = 0; i < edges.length; i++) {
        console.log("id = " + id + ", edges[i].nodeFrom = " + edges[i].nodeFrom);
        if (edges[i].nodeFrom == id) {
            console.log("pushing");
            out.push(edges[i]);
        }
    }
    console.log(out);
    return out;
}