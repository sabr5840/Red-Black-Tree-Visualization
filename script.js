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
            } else if (value > current.value) {
                current = current.right;
            } else {
                alert('Duplicate value!');
                return;
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
        if (node === null) {
            alert('Node not found!');
            return;
        }

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
        return this.findNode(value);
    }
}

const tree = new RedBlackTree();

function insertNode() {
    const value = document.getElementById('nodeValue').value;
    if (!value || isNaN(value)) {
        alert('Please enter a valid number.');
        return;
    }
    tree.insert(Number(value));
    renderTree();
}

function deleteNode() {
    const value = document.getElementById('nodeValue').value;
    if (!value || isNaN(value)) {
        alert('Please enter a valid number.');
        return;
    }
    tree.delete(Number(value));
    renderTree();
}

function searchNode() {
    const value = document.getElementById('nodeValue').value;
    if (!value || isNaN(value)) {
        alert('Please enter a valid number.');
        return;
    }
    const node = tree.search(Number(value));
    if (node) {
        blinkNode(node);
    } else {
        alert('Node not found.');
    }
}

function blinkNode(node) {
    const element = document.getElementById(`node-${node.value}`);
    if (element) {
        element.style.animation = 'blink 1s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    }
}

function renderTree() {
    const container = document.getElementById('treeContainer');
    container.innerHTML = '';
    if (tree.root) {
        renderNode(tree.root, container, null, true);
    }
}

function renderNode(node, container, parentNode, isLeft) {
    const element = document.createElement('div');
    element.className = 'node';
    element.id = `node-${node.value}`;
    element.innerText = node.value;
    element.style.backgroundColor = node.color === 'red' ? 'red' : 'black';
    element.style.color = node.color === 'red' ? 'black' : 'white';
    container.appendChild(element);

    if (parentNode) {
        const line = document.createElement('div');
        line
        line.className = 'line';
        line.style.position = 'absolute';
        line.style.width = '2px';
        line.style.backgroundColor = 'black';

        const parentRect = parentNode.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (isLeft) {
            line.style.left = `${(parentRect.left + parentRect.width / 2) - containerRect.left}px`;
            line.style.top = `${(parentRect.bottom - containerRect.top)}px`;
            line.style.height = `${(elementRect.top - parentRect.bottom)}px`;
            line.style.transform = 'translateX(-50%)';
        } else {
            line.style.left = `${(parentRect.left + parentRect.width / 2) - containerRect.left}px`;
            line.style.top = `${(parentRect.bottom - containerRect.top)}px`;
            line.style.height = `${(elementRect.top - parentRect.bottom)}px`;
            line.style.transform = 'translateX(50%)';
        }

        container.appendChild(line);
    }

    const leftContainer = document.createElement('div');
    leftContainer.className = 'left-container';
    const rightContainer = document.createElement('div');
    rightContainer.className = 'right-container';
    container.appendChild(leftContainer);
    container.appendChild(rightContainer);

    if (node.left) {
        renderNode(node.left, leftContainer, element, true);
    }
    if (node.right) {
        renderNode(node.right, rightContainer, element, false);
    }
}

document.getElementById('insertBtn').addEventListener('click', insertNode);
document.getElementById('deleteBtn').addEventListener('click', deleteNode);
document.getElementById('searchBtn').addEventListener('click', searchNode);

renderTree();
