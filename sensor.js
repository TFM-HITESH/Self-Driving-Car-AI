class Sensor {
    constructor(car) {
        this.car = car
        // Sensor must know all the details about the car
        this.rayCount = 5
        // Number of rays being cast
        this.rayLength = 150
        // Length of each ray
        this.raySpread = Math.PI / 2
        // Range where ray is spread around. 90deg

        this.rays = []
        // Maintains details of each ray individually in array
        this.readings = []
        // Holds the results. Stores if intersection is there, and if yes, at what distance
    }

    update(roadBorders) {
        this.#castRays()
        // Calls the private method castRays
        this.readings = []
        for (let i = 0; i < this.rays.length; i++) {
            // Iterating to populate the readings array
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders),
                // Special method to get readings
            )
        }
    }

    #getReading(ray, roadBorders) {
        // Takes params ray and roadBorders

        let touches = []
        // There may be multiple intersections. Keeping track of all of them
        // Reading will be touches[0] or closest reading

        for (let i = 0; i < roadBorders.length; i++) {
            // Iterating through entire border
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1],
            )
            // ray0, ray1 is segment 1, border0, border1 is second segment. Intersection between them
            if (touch) {
                touches.push(touch)
                // Add touch result if there is a touch
            }
        }

        //     for (let i = 0; i < traffic.length; i++) {
        //         const poly = traffic[i].polygon
        //         for (let j = 0; j < poly.length; j++) {
        //             const value = getIntersection(
        //                 ray[0],
        //                 ray[1],
        //                 poly[j],
        //                 poly[(j + 1) % poly.length],
        //             )
        //             if (value) {
        //                 touches.push(value)
        //             }
        //         }
        //     }

        if (touches.length == 0) {
            // No touches encountered
            return null
        } else {
            // In case we have a touch
            // Intersection returns x, y, offset (distance to touch)

            // Using the array map method to take all the offsets
            const offsets = touches.map((e) => e.offset)
            const minOffset = Math.min(...offsets)
            // Finding the minima of all the offsets.  ... is the spread operator Eg. ....[10,15,20] => 10,15,20
            return touches.find((e) => e.offset == minOffset)
            // Returns the minimum touch
        }
    }

    #castRays() {
        this.rays = []
        // castRays will populate this ray function with the required values
        for (let i = 0; i < this.rayCount; i++) {
            // iterates for the number of rays
            const rayAngle =
                lerp(
                    this.raySpread / 2,
                    -this.raySpread / 2,
                    this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1),
                ) + this.car.angle
            // Setting up the ray angle for each ray. Spreads out all the rays in a peacock pattern
            // Starts at - half rayspread to + half rayspread centred around straight direction of car
            // Finally adding car angle to render it along with car rotation

            const start = { x: this.car.x, y: this.car.y }
            // Ray starts at the car itself
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            }
            // Ray ends at some point at some angle away from the centre. Using sin and cos to find the coordinates

            this.rays.push([start, end])
            // Uses the push function to map rays from start to end point
        }
    }

    draw(ctx) {
        // Function to draw all the rays
        for (let i = 0; i < this.rayCount; i++) {
            // Drawing each ray one by one
            let end = this.rays[i][1]
            if (this.readings[i]) {
                // If there is a reading, then setup new position for end
                end = this.readings[i]
                // we are passing x and y into it from getIntersection
            }

            ctx.beginPath()
            // Starts drawing, equivalent to pen down
            ctx.lineWidth = 2
            // Width 2
            ctx.strokeStyle = 'yellow'
            // Yellow lines
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
            // Moves the pen to this start position
            ctx.lineTo(end.x, end.y)
            // Draws lines to this end position
            ctx.stroke()

            // Draws from the tip of where the yellow line ended to the black line
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = 'black'
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
        }
    }
}
