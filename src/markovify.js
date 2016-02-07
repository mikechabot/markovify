import _ from 'lodash';
import util from './services/utils-service';

export class Markovify {
    constructor(data, prefixLength, charLimit, deferBuild) {
        this.chain;                         // Map that holds the generated Markov chain
        this.data = data;                   // Large string of text
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
        if (!util._contains(suffixes, suffix)) {
            suffixes.push(suffix);
            this.chain[prefix] = suffixes;
        }
    }
    buildMarkovChain() {
        this.chain = {};
        if (this.data) {
            const words = util._splitOnSpace(this.data);
            _.forEach(words, (word, i) => {
                let prefix = util._scrub(word);
                if (!_.isEmpty(prefix)) {
                    for(let j = 1; j < this.prefixLength; j++) {
                        const next = util._scrub(words[i+j]);
                        if (next) {
                            prefix = `${prefix} ${next}`;
                        }
                        const suffix = words[i + this.prefixLength];
                        if (!_.isEmpty(suffix)) {
                            this.addToChain(prefix, util._scrub(suffix));
                        }
                    }
                }
            });
            console.log(this.chain);
        } else {
            console.warn('No data found');
        }
    }
    getRandomPrefix() {
        const keys = _.keys(this.chain);
        return keys[util._randomNumberUpTo(keys.length)];
    }
    getRandomSuffix(prefix) {
        const choices = this.chain[prefix];
        if (choices) {
            return choices[util._randomNumberUpTo(choices.length)];
        }
    }
    /*
     *  Shift the prefix
     */
    shiftPrefix(prefix, suffix) {
        if (this.prefixLength > 1) {
            return `${util._splitOnSpaceShiftAndJoin(prefix)} ${suffix}`;
        }
        return suffix;
    }
    generateRandomSentence() {
        let prefix = this.getRandomPrefix(),
            sentence;

        do {
            const suffix = this.getRandomSuffix(prefix);
            if (!suffix) break;

            sentence = !sentence
                ? `${prefix} ${suffix}`
                : `${sentence} ${suffix}`;

            prefix = this.shiftPrefix(prefix, suffix);

        } while (sentence.length <= this.charLimit);

        return `${sentence.capitalize()}.`;
    }
}



export default Markovify;