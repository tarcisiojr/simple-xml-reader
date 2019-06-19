# simple-xml-reader
A utility to read xml file throuth NodeJS Stream.

# Instalation

```
npm i simple-xml-reader --save
```

# Usage

```javascript
const { Writable } = require('stream')
const fs = require('fs')
const xmlParser = require('simple-xml-reader')

const write = (fn) => {
  return new Writable({
    objectMode: true,
    write (chunk, _, callback) {
      fn(chunk)
      callback()
    }
  })
}

fs.createReadStream('path to xml file'))
  .pipe(xmlParser())
  .pipe(write((node) => {
    console.log('XML Node', node)
  }))
```

# Caution

The xmlParse funcion will create a Tranform stream and as soon a xml node finishes is fully readed a object is created and sent thought the stream. The createds object has the flollowing scructure:
```json
{
    "parent": {...},
    "name": "node name",
    "attrs": { node attributes },
    "text": { node text },
    "children": [{ children nodes ,,,}]
  }
```
If you have a huge XML with many nodes and you don't need the relationsheep beetween then, you can transform the creted element after the creation. With this strategy is useful to avoid too memory consuption, when you must have a huge elements. See de example:

```javascript
...
fs.createReadStream('path to xml file'))
  .pipe(xmlParser({
      mapElement: (e) => {
        e.parent = null // remove the link with parent node
        e.children = [] // remove the links with children nodes
        return e
      }
  }))
  .pipe(write((node) => {
    console.log('XML Node', node)
  }))
...
```