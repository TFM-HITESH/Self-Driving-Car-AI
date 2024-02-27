const carCanvas = document.getElementById('carCanvas')
// Getting the Canvas Element to make changes
carCanvas.width = 200
// Setting the Dimensions. Height as full, width as 200 to leave space for neural network

const networkCanvas = document.getElementById('networkCanvas')
// Getting the Canvas Element to make changes
networkCanvas.width = 300
// Setting the Dimensions of network

const carCtx = carCanvas.getContext('2d')
// Getting a context reference to the Canvas, to allow for drawing on top of it
// We only need 2d mode here
// All functions associated with drawing can be referenced to this context
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
// Placing the road at half the width of the canvas (Centered)
// Giving the road a width of 90% canvas width. 10% Margin

const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI')
// Creating a car object at x=center of a lane n, y=100, width=30, height=50 (all in px). KEYS means control is given to Human

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)]
// Creating an array of traffic obstacles. DUMMY means its traffic. 2 is maxspeed of dummy

// Custom function to update the motion of car
animate()

function animate(time) {
    // Rendering all traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
        // Leaving [] empty array to make traffic invurnerable. So that they dont crash with each other and on themsleves
        // Renders each traffic car with borders
    }

    car.update(road.borders, traffic)
    // Calls for re-rendering of object on the page
    // Giving the road borders to the car object
    // Giving our car info about traffic

    carCanvas.height = window.innerHeight
    // We are doing Canvas height here, so that it redraws(clears) the extra car trail
    networkCanvas.height = window.innerHeight

    carCtx.save()
    // Saves the current context
    carCtx.translate(0, -car.y + carCanvas.height * 0.7)
    // Starts moving the context(canvas) by the amount of y movement of the car. Adds canvas.height * 0.7 to center the car to middle

    road.draw(carCtx)
    // Calls for drawing of entire road bounding box
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'gray')
        // Calls for drawing of entire traffic car bounding box
    }
    car.draw(carCtx, 'black')
    // Calls for drawing of entire car bounding box

    carCtx.restore()
    // Restores the values past animation

    networkCtx.lineDashOffset = -time / 50
    // Code to animate motion of the network

    Visualizer.drawNetwork(networkCtx, car.brain)
    // The visualiser class has static function draw network that takes the brain and draws it for us

    requestAnimationFrame(animate)
    // Adds a request to the render-queue to Animate the frame once more
    // This calls the animate method many times per second, giving the illusion of motion
}
