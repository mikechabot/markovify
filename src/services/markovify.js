import _ from 'lodash';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export class Markovify {
    constructor(data, prefixLength, charLimit, deferBuild) {
        this.chain;                         // Map that holds the generated Markov chain
        this.data = data;                   // Array of input data (e.g. array of sentences, array of paragraphs)
        this.prefixLength = prefixLength;   // Chain prefix length
        this.charLimit = charLimit;         // Cap the length of generated sentences
        if (!deferBuild) {                  // Defer chain building, must therefore be called manually
            this.buildMarkovChain();
        }
    }
    getChain() {
        return this.chain;
    }
    setData(data) {
        this.data = data;
    }
    setPrefixLength(length) {
        this.prefixLength = length;
    }
    setCharLimit(charLimit) {
        this.charLimit = charLimit;
    }
    addToChain(prefix, suffix) {
        const suffixes = this.chain[prefix] || [];
        if (_.indexOf(suffixes, suffix) === -1) {
            suffixes.push(suffix)
            this.chain[prefix] = suffixes;
        }
    }
    buildMarkovChain() {
        this.chain = {};
        const words = this.data.split(' ');
        for (let i = 0; i < words.length; i++) {
            let prefix = scrub(words[i]);
            if (!_.isEmpty(prefix)) {
                for(let j = 1; j < this.prefixLength; j++) {
                    const next = scrub(words[i+j]);
                    if (next) {
                        prefix = `${prefix} ${next}`;
                    }
                }
                const suffix = words[i + this.prefixLength];
                if (!_.isEmpty(suffix)) {
                    this.addToChain(prefix, scrub(suffix));
                }
            }
        }
        console.log(this.chain);
    }
    getRandomPrefix() {
        const keys = _.keys(this.chain);
        return keys[getRandomNumberUpTo(keys.length)];
    }
    getRandomSuffix(prefix) {
        const choices = this.chain[prefix];
        if (choices) {
            return choices[getRandomNumberUpTo(choices.length)];
        }
    }
    getNextPrefix(prefix, suffix) {
        if (this.prefixLength === 1) {
            return suffix;
        } else {
            const words = prefix.split(SPACE);
            while (words.length >= this.prefixLength) {
                words.shift();
            }
            prefix = words.join(SPACE);
            return `${prefix} ${suffix}`;
        }
    }
    generateRandomSentence() {
        if (!_.isEmpty(this.chain)) {
            let prefix = this.getRandomPrefix(),
                sentence,
                complete = false;

            do {
                console.log('* using prefix: "%s"', prefix);
                const suffix = this.getRandomSuffix(prefix);
                if (!suffix) {
                    console.log('**** Unable to find suffix for prefifx: ', prefix);
                    break;
                }

                console.log('** using suffix: "%s', suffix);
                sentence = !sentence
                    ? `${prefix} ${suffix}`
                    : ` ${sentence} ${suffix}`;

                prefix = this.getNextPrefix(prefix, suffix);

                console.log(sentence.split(SPACE).length);

            } while (!complete && sentence.length <= this.charLimit);


            console.log('***** Returning');
            return `${sentence.capitalize()}.`;
        }
    }
}


const SPACE = ' ';
const splitOnSpace = (str) => {
    return str.split(SPACE);
}

const scrub = (str) => {
    if (str) {
        return str.replace(/[^a-zA-Z\'\t ]/g, "");
    }
}

const getRandomNumberUpTo = (max) => {
    return Math.floor(Math.random() * max);
}

export default Markovify;