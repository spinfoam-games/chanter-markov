const MODE = require('./constants').MARKOV_MODE

function MarkovGenerator(randomSource, matrix, options = {}) {
    this.randomSource = randomSource
    this.matrix = matrix
    this.minimumLength = options.minimumLength || 4
    this.maximumLength = options.maximumLength || 8
    this.maximumIterations = options.maximumIterations || 40
}

MarkovGenerator.prototype.generate = function(minimumLength, maximumLength) {
    const min = minimumLength || this.minimumLength
    const max = maximumLength || this.maximumLength
    
    let iterations = 0

    const startList = this.matrix.startSymbols
    const startSymbol = this.randomSource.arrayItem(startList)

    let result = this.matrix.mode === MODE.words ? startSymbol.split(/\s/) : startSymbol
    let lastSymbol = startSymbol

    while ((result.length < max || result.length < min) && iterations++ <= this.maximumIterations) {
        const transition = this.matrix.transitions[lastSymbol]
        const select = this.randomSource.float()

        let next = transition[0][0]
    
        for (let i = 0; i < transition.length; i++) {
            next = transition[i][0]
            if (transition[i][1] >= select) break
        }

        if (next === '$end') {
            if (result.length >= min || transition.length === 1) break
            continue
        }

        if (this.matrix.mode === MODE.words) {
            result.push(next)
        } else {
            result += next
        }

        lastSymbol = this.matrix.mode === MODE.words
            ? result.slice(-this.matrix.prefixLength).join(' ')
            : result.slice(-this.matrix.prefixLength)
    }

    return this.matrix.mode === MODE.words ? result.join(' ') : result
}

module.exports = MarkovGenerator