class NeuralNetwork {
    // Network made out of many levels
    constructor(neuronCounts) {
        this.levels = []
        // Array of levels to make brain
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]))
            // input and output counts for each neuron network
        }
    }

    static feedForward(givenInputs, network) {
        // Using the same feedforward algorithm to push data from lower levels up to the higher ones after processing
        let outputs = Level.feedForward(givenInputs, network.levels[0])
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i])
        }
        return outputs
    }

    static mutate(network, amount = 1) {
        // This mutates the layers of the network
        network.levels.forEach((level) => {
            for (let i = 0; i < level.biases.length; i++) {
                // Goes through everything in the network
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount,
                )
                // Interpolates to change the value to a number between current bias and another bias between -1,1
            }
            for (let i = 0; i < level.weights.length; i++) {
                // Repeating for all the weights
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount,
                    )
                    // Current value vs New Random
                }
            }
        })
    }
}

class Level {
    // Signifies each level of the neural network
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount)
        this.outputs = new Array(outputCount)
        // Each level has a number of inputs and outputs
        this.biases = new Array(outputCount)
        // Bias is simply the value above which an output neuron is allowed to fire. This is stored in the biases array

        this.weights = []
        // Stores all the weights
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount)
            // For each input Node, creating an empty array which is the size of the output count of nodes
            // Basically a cross product loop
        }

        Level.#randomize(this)
        // We begin with a random brain
    }

    static #randomize(level) {
        // Using static method so that we can serialise it later
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1
                // For each Node, getting a random value between 0 and 1
                // Math.random gives value between 0,1. x2 means between 0,2. -1 between -1,1
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1
            //Biases are also in the same random values
        }
    }

    static feedForward(givenInputs, level) {
        // Simple algorithm to compute values to be forwarded
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i]
            // First taking all the inputs and setting them into the array
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i]
                // Taking a weighted sum. Summation of input*weight for Cij (connection between i,j)
            }

            // finally, if the sum is more than bias, set the output to 1
            if (sum > level.biases[i]) {
                level.outputs[i] = 1
            } else {
                level.outputs[i] = 0
            }
        }

        // Give back all the outputs
        return level.outputs
    }
}
