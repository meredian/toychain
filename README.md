toychain
========

Toy blockchain-based cryptocurrency, build on Node.js. Implements Proof of Work model for hashing and UXTO model for transactions. Communicate over WebSocket.

For educational purposes only.

It has very simple API, check `app/index.js` to see.

## Install

Prerequisites: `node 9.x`

```bash
npm install
```

## Run

Start several instances to look how they communicate.

```bash
npm start # First terminal
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm start # Second terminal
HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm start # Third terminal
```
