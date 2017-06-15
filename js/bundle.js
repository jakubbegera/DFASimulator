/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents edge of DFA
 * Created by Jakub on 15.06.17.
 */
class Edge {

    constructor(id, nodeFrom, nodeTo, transitionChar) {
        this.id = id;
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
        this.transitionChar = transitionChar;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Edge;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents node of DFA
 * Created by Jakub on 15.06.17.
 */

const NODE_START = "S";
/* harmony export (immutable) */ __webpack_exports__["a"] = NODE_START;

const NODE_NORMAL = "N";
/* harmony export (immutable) */ __webpack_exports__["b"] = NODE_NORMAL;

const NODE_TERMINATE = "T";
/* harmony export (immutable) */ __webpack_exports__["c"] = NODE_TERMINATE;


class Node {

    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = Node;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Node__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Edge__ = __webpack_require__(0);
/**
 * Created by Jakub on 14.06.17.
 */



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
addNode(__WEBPACK_IMPORTED_MODULE_0__Node__["a" /* NODE_START */]);
initNodeAdd();

//**********************************************************************************************************************
// node add handling
//**********************************************************************************************************************
document.querySelector("#btnAddNodeRegular").addEventListener('click', (e) => addNode(__WEBPACK_IMPORTED_MODULE_0__Node__["b" /* NODE_NORMAL */]));
document.querySelector("#btnAddNodeTerminate").addEventListener('click', (e) => addNode(__WEBPACK_IMPORTED_MODULE_0__Node__["c" /* NODE_TERMINATE */]));
document.querySelector("#btnClear").addEventListener('click', (e) => {
    cy.elements().remove();
    nodeId = 0;
    edgeId = 0;
    nodes = [];
    edges = [];
    addNode(__WEBPACK_IMPORTED_MODULE_0__Node__["a" /* NODE_START */]);
});

function addNode(type) {
    let n = new __WEBPACK_IMPORTED_MODULE_0__Node__["d" /* default */](nodeId, type);
    nodes.push(n);
    let color;
    switch (type) {
        case __WEBPACK_IMPORTED_MODULE_0__Node__["a" /* NODE_START */]:
            color = '#0b0';
            break;
        case __WEBPACK_IMPORTED_MODULE_0__Node__["c" /* NODE_TERMINATE */]:
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
    let e = new __WEBPACK_IMPORTED_MODULE_1__Edge__["a" /* default */](edgeId, nodeFromId, nodeToId, transitionChar);
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
document.querySelector("#btnStart").addEventListener('click', (e) => {
    let word;
    if ((word = checkInputWord()) === null) {
        $('#errorText').css("display", "inline");
        $('#simulatorState').css("display", "none");
        return;
    }
    $('#errorText').css("display", "none");
    $('#simulatorState').css("display", "block");
});

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
        addNode(__WEBPACK_IMPORTED_MODULE_0__Node__["b" /* NODE_NORMAL */]);
        addEdge(nodes[nodes.length - 2].id, nodes[nodes.length - 1].id, '1');
    }
});

/***/ })
/******/ ]);