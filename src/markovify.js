import _ from 'lodash';
import * as utils from './services/utils-service';

export class Markovify {
    constructor(data, prefixLength, charLimit, deferBuild) {
        this.chain = {};                    // Map that holds the generated Markov chain
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
    getWordList() {
        if (this.data) {
            return utils._splitOnSpace(this.data);
        }
    }
    setPrefixLength(length) {
        this.prefixLength = length;
    }
    setCharLimit(charLimit) {
        this.charLimit = charLimit;
    }
    addToChain(prefix, suffix) {
        const suffixes = this.chain[prefix] || [];
        if (!utils._contains(suffixes, suffix)) {
            suffixes.push(suffix);
            this.chain[prefix] = suffixes;
        }
    }
    buildMarkovChain() {
        this.chain = {};
        const words = this.getWordList();
        if (words) {
            _.forEach(words, (word, index) => {
                let prefix = this.buildPrefix(words, utils._scrub(word), index);
                let suffix = this.getSuffix(words, index);
                if (prefix && suffix) {
                    this.addToChain(prefix, suffix);
                }
            });
        } else {
            console.warn(`No words found; check your 'data' object`);
        }
    }
    /**
     *  A suffix contains only one (1) word
     */
    getSuffix(words, index) {
        const suffix = words[index + this.prefixLength];
        return utils._scrub(suffix);
    }
    /**
     *  A prefix contains as many words as defined by "prefixLength"
     */
    buildPrefix(words, word, index) {
        if (!_.isEmpty(word)) {
            let prefix = word;
            for(let i = 1; i < this.prefixLength; i++) {
                const nextWord = utils._scrub(words[index + i]);
                if (nextWord) {
                    prefix = `${prefix} ${nextWord}`;
                }
            }
            return prefix;
        }
    }
    getRandomPrefix() {
        const keys = _.keys(this.chain);
        return keys[utils._randomNumberUpTo(keys.length)];
    }
    getRandomSuffix(prefix) {
        const choices = this.chain[prefix];
        if (choices) {
            return choices[utils._randomNumberUpTo(choices.length)];
        }
    }
    /*
     *  Shift the prefix
     */
    shiftPrefix(prefix, suffix) {
        if (this.prefixLength > 1) {
            return `${utils._splitOnSpaceShiftAndJoin(prefix)} ${suffix}`;
        }
        return suffix;
    }

    addEndingPunctuation(sentence) {
        if (!utils._hasEndingPunctuation(sentence)) {
            sentence = utils._addEndingPunctuation(sentence);
        }
        return sentence;
    }

    /*
     * Prettify the generated sentence
     */
    cleanUp(sentence) {
        sentence = this.addEndingPunctuation(sentence);
        return sentence.capitalize();
    }

    generateRandomSentence() {
        let sentence;

        let prefix = this.getRandomPrefix();
        do {
            const suffix = this.getRandomSuffix(prefix);
            if (!suffix) break;

            sentence = !sentence
                ? `${prefix} ${suffix}`
                : `${sentence} ${suffix}`;

            prefix = this.shiftPrefix(prefix, suffix);

        } while (sentence.length <= this.charLimit);

        return this.cleanUp(sentence);
    }
}



export default Markovify;