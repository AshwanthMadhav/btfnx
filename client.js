'use strict'

// const { PeerRPCClient }  = require('grenache-nodejs-ws')
const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const { v4: uuidv4 } = require('uuid');
const clientId = uuidv4();

const link = new Link({
  grape: 'http://127.0.0.1:30001',
  requestTimeout: 10000
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

const payload1 = { cid:Date.now(), symbol: 'tETHUSD',amount:0.3,clientId}
peer.request('store', payload1, { timeout: 100000 }, (err, result) => {
  if (err) throw err
  console.log(result)
})

const payload2 = { cid:Date.now(), symbol: 'tBTCUSD',amount:0.4,clientId}
peer.request('store', payload2, { timeout: 100000 }, (err, result) => {
  if (err) throw err
  console.log(result)
})




