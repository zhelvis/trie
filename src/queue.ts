type QueueNode<T> = {
  value: T;
  next: QueueNode<T> | null;
};

export class Queue<T> {
  public length = 0;

  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;

  push(value: T) {
    const element: QueueNode<T> = { next: null, value };
    if (this.head) {
      this.head.next = element;
    }

    if (this.tail === null) {
      this.tail = element;
    }

    this.head = element;
    this.length++;
  }

  shift(): T | undefined {
    const element = this.tail;
    if (element === null) {
      return;
    }

    this.tail = element.next;
    if (this.head === element) {
      this.head = null;
    }

    this.length--;
    return element.value;
  }
}
