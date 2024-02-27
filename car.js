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

        this.angle = 0
        // To keep track of the angle the car is facing
        // Coordinate system is unti circle rotated 90deg counter-clockwise

        this.sensor = new Sensor(this)
        // Creating a new sensor Object, to cast rays and calculate intersections. We pass car as the parameter

        this.controls = new Controls('KEYS')
        // Creating a controls object which will contain the controls to move the car as required
    }
    // Using a constructor to assign the values from object creating into the object memory (instance variables)

    // -------------- UPDATING THE CAR POS ---------------

    update(roadBorders) {
        // Recieves the roadBorders and passes it to the sensor for ray collision
        this.#move()
        // Calling the move function that handles movement

        this.sensor.update(roadBorders)
        // Calling the update method from sensor
    }

    #move() {
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

        // -------------- LEGACY CAR MOVEMENT ---------------

        // Basic Legacy Implementation for left and right motion
        // This implementation, while being unrealistic also breaks the laws of the simulation. When going diagonally, it has the forward max speed of 3 as well as the sideways max speed of 3 that gives as 3 * root2 as the final speed which is greater than max speed

        // if (this.controls.left) {
        //     this.x -= 2
        //     // Closer to left side (0)
        // }
        // if (this.controls.right) {
        //     this.x += 2
        //     // Closer to right side (1920)
        // }

        // -------------- LEGACY CAR UPDATION ---------------

        // This is nothing but angles on a unit circle. But in this case, 0deg is facing upwards(forward for the car). Thus, its a unit circle rotated anticlockwise by 90deg. That is why left is +ve and right is -ve
        // The above defines our coordinate system

        // Note : By constantly checking for Non-Zero speed before left or right updation, we remove the possibility of car spinning on the spot. When not having any speed, the car cannot change direction, so no rotation on the spot
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1
            // Checks if we are currently reversing or not. Multiplies that value into left and right movement to stop the weird behaviour of inverted reverse controls

            if (this.controls.left) {
                this.angle += 0.03 * flip
                // Leftwards considered positive angle
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip
                // Rightwards considered negative angle
            }
        }

        // -------------- TRIGNOMETRIC CAR UPDATION ---------------

        this.x -= Math.sin(this.angle) * this.speed
        // x value changes as a measure of sin(angle) * speed magnitude
        this.y -= Math.cos(this.angle) * this.speed
        // y value changes as a measure of cos(angle) * speed magnitude

        // In normal phsyics, horizontal movement with cos and vertical with y. Since the circle is rotated here, we reverse them and subtract

        // -------------- LEGACY CAR UPDATION ---------------
        // this.y -= this.speed
        // Finally updating speed
        // When moving forward, we decrement y value to make it closer to the top of the screen
        // When moving forward, we decrement y value to make it closer to the top of the screen
        // This is auto handled due to the sign of speed being correct formulae wise
    }

    // -------------- DRAWING THE CAR ---------------

    draw(ctx) {
        // To implement rotations
        ctx.save()
        // Saves current values
        ctx.translate(this.x, this.y)
        // Moving ctx to x and y position
        ctx.rotate(-this.angle)
        // Rotates by required value. Clockwise default thus -ve

        // The draw method takes ctx of type Context to mark context of drawing start position
        ctx.beginPath()
        // Marks the start position of drawing

        ctx.rect(
            -this.width / 2,
            //Centre of car on x axis. Moves that amount from x translated position
            -this.height / 2,
            //Center of car on y axis. Moves that amount from y translated position
            this.width,
            this.height,
        )
        // The .rect() function takes x and y parameters to draw a rectanlgle. We need the centre of the rectangle to be at centre of car.
        // For this, we calulate the start drawing position using the formulae given above

        ctx.fill()
        // Fills the drawn shape with solid colour

        ctx.restore()
        // To stop the calling of functions and prevents infinite translations/rotations

        this.sensor.draw(ctx)
        // Passing the draw method which has ctx parameter from sensor. So now the responsibility of drawing goes to car
    }
}
