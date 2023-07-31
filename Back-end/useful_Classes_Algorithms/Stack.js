class Stack {
  constructor() {
    this.stack = new Array(); // Initialize an empty array to hold the stack elements
  }

  // Method to add an element 'e' to the top of the stack
  push(e) {
    this.stack.push(e);
  }

  // Method to remove and return the top element from the stack
  // If the stack is empty, it returns "Stack is empty!"
  pop() {
    if (this.stack.length == 0) return "Stack is empty!";
    return this.stack.pop();
  }

  // Method to check if the stack is empty
  // Returns true if the stack is empty, otherwise false
  isEmpty() {
    return this.stack.length == 0;
  }

  // Method to get the number of elements in the stack
  // Returns the length of the stack
  length() {
    return this.stack.length;
  }
}

module.exports = Stack; // Export the Stack class for use in other modules

