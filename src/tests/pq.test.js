const pq = require('../Pathfinding/pq');

beforeEach(() => {
    pq.reset();
    addBasic();
});

function addBasic() {
    pq.insert(1, 3);
    pq.insert(2, 4);
    pq.insert(3, 5);
}

test('1 is inserted with distance 1', () => {
    pq.reset();
    pq.insert(1, 1);
    expect(pq.getQueue()[0]).toEqual({ id: 1, distance: 1 });
});
//
test('Distance 1 gets to index 1', () => {
    pq.insert(4, 1);
    expect(pq.getQueue()[0]).toEqual({ id: 4, distance: 1 });
});

test('Sink doesnt sink lowest distance thing', () => {
    pq.sink(0);
    expect(pq.getQueue()[0]).toEqual({ id: 1, distance: 3 });
});

test('Sink sinks distance 10 to index 3', () => {
    pq.reset();
    pq.insert(4, 10);
    addBasic();
    pq.sink(0);
    expect(pq.getQueue()[3]).toEqual({ id: 4, distance: 10 });
});

test('Dequeue returns id: 1, distance 3', () => {
    const response = pq.dequeue();
    expect(response).toEqual({ id: 1, distance: 3 });
});
