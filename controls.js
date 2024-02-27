class Controls {
    constructor(type) {
        this.forward = false
        // Am I going Forward ?
        this.left = false
        // Am I going Left ?
        this.right = false
        // Am I going Right ?
        this.reverse = false
        // Am I going Reverse ?

        // Initially, we are not moving so everything is false

        switch (type) {
            case 'KEYS':
                this.#addKeyboardListeners()
                // This method listens and checks for all keyboard presses
                break
            case 'DUMMY':
                this.forward = true
                break
        }
    }
    // Using a contstructor to assign required values to Controls class

    // # -> Private Method

    // Arrow function. When document.keydown occurs, it calls the function written underneath with the parameter event being passed into it. This allows for variable updation as needed
    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.left = true
                    break
                case 'ArrowRight':
                    this.right = true
                    break
                case 'ArrowUp':
                    this.forward = true
                    break
                case 'ArrowDown':
                    this.reverse = true
                    break
            }
            // event object counts everything like mouse click, typing etc.
            // event.key returns which key has been pressed
            // Depending on the label of the key pressed, set the parameters to true

            // console.table(this)
            // Use this to see the values change
        }

        document.onkeyup = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.left = false
                    break
                case 'ArrowRight':
                    this.right = false
                    break
                case 'ArrowUp':
                    this.forward = false
                    break
                case 'ArrowDown':
                    this.reverse = false
                    break
            }
            // This part is to keep track of key being released
            // Reverts state of the parameters to false when needed

            // console.table(this)
            // Use this to see the values change
        }
    }
    //Special custom function written to keep track of key presses
}
