/**
 * Represents edge of DFA
 * Created by Jakub on 15.06.17.
 */
export default class Edge {

    constructor(id, nodeFrom, nodeTo, transitionChar) {
        this.id = id;
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
        this.transitionChar = transitionChar;
    }
}