import websocket from 'websocket-stream'
import pump from 'pump'
import {EventEmitter} from 'events'
import randomAccessIdb from 'random-access-idb'
import hypermergeMicro from '../lib/hypermerge-micro'

const storage = randomAccessIdb('pp-mini')

export default class PixelDoc extends EventEmitter {
  constructor () {
    super()
    const key = localStorage.getItem('key')
    const hm = hypermergeMicro(storage, {key, debugLog: true})
    hm.on('debugLog', console.log)
    hm.on('ready', this.ready.bind(this))
    this.hm = hm
  }

  update(doc) {
    this.emit('update', doc)
  }

  ready () {
    const hm = this.hm
    console.log('Jim ready', hm.key.toString('hex'))
    localStorage.setItem('key', hm.key.toString('hex'))
    // this.setupGlue()
    hm.doc.registerHandler(doc => {
      this.update(doc)
    })

    if (hm.source.length === 0) {
      hm.change('blank canvas', doc => {
        doc.x0y0 = 'w'
        doc.x0y1 = 'w'
        doc.x1y0 = 'w'
        doc.x1y1 = 'w'
      })
    }

    console.log('Ready', hm.get())
    this.update(hm.get())

    hm.multicore.on('announceActor', message => {
      console.log('announceActor', message)
      hm.connectPeer(message.key)
    })

    const archiverKey = hm.getArchiverKey().toString('hex')
    const host = document.location.host
    const proto = document.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${proto}://${host}/archiver/${archiverKey}`
    const stream = websocket(url)
    pump(
      stream,
      hm.multicore.archiver.replicate({encrypt: false}),
      stream,
      err => {
        console.log('Stream ended', err)
      }
    )
    this.emit('ready')
  }
}
