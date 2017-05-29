# classifier-prototype

[![Greenkeeper badge](https://badges.greenkeeper.io/grrr-amsterdam/classifier-prototype.svg)](https://greenkeeper.io/)

A prototype of a text based classifier. This means a tool that for a given text returns a list of possibly related tags and their relative probability.

It works based on training data, containing text with their corresponding tags. Besides relating plain text to tags, this also allows training the relationships between tags. So for a set of given tags and some training data it can give back other probably related tags.

## Requirements

- Node.js with npm

## Tools used

- node.js
- "Natural" https://github.com/NaturalNode/natural
