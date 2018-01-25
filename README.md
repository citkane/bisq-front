**Early work to create a web based GUI for BISQ using the bisq-api**

![bisq-front](https://user-images.githubusercontent.com/998947/35113983-2c8a7e78-fc7b-11e7-88cf-855d2478b1b2.jpg)

Table of Contents
=================

1. [Proposal](#proposal)
   * [Proof of Concept (POC)](#proof-of-concept-poc)
   * [Usage scenarios](#usage-scenarios)
   * [Motivation](#motivation)

2. [Architecture](#architecture)
   * [Server](#server)
   * [Client](#client)

3. [Security](#security)

4. [Accessibility](#accessibility)
   * [Devices](#devices)
   * [Language](#language)
   * [People with disabilities](#people-with-disabilities)

5. [Automated Trading](#automated-trading)

6. [Install](#install)

7. [Run](#run)


Proposal
========
[top](#table-of-contents)


With Bisq-front it is proposed to interface the Bisq-api to make manual and automated trading possible from anywhere and on any device.

This is proposed to be a web-client / server model where a GUI is provided in a web browser. The server is singular for each client and is wholly owned and controlled by the human BISQ user.

### Proof of Concept (POC) ###
##### To Do #####
Serve each regtest instance to URL as public demo from headless server.
Awaiting resolution of issue: https://github.com/mrosseel/bisq-api/issues/6

### Usage scenarios ###

##### Local Network #####
A user can have a permanently running instance of BISQ away from their day to day devices and then access trading functionality from any device on the network, eg:

- I run bisq-front on my home media server and do trading from my phone while in my study.

##### Remote Server ####
A user can install bisq-front on a remote (cloud, vm or physical) server and then access trading functionality from any device connected to the internet, eg:
- I am travelling and wish to trade without bringing my "always on" device along with me physically.
- I am behind a corporate or national firewall preventing me from trading on the BISQ network
- It is inconvenient for me to run and access an always on desktop / laptop device and be physically located with it in order to trade.

### Motivation ###
I am of the opinion that in order for BISQ trading adoption to grow towards mainstream, a few user experience factors need to evolve:
- **Convenience:** Being unbound from the need to be physically located with an "always on" desktop / laptop can be a major contribution to adoption. Bisq-front can facilitate this and eventually make it trivial for non-technical users to access this functionality without the need for VNC solutions.

- **Always on:** If the bisq-front model is widely adopted, the amount of reliably "always on" and "always connected" exchanges will increase, thus lowering the incidents of trade dispute due to technical failures.

- **Trust:** Bisq-front could afford users the chance to "play trade" in their browsers on regtest under the BISQ brand. This will comfort them regarding fears of the unknown in decentralised trading, as well as providing risk free self training.

- **Always available:** As political intervention remains unforeseeable, bisq-front could afford the user the possibility to locate their exchange in any friendly juristriction and continue trading regardless of their own geo-political circumstance.


Architecture
============
[top](#table-of-contents)


Bisq-front is based around the following concepts:
- All API related data to/from the browser client is handled over an encrypted websocket stream.

- The stream is interpreted by a middle server co-located on localhost with the exchange.

- ONE client, ONE server - maintain decentralisation.

- Use of well known frameworks for UX and UI that will easily scale as front end best practices evolve.

- Component based modularity and scalability from the ground up.

### Server ###
The middle server (localhost) initiates a [websocket](https://en.wikipedia.org/wiki/WebSocket) connection to the remote web client and interprets the stream ([RFC 6455](http://www.rfc-base.org/rfc-6455.html)) into calls for the bisq-api endpoint (localhost).

This is a [nodeJS](https://nodejs.org/en/) server with the following:
- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js

- [Socket.io](https://socket.io/): Enables real-time bidirectional event-based communication.

### Client ###
The client uses established frameworks and typologies to provide a consistent interface for the user which should be accessible and understandable to a wide range of developers:
- [React](https://reactjs.org/): A JavaScript library for building user interfaces

- [Material Design](https://material.io/): a unified system that combines theory, resources, and tools for crafting digital experiences.

- [Material-UI](https://material-ui-next.com/): React components that implement Google's Material Design.


Security
========
[top](#table-of-contents)


Initial security priorities for bisq-front are two-fold:
1. Protect the anonymity and content of the [data stream](#server) so that the nature of data passed over the internet cannot be identified as BISQ trading or interfered with.

2. Provide token based and two-factor authentication to the web client to protect the user from unauthorised access. (Not implemented in [POC](#proof-of-concept-poc))


Accessibility
=============
[top](#table-of-contents)


Bisq-front intends to be universally accessible.
### Devices ###
Any device of any reasonable screen size which has a mainstream browser (phone, tablet, laptop and desktop)

### Language ###
Provide a programmatic interface to the [Google translate](https://cloud.google.com/translate/docs/) API which makes the UI translatable to all available human languages.

### People with disabilities ###
Integrate the [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) methodology in HTML mark-up and the language translation interface.


Automated Trading
=================
[top](#table-of-contents)

Not in [POC](#proof-of-concept-poc)


Using the [server](#server) layer, it is envisaged to connect to blockchain and [STRIPE](https://stripe.com) API's which can programmatically determine the status of payments.

Stripe integration will be voluntary, and the user will need to set themselves up as a business on the Stripe network, then provide their API key into bisq-front.

Stripe has [payment charges](https://stripe.com/pricing) and the user will need to evaluate the following benefits:
- Accept payments from any fiat currency to their own bank account via Visa, Mastercard, etc, etc.....
- An automated, one-click trading experience when selling and automation when buying from another Stripe peer.

It is further envisaged to set up a GUI rules creator, eg:
```
When market rises above ${x.xx}, automatically create offer to sell {y}BTC @ market rate. If market rate falls below $ {zz.zz}, cancel the offer.
```


Install
=======
[top](#table-of-contents)


#### Prerequisites ####
Node js and NPM >= 8 ([Package managers](https://nodejs.org/en/download/package-manager/))
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

sudo apt-get install -y nodejs
```
JAVA jdk, jfx >=8, APACHE Maven >= 3.5, git ([Detail instructions](https://github.com/bisq-network/exchange/blob/master/doc/build.md))
```
sudo apt-get install openjdk-8-jdk libopenjfx-java openjfx maven git

```
Bitcoin core ([Details](https://bitcoin.org/en/download))
```
sudo add-apt-repository ppa:bitcoin/bitcoin

sudo apt-get update

sudo apt-get install bitcoind bitcoin-qt
```
#### Directory structure ####
Measured from your chosen install root `<dir>`. It is important to keep this naming convention and relative locations.
```
mkdir <dir>

cd <dir>

mkdir bisq-front bisq-network bisq-api
```
#### bisq-network ####
This will provide the seed node for the regtest local network. ([bisq-network](https://github.com/bisq-network/exchange))
```
cd bisq-network

git clone https://github.com/bisq-network/exchange.git ./

mvn clean package verify -DskipTests -Dmaven.javadoc.skip=true

```
#### bisq-api ####
This will provide the API clients ([bisq-api](https://github.com/mrosseel/bisq-api))
```
cd ../bisq-api

git clone https://github.com/mrosseel/bisq-api.git ./

mvn clean install
```
#### bisq-front ####
This will provide the http frontend for the api ([bisq-front](https://github.com/citkane/bisq-front))
```
cd ../bisq-front

git clone https://github.com/citkane/bisq-front.git ./

npm install
```


Run
===
[top](#table-of-contents)


#### Set up the regtest environment: ####
```
npm run setup
```
This will open (GUI) instances of Bitcoin core, BISQ for an arbitrator, Bob and Alice. Do the following:

1. Fund the network by going to Bitcoin core 'Help / Debug window / Console' and run 'generate 101'

2. In the Bisq arbitrator GUI navigate to 'Account' and press Alt-r. A new 'Arbitrator registration' tab will appear. Click into there and you should have a prefilled key to acknowledge, and then click on 'Register arbitrator'

3. Use the Bitcoin Core GUI to send some BTC funds to Bob and Alice

4. Use the GUI for Bob and Alice to set up fiat and altcoin accounts (SEPA/EURO and Monero tested for now)

Hit ctr c to exit the terminal process (you will need to clear up stray processes otherwise)

#### Launch the web server ####
```
npm run development
```
or
```
npm run production
```
Url's and endpoints will be logged to console.

Headless mode is not yet working due to: https://github.com/mrosseel/bisq-api/issues/6
