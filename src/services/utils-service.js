import _ from 'lodash';

/**      Author: Mike Chabot
 *  Description: Utilities for markovify
 */

const SPACE = ' ';


export const _randomNumberUpTo = (max) => {
    return Math.floor(Math.random() * max);
};

export const _splitOnSpace = (str) => {
    return str.split(SPACE);
};

export const _joinWithSpace = (arr) => {
    return arr.join(SPACE)
};

export const _shiftArray = (arr) => {
    arr.shift();
    return arr;
};

export const _splitOnSpaceShiftAndJoin = (str) => {
    let words = _splitOnSpace(str);
    words = _shiftArray(words);
    return _joinWithSpace(words);
};

// Scrub a string of characters (e.g. double quotes, colons, semi-colons)
export const _scrub = (str) => {
    if (str) {
        return str.replace(/[^a-zA-Z\'\,\.\!\?\t ]/g, "");
    }
};

export const _isEndingPunctuation = (character) => {
    return /\.|\?|\!/.test(character);
}

export const _hasEndingPunctuation = (str) => {
    if (str) {
        return _isEndingPunctuation(_lastChar(str));
    }
}

/*
 *  Recursively drop unwanted end characters
 */
export const _addEndingPunctuation = (str) => {
    if (str) {
        if (/\W/.test(_lastChar(str))) {
            return _addEndingPunctuation(_dropLastChar(str));
        }
        return `${str}.`;
    }
}

export const _contains = (arr, entry) => {
    if (!arr || _.isEmpty(arr)) return;
    return _.indexOf(arr, entry) !== -1;
};

const _dropLastChar = (str) => {
    return str.substring(0, _lastCharIndex(str));
}

const _lastChar = (str) => {
    return str.charAt(_lastCharIndex(str));
}

const _lastCharIndex = (str) => {
    return str.length - 1;
}