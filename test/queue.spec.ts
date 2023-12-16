import { Queue } from "../src/queue";

describe("Queue", () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  it("should have a length of 0 when initialized", () => {
    expect(queue.length).toBe(0);
  });

  it("should push values to the queue", () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);

    expect(queue.length).toBe(3);
  });

  it("should shift values from the queue in the correct order", () => {
    queue.push(1);
    queue.push(2);
    queue.push(3);

    expect(queue.shift()).toBe(1);
    expect(queue.shift()).toBe(2);
    expect(queue.shift()).toBe(3);
    expect(queue.length).toBe(0);
  });

  it("should return undefined when shifting from an empty queue", () => {
    expect(queue.shift()).toBeUndefined();
  });
});
