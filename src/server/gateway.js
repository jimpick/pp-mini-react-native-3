var expressWebSocket = require('express-ws')
var websocketStream = require('websocket-stream/stream')
const pump = require('pump')
const through2 = require('through2')
const ram = require('random-access-memory')
const toBuffer = require('to-buffer')
const hypercore = require('hypercore')
const Multicore = require('../lib/multicore')

require('events').prototype._maxListeners = 100

const multicores = {}
let numStreams = 0;

function attachWebsocket (devServer, server) {
  console.log('Attaching websocket')
  /*
  expressWebSocket(router, server, {
    perMessageDeflate: false
  })
  */
  expressWebSocket(devServer.app, server, {
    perMessageDeflate: false
  })
  // devServer.app.use(router)

  devServer.app.ws('/archiver/:key/:actorKey', (ws, req) => {
    const archiverKey = req.params.key
    const actorKey = req.params.actorKey
    console.log('Websocket initiated for', archiverKey)
    console.log('Local actor key', actorKey)
    let multicore
    if (multicores[archiverKey]) {
      multicore = multicores[archiverKey]
      console.log('Using cached multicore')
    } else {
      console.log('Creating new multicore')
      multicore = new Multicore(ram, {key: req.params.key})
      multicores[archiverKey] = multicore
      const ar = multicore.archiver
      ar.on('add', feed => {
        console.log('archive add', feed.key.toString('hex'), feed.length)
        multicore.replicateFeed(feed)
      })
      ar.on('sync', feed => {
        console.log('archive sync', feed.key.toString('hex'), feed.length)
      })
      ar.on('ready', () => {
        console.log('archive ready', ar.changes.length)
        ar.changes.on('append', () => {
          console.log('archive changes append', ar.changes.length)
        })
        ar.changes.on('sync', () => {
          console.log('archive changes sync', ar.changes.length)
        })
      })

      // Join swarm
      const userData = {
        name: 'react-native-web'
      }
      if (actorKey !== 'none') {
        userData.key = actorKey
      }
      const sw = multicore.joinSwarm({
        userData: JSON.stringify(userData)
      })
      sw.on('connection', (peer, type) => {
        if (!peer.remoteUserData) {
          console.log('Connect - No user data')
          return
        }
        try {
          const userData = JSON.parse(peer.remoteUserData.toString())
          if (userData.key) {
            console.log(`Connect ${userData.name} ${userData.key}`)
            const dk = hypercore.discoveryKey(toBuffer(userData.key, 'hex'))
            multicore.archiver.add(dk)
            multicore.announceActor(userData.name, userData.key)
          }
        } catch (e) {
          console.log(`Connection with no or invalid user data`, e)
          // console.error('Error parsing JSON', e)
        }
      })
    }
    const ar = multicore.archiver
    ar.ready(() => {
      console.log('Number of active websocket streams', ++numStreams);
      const stream = websocketStream(ws)
      pump(
        stream,
        through2(function (chunk, enc, cb) {
          // console.log('From web', chunk)
          this.push(chunk)
          cb()
        }),
        ar.replicate({encrypt: false}),
        through2(function (chunk, enc, cb) {
          // console.log('To web', chunk)
          this.push(chunk)
          cb()
        }),
        stream,
        err => {
          console.log('pipe finished', err && err.message)
          --numStreams;
        }
      )
      multicore.replicateFeed(ar.changes)
    })

  })
}

module.exports = {
  attachWebsocket
}
