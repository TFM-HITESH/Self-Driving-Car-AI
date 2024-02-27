class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.2
        // Giving these parameters to make Car movement feel more realistic with physics simulated with basic classical laws of motion

        this.maxSpeed = maxSpeed
        // Capping the speed
        this.friction = 0.05
        // Coefficient of friction implemented

        this.angle = 0
        // To keep track of the angle the car is facing
        // Coordinate system is unti circle rotated 90deg counter-clockwise

        this.damaged = false
        // Assuming that car is not damaged at first

        // Only create sensor if car is not a dummy
        if (controlType != 'DUMMY') {
            this.sensor = new Sensor(this)
            // Creating a new sensor Object, to cast rays and calculate intersections. We pass car as the parameter
        }

        this.controls = new Controls(controlType)
        // Creating a controls object which will contain the controls to move the car as required
    }
    // Using a constructor to assign the values from object creating into the object memory (instance variables)

    // -------------- UPDATING THE CAR POS ---------------

    update(roadBorders, traffic) {
        if (!this.damaged) {
            //Only moves the car when not damaged. When damaged, it stops

            // Recieves the roadBorders and passes it to the sensor for ray collision
            this.#move()
            // Calling the move function that handles movement

            this.polygon = this.#createPolygon()
            // Calling the polygon method to find the 4 corners

            this.damaged = this.#assessDamage(roadBorders, traffic)
            // Calling the assessDamage method to check if its damaged or not
        }

        // Only update sensor positions when sensor exists (NON DUMMY)
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic)
            // Calling the update method from sensor
        }
    }

    // Method to check if car is damaged
    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            // Looping through all borders
            if (polysIntersect(this.polygon, roadBorders[i])) {
                // If there is a polygon Intersection, true
                return true
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            // Looping through all borders
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                // If there is a polygon Intersection, true
                return true
            }
        }
        return false
    }

    // Creates a bounding box by finding the 4 corners
    #createPolygon() {
        const points = []
        // All the 4 points are saved here
        const rad = Math.hypot(this.width, this.height) / 2
        // Finding half of the diagonal of the rectangle
        const alpha = Math.atan2(this.width, this.height)
        // Finding the angle from center to the corner

        // Using trignometric ratios to find the 4 corners of the triangle
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        })
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        })
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        })
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        })
        return points
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

    draw(ctx, color) {
        if (this.damaged) {
            ctx.fillStyle = 'red'
            // Damaged cars are red
        } else {
            ctx.fillStyle = color
            // Normal cars are black
        }

        ctx.beginPath()
        // Pendown for drawing

        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        // Moves pen position to first corner
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
            // Makes line to each corner one by one
        }

        ctx.fill()
        // Fills the drawn rectangle

        // Only draw the sensors if it exists (NON DUMMY)
        if (this.sensor) {
            this.sensor.draw(ctx)
            // Passing the draw method which has ctx parameter from sensor. So now the responsibility of drawing goes to car
        }
    }
}
