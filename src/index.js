const expat = require('node-expat')
const { Transform } = require('stream')

const peek = (arr) => arr.length ? arr[arr.length - 1] : null

const createElement = (name, attrs, parent) => {
  const element = {
    parent,
    name,
    attrs,
    text: null,
    children: []
  }

  if (parent && Array.isArray(parent.children)) {
    parent.children.push(element)
  }

  return element
}

const xmlParser = (opts) => {
  const root = {}
  const elements = [ ]
  const parser = new expat.Parser('UTF-8')
  const options = Object.assign({ mapElement: (e) => e }, opts || {})

  parser.on('startElement', (name, attrs) => {
    const newElement = options.mapElement(createElement(name, attrs, peek(elements)))

    if (elements.length === 0) {
      Object.assign(root, newElement)
    }

    elements.push(newElement)
  })

  parser.on('text', (text) => {
    peek(elements).text = text
  })

  parser.on('endElement', () => {
    stream.push(elements.pop())
  })

  const stream = new Transform({
    objectMode: true,
    transform (chunk, _, callback) {
      parser.write(chunk)

      callback()
    }
  })

  return stream
}

module.exports = { xmlParser }
