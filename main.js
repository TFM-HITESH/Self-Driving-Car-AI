const canvas = document.getElementById('myCanvas')
// Getting the Canvas Element to make changes

canvas.width = 200
// Setting the Dimensions. Height as full, width as 200 to leave space for neural network

const ctx = canvas.getContext('2d')
// Getting a context reference to the Canvas, to allow for drawing on top of it
// We only need 2d mode here
// All functions associated with drawing can be referenced to this context

const car = new Car(100, 100, 30, 50)
// Creating a car object at x=100, y=100, width=30, height=50 (all in px)

car.draw(ctx)
// Drawing the required object using the context

// Custom function to update the motion of car
animate()

function animate() {
    car.update()
    // Calls for re-rendering of object on the page

    canvas.height = window.innerHeight
    // We are doing Canvas height here, so that it redraws(clears) the extra car trail

    car.draw(ctx)
    // Calls for re-drawing of entire car bounding box
    requestAnimationFrame(animate)
    // Adds a request to the render-queue to Animate the frame once more
    // This calls the animate method many times per second, giving the illusion of motion
}
