const MODE = require('./constants').MARKOV_MODE

function toPairs(obj) {
    const pairs = []

    for (let k in obj) {
        pairs.push([k, obj[k]])
    }

    return pairs
}

function mapObject(fn, obj) {
    const next = {}

    for (let k in obj) {
        next[k] = fn(obj[k])
    }

    return next
}

function MarkovBuilder(prefixLength = 2, mode = MODE.letters) {
    this.sampleList = []
    this.prefixLength = prefixLength
    this.mode = mode
}

MarkovBuilder.prototype.addSample = function(sample) {
    if (this.mode === MODE.words) {
        this.sampleList.push(sample.trim().split(/\s/))
        return
    }

    this.sampleList.push(sample.trim())
}

MarkovBuilder.prototype.addSamples = function(samples) {
    samples.forEach(sample => this.addSample(sample))
}

MarkovBuilder.prototype.buildMatrix = function() {
    const matrix = {
        prefixLength: this.prefixLength,
        mode: this.mode,
        startSymbols: []
    }
    const transitionMap = {}

    this.sampleList.forEach(
        sample => {
            const lastIndex = sample.length - this.prefixLength
            
            for (let origin = 0; origin <= lastIndex; origin++) {
                const symbol = this.mode === MODE.words
                    ? sample.slice(origin, origin + this.prefixLength).join(' ')
                    : sample.substr(origin, this.prefixLength)

                let next

                if (origin >= lastIndex) {
                    next = '$end'
                } else {
                    next = this.mode === MODE.words
                        ? sample[origin + this.prefixLength]
                        : sample.substr(origin + this.prefixLength, 1)
                }

                // If this symbol is at the beginning of the sample value,
                // add it to the list of valid start symbols
                if (origin === 0) matrix.startSymbols.push(symbol)

                if (!transitionMap[symbol]) transitionMap[symbol] = {}
                if (!transitionMap[symbol][next]) transitionMap[symbol][next] = 0
                transitionMap[symbol][next]++

                console.log(`${symbol} ${next}`)
            }
        }
    )   

    matrix.transitions = mapObject(toPairs, transitionMap)

    for (let k in matrix.transitions) {
        let totalCount = 0
        let runningSum = 0
        
        matrix.transitions[k].sort((a, b) => {
            if (a[0] > b[0]) return -1
            if (a[0] < b[0]) return 1
            return 0
        })

        matrix.transitions[k].forEach(pair => totalCount += pair[1])
        matrix.transitions[k].forEach(pair => {
            runningSum += pair[1] / totalCount
            pair[1] = runningSum
        })
    }

    return matrix
}

module.exports = MarkovBuilder