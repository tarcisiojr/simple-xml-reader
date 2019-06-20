# simple-xml-reader
A utility to read xml files through NodeJS Stream.

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

The each xml tag readed, the transform stream will generate a JavaScript object to represent it. The created object has the following structure:

```
{
    "parent": {...},
    "name": "node name",
    "attrs": { node attributes },
    "text": { node text },
    "children": [{ children nodes } ...]
  }
```
If you have a very large XML file with many nodes and do not need the relationship between them, you can modify the object created after creation to remove the relationship between the child and parent nodes. This strategy is useful for avoiding excessive memory consumption. See the example below that removes the links between the nodes:

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