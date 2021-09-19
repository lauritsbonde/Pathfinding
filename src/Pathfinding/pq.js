let queue = [];

function reset() {
    queue = [];
}

function printOut() {
    for (let i = 0; i < queue.length; i++) {
        console.log(queue[i]);
    }
}

function insert(id, distance) {
    queue.push({ id, distance });
    floatUp(queue.length - 1);
}

function getQueue() {
    return queue;
}

function floatUp(index) {
    while (index > 0) {
        const parrent = Math.floor((index - 1) / 2);
        if (queue[parrent].distance > queue[index].distance) {
            exchange(parrent, index);
            index = parrent;
        } else {
            break;
        }
    }
}

function exchange(i, j) {
    const copy = queue[i];
    queue[i] = queue[j];
    queue[j] = copy;
}

function dequeue() {
    exchange(0, queue.length - 1);
    const next = queue.splice(queue.length - 1)[0];
    sink(0);
    return next;
}

function sink(index) {
    while (index < queue.length) {
        const leftChild = index * 2 + 1;
        const rightChild = index * 2 + 2;
        if (queue[leftChild] === undefined && queue[rightChild] === undefined) {
            break;
        } else if (queue[leftChild] !== undefined && queue[rightChild] === undefined) {
            if (queue[leftChild].distance < queue[index].distance) {
                exchange(leftChild, index);
                index = leftChild;
            } else {
                break;
            }
        } else if (queue[leftChild] !== undefined && queue[rightChild] !== undefined) {
            const smallest = queue[leftChild].distance - queue[rightChild].distance <= 0 ? leftChild : rightChild;
            if (queue[smallest].distance < queue[index].distance) {
                exchange(smallest, index);
                index = smallest;
            } else {
                break;
            }
        } else {
            break;
        }
    }
}

function isEmpty() {
    return queue.length === 0;
}

module.exports = {
    insert,
    dequeue,
    isEmpty,
    reset,
    printOut,
    getQueue,
    sink,
};
