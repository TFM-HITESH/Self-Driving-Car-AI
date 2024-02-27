class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x
        // Position of road horizontally
        this.width = width
        // Width of road
        this.laneCount = laneCount
        // Default number of lanes = 3

        // Precomputing values for easier calculations
        this.left = x - width / 2
        // Left limit of the road is width/2 pixels towards screen origin
        this.right = x + width / 2
        // Right limit of the road is width/2 pixels away from screen origin

        const infinity = 1000000
        // Length of the road on vertical scale. Pretty much too large to ever reach

        // Note that y on screen grows downwards
        this.top = -infinity
        // Top limit is infinity upwards
        this.bottom = infinity
        // Bottom limit is infinity downwards

        // These give the coordinates of the 4 points of the road rectangle
        const topLeft = { x: this.left, y: this.top }
        const topRight = { x: this.right, y: this.top }
        const bottomLeft = { x: this.left, y: this.bottom }
        const bottomRight = { x: this.right, y: this.bottom }

        // This array holds the line segment points
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ]
    }

    // Helper method to find center of lane
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount
        // Each lane is equally wide. So finding the width of each line by dividing widht/count
        return (
            this.left +
            laneWidth / 2 +
            Math.min(laneIndex, this.laneCount - 1) * laneWidth
            // Starts at left, adds half width and adds the width of the extra lanes to the left
            // Min function used so that it always will only stop at rightmost lane when you give lane number greater than the ones possible
        )
    }

    // Drawing the road
    draw(ctx) {
        ctx.linewidth = 15
        // Fat lines
        ctx.strokeStyle = 'white'
        // White lines

        for (let i = 1; i <= this.laneCount - 1; i++) {
            // Loop goes from 0 to laneCount, drawing each lane

            const x = lerp(this.left, this.right, i / this.laneCount)
            // Using linear interpolation to get all the x values where the lines have to be drawn. Similar to arange() function in MATLAB. From lower to higher limit, it splits the given width into i equal chunks
            // Doing i/laneCount to get it as a percentage. That value always remains between 0 and 1 since i <= laneCount

            ctx.setLineDash([20, 20])
            // Dashing. 20 pixel line, 20 pixel empty
            ctx.beginPath()
            // Marks the start position of drawing

            // Drawing the line
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
        }

        ctx.setLineDash([])
        // Resets the line to solid blocks

        // Drawing the bounding borders
        this.borders.forEach((border) => {
            // Iterates over both borders
            ctx.beginPath()
            // Marks the start position of drawing
            ctx.moveTo(border[0].x, border[0].y)
            // Starts at Left, Bottom || Right, Bottom
            ctx.lineTo(border[1].x, border[1].y)
            // Ends at Left, Top || Right,
            ctx.stroke()
        })
    }
}
