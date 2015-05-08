# classifier-prototype

## What's this?

A prototype of a text based classifier. This means a tool that for a given text returns a list of possibly related tags and their relative probability.

It works based on training data, containing text with their corresponding tags. This prototype allows the entering and editing of such training data and can be used to test the output of the classifier.

Besides relating plain text to tags, this also allows training the relationships between tags. So for a set of given tags and some training data it can give back other probably related tags.

All the data is communicated through a simple JSON API. Editing and other admin functions are provided in a bare bones web based system.

## Tools used

- node.js
- express
- mongodb
- "Natural" https://github.com/NaturalNode/natural
