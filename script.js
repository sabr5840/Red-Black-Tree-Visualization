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
                if ((w.left === null || w.left.color === 'black') &&
                    (w.right === null || w.right.color === 'black')) {
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
                if ((w.right === null || w.right.color === 'black') &&
                    (w.left === null || w.left.color === 'black')) {
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
        line.className = 'line';
        
        const parentRect = parentNode.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const parentCenterX = parentRect.left + parentRect.width / 2 - containerRect.left;
        const parentBottomY = parentRect.bottom - containerRect.top;
        const elementCenterX = elementRect.left + elementRect.width / 2 - containerRect.left;
        const elementTopY = elementRect.top - containerRect.top;

        line.style.left = `${parentCenterX}px`;
        line.style.top = `${parentBottomY}px`;
        line.style.height = `${elementTopY - parentBottomY}px`;
        line.style.transform = `translateX(${isLeft ? -50 : 50}%)`;
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
    } else {
        renderNullNode(leftContainer, element, true);
    }
    if (node.right) {
        renderNode(node.right, rightContainer, element, false);
    } else {
        renderNullNode(rightContainer, element, false);
    }
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
    renderTree(node);
    if (node !== null) {
        blinkNode(node);
    } else {
        alert('Node not found.');
    }
}

function blinkNode(node) {
    const circles = d3.select('#tree').selectAll('circle')
        .filter(d => d.node === node);

    // Add the blink class to trigger animation
    circles.classed('blink', true);

    // Remove the blink class after 5 seconds
    setTimeout(() => {
        circles.classed('blink', false);
        // Set fill color back to node's original color if needed
        circles.attr('fill', d => d.node.color);
    }, 5000); // 5 seconds
}

function renderNullNode(container, parentNode, isLeft) {
    const nullNode = document.createElement('div');
    nullNode.className = 'node null-node';
    nullNode.innerText = 'NIL';
    nullNode.style.backgroundColor = 'black';
    nullNode.style.color = 'white';
    nullNode.style.width = '30px';
    nullNode.style.height = '30px';
    container.appendChild(nullNode);

    if (parentNode) {
        const line = document.createElement('div');
        line.className = 'line';
        
        const parentRect = parentNode.getBoundingClientRect();
        const nullNodeRect = nullNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const parentCenterX = parentRect.left + parentRect.width / 2 - containerRect.left;
        const parentBottomY = parentRect.bottom - containerRect.top;
        const nullNodeCenterX = nullNodeRect.left + nullNodeRect.width / 2 - containerRect.left;
        const nullNodeTopY = nullNodeRect.top - containerRect.top;

        line.style.left = `${parentCenterX}px`;
        line.style.top = `${parentBottomY}px`;
        line.style.height = `${nullNodeTopY - parentBottomY}px`;
        line.style.transform = `translateX(${isLeft ? -50 : 50}%)`;
        container.appendChild(line);
    }
}

function renderTree(foundNode = null) {
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = '';

    const width = treeContainer.clientWidth;
    const height = treeContainer.clientHeight;

    const nodes = [];
    const links = [];

    function traverse(node, x, y, level, xOffset) {
        if (node !== null) {
            nodes.push({ node, x, y });
            if (node.left !== null) {
                links.push({ source: { x, y }, target: { x: x - xOffset, y: y + 50 } });
                traverse(node.left, x - xOffset, y + 50, level + 1, xOffset / 1.5);
            } else {
                // Handle null left node
                nodes.push({ node: { value: 'NIL', color: 'black' }, x: x - xOffset, y: y + 50 });
                links.push({ source: { x, y }, target: { x: x - xOffset, y: y + 50 } });
            }
            if (node.right !== null) {
                links.push({ source: { x, y }, target: { x: x + xOffset, y: y + 50 } });
                traverse(node.right, x + xOffset, y + 50, level + 1, xOffset / 1.5);
            } else {
                // Handle null right node
                nodes.push({ node: { value: 'NIL', color: 'black' }, x: x + xOffset, y: y + 50 });
                links.push({ source: { x, y }, target: { x: x + xOffset, y: y + 50 } });
            }
        }
    }

    traverse(tree.root, width / 2, 30, 1, width / 4);

    const minX = Math.min(...nodes.map(d => d.x));
    const maxX = Math.max(...nodes.map(d => d.x));
    const minY = Math.min(...nodes.map(d => d.y));
    const maxY = Math.max(...nodes.map(d => d.y));

    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    const svgContainer = d3.select('#tree').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `${minX - 50} ${minY - 50} ${treeWidth + 100} ${treeHeight + 100}`);

    const linkSelection = svgContainer.selectAll('line')
        .data(links);

    linkSelection.enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.source.x)
        .attr('y2', d => d.source.y)
        .attr('stroke', 'black')
        .transition()
        .duration(500)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    linkSelection.exit()
        .transition()
        .duration(500)
        .attr('x2', d => d.source.x)
        .attr('y2', d => d.source.y)
        .remove();

    const nodeSelection = svgContainer.selectAll('circle')
        .data(nodes.filter(d => d.node.value !== 'NIL'));

    nodeSelection.enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 15)
        .attr('fill', d => d.node.color)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .transition()
        .duration(500)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    nodeSelection.exit()
        .transition()
        .duration(500)
        .attr('r', 0)
        .remove();

    svgContainer.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.node.value);

    svgContainer.selectAll('.null-node')
        .data(nodes.filter(d => d.node.value === 'NIL'))
        .enter()
        .append('rect')
        .attr('x', d => d.x - 15)
        .attr('y', d => d.y - 15)
        .attr('width', 30)
        .attr('height', 30)
        .attr('fill', 'black')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    svgContainer.selectAll('.null-node-text')
        .data(nodes.filter(d => d.node.value === 'NIL'))
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text('NIL');

    if (foundNode) {
        blinkNode(foundNode);
    }
}

document.getElementById('nodeValue').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        insertNode();
    }
});
