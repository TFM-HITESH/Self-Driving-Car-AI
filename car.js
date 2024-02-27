class Car {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.controls = new Controls('KEYS')
        // Creating a controls object which will contain the controls to move the car as required
    }
    // Using a constructor to assign the values from object creating into the object memory (instance variables)

    // -------------- UPDATING THE CAR POS ---------------

    update() {
        if (this.controls.forward) {
            this.y -= 2
            // When moving forward, we decrement y value to make it closer to the top of the screen
        }
        if (this.controls.reverse) {
            this.y += 2
            // When moving forward, we decrement y value to make it closer to the top of the screen
        }
    }

    // -------------- DRAWING THE CAR ---------------

    draw(ctx) {
        // The draw method takes ctx of type Context to mark context of drawing start position
        ctx.beginPath()
        // Marks the start position of drawing

        ctx.rect(
            this.x - this.width / 2,
            //Centre of car on x axis
            this.y - this.height / 2,
            //Center of car on y axis
            this.width,
            this.height,
        )
        // The .rect() function takes x and y parameters to draw a rectanlgle. We need the centre of the rectangle to be at centre of car.
        // For this, we calulate the start drawing position using the formulae given above

        ctx.fill()
        // Fills the drawn shape with solid colour
    }
}
