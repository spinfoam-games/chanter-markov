const MarkovBuilder = require('./MarkovBuilder')
const MarkovGenerator = require('./MarkovGenerator')

const phraseList = [
    `call me Ishmael`,
    `it is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife`,
    `a screaming comes across the sky`,
    `many years later as he faced the firing squad Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice`,
    `Lolita light of my life fire of my loins`,
    `happy families are all alike every unhappy family is unhappy in its own way`,
    `it was a bright cold day in April and the clocks were striking thirteen`,
    `it was the best of times it was the worst of times it was the age of wisdom it was the age of foolishness it was the epoch of belief it was the epoch of incredulity it was the season of light it was the season of darkness it was the spring of hope it was the winter of despair`,
    `I am an invisible man`,
    `you don't know about me without you have read a book by the name of the adventures of Tom Sawyer but that ain't no matter`,
    `the sun shone, having no alternative, on the nothing new`,
    `this is the saddest story I have ever heard`,
    `whether I shall turn out to be the hero of my own life or whether that station will be held by anybody else these pages must show`,
    `stately plump Buck Mulligan came from the stairhead bearing a bowl of lather on which a mirror and a razor lay crossed`,
    `through the fence between the curling flower spaces I could see them hitting`,
    `the sky above the port was the color of television tuned to a dead channel`,
    `ships at a distance have every man's wish on board`
]

const nameList = [
    'liam',
    'olivia',
    'emma',
    'noah',
    'ava',
    'elijah',
    'oliver',
    'sophia',
    'amelia',
    'lucas',
    'isabella',
    'mason',
    'ethan',
    'mia',
    'charlotte',
    'mateo',
    'james',
    'luna',
    'harper',
    'logan',
    'benjamin',
    'ella',
    'aiden',
    'mila',
    'gianna',
    'sebastian',
    'ellie',
    'leo',
    'camila'
]

const builder = new MarkovBuilder(2)
builder.addSamples(nameList)

const matrix = builder.buildMatrix()
console.log('---')
console.log(matrix)
console.log('---')

const rs = {
    float: () => Math.random(),
    arrayItem: (ar) => ar[Math.floor(Math.random() * ar.length)]
}

const generator = new MarkovGenerator(rs, matrix)

for (let i = 0; i < 5; i++) {
    console.log(generator.generate(4, Number.POSITIVE_INFINITY))
}