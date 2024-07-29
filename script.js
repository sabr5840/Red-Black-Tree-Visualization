class Node {
    constructor(value, color = 'red') {
        this.value = value;
        this.color = color; // 'red' or 'black'
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    constructor() {
        this.root = null;
    }

    rotateLeft(node) {
        let rightChild = node.right;
        node.right = rightChild.left;
        if (rightChild.left !== null) {
            rightChild.left.parent = node;
        }
        rightChild.parent = node.parent;
        if (node.parent === null) {
            this.root = rightChild;
        } else if (node === node.parent.left) {
            node.parent.left = rightChild;
        } else {
            node.parent.right = rightChild;
        }
        rightChild.left = node;
        node.parent = rightChild;
    }

    rotateRight(node) {
        let leftChild = node.left;
        node.left = leftChild.right;
        if (leftChild.right !== null) {
            leftChild.right.parent = node;
        }
        leftChild.parent = node.parent;
        if (node.parent === null) {
            this.root = leftChild;
        } else if (node === node.parent.right) {
            node.parent.right = leftChild;
        } else {
            node.parent.left = leftChild;
        }
        leftChild.right = node;
        node.parent = leftChild;
    }

    fixInsertion(node) {
        while (node !== this.root && node.parent.color === 'red') {
            if (node.parent === node.parent.parent.left) {
                let uncle = node.parent.parent.right;
                if (uncle !== null && uncle.color === 'red') {
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateRight(node.parent.parent);
                }
            } else {
                let uncle = node.parent.parent.left;
                if (uncle !== null && uncle.color === 'red') {
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateLeft(node.parent.parent);
                }
            }
        }
        this.root.color = 'black';
    }

    insert(value) {
        let newNode = new Node(value);
        if (this.root === null) {
            this.root = newNode;
            this.root.color = 'black';
            return;
        }
        
        let current = this.root;
        let parent = null;

        while (current !== null) {
            parent = current;
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        newNode.parent = parent;
        if (value < parent.value) {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        this.fixInsertion(newNode);
    }

    delete(value) {
        const node = this.findNode(value);
        if (node === null) return; // Node to delete not found

        let y = node;
        let yOriginalColor = y.color;
        let x;

        if (node.left === null) {
            x = node.right;
            this.transplant(node, node.right);
        } else if (node.right === null) {
            x = node.left;
            this.transplant(node, node.left);
        } else {
            y = this.minimum(node.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent === node) {
                if (x !== null) x.parent = y;
            } else {
                this.transplant(y, y.right);
                y.right = node.right;
                if (y.right !== null) y.right.parent = y;
            }
            this.transplant(node, y);
            y.left = node.left;
            if (y.left !== null) y.left.parent = y;
            y.color = node.color;
        }

        if (yOriginalColor === 'black') {
            this.fixDeletion(x);
        }
    }

    findNode(value) {
        let current = this.root;
        while (current !== null && current.value !== value) {
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return current;
    }

    transplant(u, v) {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v !== null) {
            v.parent = u.parent;
        }
    }

    minimum(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    fixDeletion(x) {
        while (x !== this.root && (x === null || x.color === 'black')) {
            if (x === x.parent.left) {
                let w = x.parent.right;
                if (w.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.rotateLeft(x.parent);
                    w = x.parent.right;
                }
                if ((w.left === null || w.left.color === 'black') && (w.right === null || w.right.color === 'black')) {
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w.right === null || w.right.color === 'black') {
                        if (w.left !== null) w.left.color = 'black';
                        w.color = 'red';
                        this.rotateRight(w);
                        w = x.parent.right;
                    }
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    if (w.right !== null) w.right.color = 'black';
                    this.rotateLeft(x.parent);
                    x = this.root;
                }
            } else {
                let w = x.parent.left;
                if (w.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.rotateRight(x.parent);
                    w = x.parent.left;
                }
                if ((w.right === null || w.right.color === 'black') && (w.left === null || w.left.color === 'black')) {
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w.left === null || w.left.color === 'black') {
                        if (w.right !== null) w.right.color = 'black';
                        w.color = 'red';
                        this.rotateLeft(w);
                        w = x.parent.left;
                    }
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    if (w.left !== null) w.left.color = 'black';
                    this.rotateRight(x.parent);
                    x = this.root;
                }
            }
        }
        if (x !== null) x.color = 'black';
    }

    search(value) {
        const node = this.findNode(value);
        if (node) {
            renderTree(node);
        } else {
            alert("Node not found");
        }
    }
}

const tree = new RedBlackTree();

function insertNode() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        tree.insert(Number(value));
        renderTree();
    }
}

function deleteNode() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        tree.delete(Number(value));
        renderTree();
    }
}

function searchNode() {
    const value = document.getElementById('nodeValue').value;
    if (value) {
        tree.search(Number(value));
    }
}

function renderTree() {
    const svg = d3.select('#tree').select('svg');
    if (!svg.empty()) {
        svg.remove();
    }

    const width = document.getElementById('tree').clientWidth;
    const height = document.getElementById('tree').clientHeight;

    const svgContainer = d3.select('#tree').append('svg')
        .attr('width', width)
        .attr('height', height);

    const nodes = [];
    const links = [];

    function traverse(node, x, y, level) {
        if (node !== null) {
            nodes.push({ node, x, y });
            if (node.left !== null) {
                links.push({ source: { x, y }, target: { x: x - 50 / level, y: y + 50 } });
                traverse(node.left, x - 50 / level, y + 50, level + 1);
            }
            if (node.right !== null) {
                links.push({ source: { x, y }, target: { x: x + 50 / level, y: y + 50 } });
                traverse(node.right, x + 50 / level, y + 50, level + 1);
            }
        }
    }

    traverse(tree.root, width / 2, 30, 1);

    svgContainer.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', 'black');

    svgContainer.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 15)
        .attr('fill', d => d.node.color);

    svgContainer.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.node.value);
}

document.getElementById('nodeValue').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        insertNode();
    }
});
