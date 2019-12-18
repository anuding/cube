export class Queue {
    private items;
    constructor() {
        this.items = [];
    }
    isEmpty() {
        return this.items.length == 0;
    }
    enqueue(element) {
        this.items.push(element)
    }
    dequeue() {
        console.log('dequeue!')
        if (this.isEmpty())
            return "it's an empty queue, can't dequeue";
        return this.items.shift();
    }

    getFront(){
        if(this.isEmpty())
            return null
        return this.items[0]
    }

    getTail(){
        return this.items[this.items.length-1]
    }

    print(){
        this.items.forEach(element => {
            console.log(element)
        });
    }
}
