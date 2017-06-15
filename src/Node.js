/**
 * Represents node of DFA
 * Created by Jakub on 15.06.17.
 */

export const NODE_START = "S";
export const NODE_NORMAL = "N";
export const NODE_TERMINATE = "T";

export default class Node {

    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}