class Car {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.2
        // Giving these parameters to make Car movement feel more realistic with physics simulated with basic classical laws of motion

        this.maxSpeed = 3
        // Capping the speed
        this.friction = 0.05
        // Coefficient of friction implemented

        this.controls = new Controls('KEYS')
        // Creating a controls object which will contain the controls to move the car as required
    }
    // Using a constructor to assign the values from object creating into the object memory (instance variables)

    // -------------- UPDATING THE CAR POS ---------------

    update() {
        if (this.controls.forward) {
            this.speed += this.acceleration
            // Speed increases
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration
            // Speed decreases
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed
            // When speed exceeds maxSpeed, make it equal to maxSpeed
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2
            // When speed exceeds maxSpeed, make it equal to maxSpeed
            // Reverse maxSpeed is capped to half of forward maxSpeed
        }

        if (this.speed > 0) {
            this.speed -= this.friction
            // Slowdown due to friction
        }
        if (this.speed < 0) {
            this.speed += this.friction
            // Reverse Slowdown due to friction
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0
            // This is to combat tiny movements that happen when speed is between 0 and friction amount
            // When within that tiny Range, to stop bouncing around, set value to 0
        }

        this.y -= this.speed
        // Finally updating speed
        // When moving forward, we decrement y value to make it closer to the top of the screen
        // When moving forward, we decrement y value to make it closer to the top of the screen
        // This is auto handled due to the sign of speed being correct formulae wise
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
