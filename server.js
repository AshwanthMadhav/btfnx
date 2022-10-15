'use strict'

// const { PeerRPCServer }  = require('grenache-nodejs-ws')
const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const ed = require('ed25519-supercop')
const bencode = require('bencode')
//Use when encoding and sign needed
// const { publicKey, secretKey } = ed.createKeyPair(ed.createSeed())

//For storing clientId->hash values
const map = new Map();

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {})
peer.init()

const service = peer.transport('server')
service.listen(1337)

setInterval(() => {
    link.announce('store', service.port, {})
}, 1000)

service.on('request', async(rid, key, payload, handler) => {
  const result = await store(payload)
  handler.reply(null, result)
  showData(payload.clientId)
})

async function store (payload) {
     return new Promise((resolve,reject)=>{
        const {cid,symbol,amount,clientId} = payload
        if(!map.has(clientId))
            map.set(clientId,[])

        const data = {
            cid,symbol,amount,clientId
        }

        /*
        Use when encoding and sign needed
        
        const data = {
            k: publicKey.toString('hex'),
            seq: 1,
            v: {cid,symbol,amount,clientId}
        }
        const toEncode = { seq: data.seq, v: data.v }
        const encoded = bencode.encode(toEncode).slice(1, -1).toString()
        data.sig = ed.sign(encoded, publicKey, secretKey).toString('hex')
        */

        link.put({v:JSON.stringify(data)}, (err, hash) => {
            map.get(clientId).push(hash)
            console.log(map)
            if(err)  reject(err);
            resolve('Order added')
        })   
    })
    
}


function showData(clientId) {
    const hashValues = map.get(clientId);
    hashValues.forEach(element => {
        // console.log(element)
        link.get(element, (err, res) => {
            console.log('data requested from the DHT', err, res)
          })
    });
}

