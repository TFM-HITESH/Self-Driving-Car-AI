const carCanvas = document.getElementById('carCanvas')
// Getting the Canvas Element to make changes
carCanvas.width = 300
// Setting the Dimensions. Height as full, width as 200 to leave space for neural network

const networkCanvas = document.getElementById('networkCanvas')
// Getting the Canvas Element to make changes
networkCanvas.width = 900
// Setting the Dimensions of network

const carCtx = carCanvas.getContext('2d')
// Getting a context reference to the Canvas, to allow for drawing on top of it
// We only need 2d mode here
// All functions associated with drawing can be referenced to this context
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
// Placing the road at half the width of the canvas (Centered)
// Giving the road a width of 90% canvas width. 10% Margin

// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'KEYS')
// Creating a car object at x=center of a lane n, y=100, width=30, height=50 (all in px). KEYS means control is given to Human

// --------------- GENERATING N CARS ---------------
const N = 100
const cars = generateCars(N)
// Making 100 cars
let bestCar = cars[0]
if (localStorage.getItem('bestBrain')) {
    // If we have the best brain, set it as such
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
        if (i != 0) {
            // Adding a small amount of mutation every brain
            NeuralNetwork.mutate(cars[i].brain, 0.2)
            // 10% mutation each run
        }
    }
}

const NTRAFF = 25
const traffic = [
    // new Car(road.getLaneCenter(1), -100, 55, 85, 'DUMMY', 2, getRandomColor()),
    // new Car(road.getLaneCenter(0), -400, 55, 85, 'DUMMY', 2, getRandomColor()),
    // new Car(road.getLaneCenter(2), -400, 55, 85, 'DUMMY', 2, getRandomColor()),
    // new Car(road.getLaneCenter(0), -700, 55, 85, 'DUMMY', 2, getRandomColor()),
    // new Car(road.getLaneCenter(1), -700, 55, 85, 'DUMMY', 2, getRandomColor()),
    // new Car(road.getLaneCenter(1), -1000, 55, 85, 'DUMMY', 2, getRandomColor()),
    // new Car(road.getLaneCenter(2), -1000, 55, 85, 'DUMMY', 2, getRandomColor()),
]

let trafficDist = 100
const lanes = []

for (let i = 0; i < NTRAFF; i++) {
    let laneNum = Math.round(Math.random() * 2)
    lanes.push(laneNum)
}

for (let i = 0; i < NTRAFF; i++) {
    let laneNum1 = Math.round(Math.random() * Math.random() * 2387329) % 2
    let laneNum2 = Math.round(Math.random() * Math.random() * 7742124) % 2
    trafficDist -= 250

    traffic.push(
        new Car(
            road.getLaneCenter(laneNum1),
            trafficDist,
            55,
            85,
            'DUMMY',
            2,
            getRandomColor(),
        ),
    )
    traffic.push(
        new Car(
            road.getLaneCenter(laneNum2 + 1),
            trafficDist,
            55,
            85,
            'DUMMY',
            2,
            getRandomColor(),
        ),
    )
}
// Creating an array of traffic obstacles. DUMMY means its traffic. 2 is maxspeed of dummy

// Custom function to update the motion of car
animate()

// Local Storage functions to save page. Serializing and saving
function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem('bestBrain')
}

// Generating N cars
function generateCars(N) {
    const cars = []
    // Empty array of cars
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 55, 85, 'AI'))
        // Pushing 1 car at a time. All of them are AI
    }
    return cars
}

function animate(time) {
    // Rendering all traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
        // Leaving [] empty array to make traffic invurnerable. So that they dont crash with each other and on themsleves
        // Renders each traffic car with borders
    }

    // Updating all cars at a time
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic)
        // Calls for re-rendering of object on the page
        // Giving the road borders to the car object
        // Giving our car info about traffic
    }

    bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)))
    // Finding the car whose y value is minimum (top of the screen)

    carCanvas.height = window.innerHeight
    // We are doing Canvas height here, so that it redraws(clears) the extra car trail
    networkCanvas.height = window.innerHeight

    carCtx.save()
    // Saves the current context
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
    // Starts moving the context(canvas) by the amount of y movement of the car. Adds canvas.height * 0.7 to center the car to middle

    road.draw(carCtx)
    // Calls for drawing of entire road bounding box
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'gray')
        // Calls for drawing of entire traffic car bounding box
    }

    carCtx.globalAlpha = 0.2
    // Setting it to 20% transparent

    // Drawing all the cars one by one
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'black')
        // Calls for drawing of entire car bounding box
    }

    carCtx.globalAlpha = 1
    // Back to fully opaque

    bestCar.draw(carCtx, 'green', true)
    // Drawing our winner in Green

    carCtx.restore()
    // Restores the values past animation

    networkCtx.lineDashOffset = -time / 50
    // Code to animate motion of the network

    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    // The visualiser class has static function draw network that takes the brain and draws it for us

    requestAnimationFrame(animate)
    // Adds a request to the render-queue to Animate the frame once more
    // This calls the animate method many times per second, giving the illusion of motion
}
