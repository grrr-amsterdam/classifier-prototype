/*
Copyright (c) 2014, Kristoffer Brabrand

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var stopwords = require('./stopwords_nl');
var Tokenizer = require('natural').AggressiveTokenizerNl;

module.exports = function() {
    var stemmer = this;

    stemmer.stem = function(token) {

        token = stripIfEndsIn(token, 's');
        token = stripIfEndsIn(token, 'heden');
        token = stripIfEndsIn(token, 'en');
        token = stripIfEndsIn(token, 'etje');
        token = stripIfEndsIn(token, 'tje');
        token = stripIfEndsIn(token, 'heid');
        token = stripIfEndsIn(token, 'ing');
        token = stripIfEndsIn(token, 'baar');
        token = stripIfEndsIn(token, 'ig');
        token = stripIfEndsIn(token, 't');

        return token;

        function stripIfEndsIn(token, suffix) {
            if (!endsin(token, suffix)) {
                return token;
            }
            return token.slice(0, -(suffix.length));
        }

        function endsin(token, suffix) {
            if (token.length < suffix.length) return false;
            return (token.slice(-suffix.length) == suffix);
        }
    };

    stemmer.tokenizeAndStem = function(text, keepStops) {
        var stemmedTokens = [];

        new Tokenizer().tokenize(text).forEach(function(token) {
            if(keepStops || stopwords.words.indexOf(token.toLowerCase()) == -1)
                stemmedTokens.push(stemmer.stem(token));
        });

        return stemmedTokens;
    };

    return stemmer;
};
