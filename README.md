Early work to create a web based GUI for BISQ using the bisq-api

## Install ##
### Prerequisites ###
Node js and NPM >= 8 ([Package managers](https://nodejs.org/en/download/package-manager/))
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

sudo apt-get install -y nodejs
```
JAVA jdk, jfx >=8, APACHE Maven >= 3.5, git ([Detail instructions](https://github.com/bisq-network/exchange/blob/master/doc/build.md))
```
sudo apt-get install openjdk-8-jdk libopenjfx-java maven git

```
Bitcoin core ([Details](https://bitcoin.org/en/download))
```
sudo add-apt-repository ppa:bitcoin/bitcoin

sudo apt-get update

sudo apt-get install bitcoind bitcoin-qt
```
### Directory structure ###
Measured from your chosen install root `<dir>`. It is important to keep this naming convention and relative locations.
```
mkdir <dir>

cd <dir>

mkdir bisq-front bisq-network bisq-api
```
### bisq-network ###
This will provide the seed node for the regtest local network. ([bisq-network](https://github.com/bisq-network/exchange))
```
cd bisq-network

git clone https://github.com/bisq-network/exchange.git ./

mvn clean package verify -DskipTests -Dmaven.javadoc.skip=true

```
### bisq-api ###
This will provide the API clients ([bisq-api](https://github.com/mrosseel/bisq-api))
```
cd ../bisq-api

git clone https://github.com/mrosseel/bisq-api.git ./

mvn clean install
```
### bisq-front ###
This will provide the http frontend for the api ([bisq-front](https://github.com/citkane/bisq-front))
```
cd ../bisq-front

git clone https://github.com/citkane/bisq-front.git ./

npm install
```
## Run ##
**Set up the regtest environment:**
```
npm run setup
```
This will open (GUI) instances of Bitcoin core, BISQ for an arbitrator, Bob and Alice. Do the following:

1. Fund the network by going to Bitcoin core 'Help / Debug window / Console' and run 'generate 101'

2. In the Bisq arbitrator GUI navigate to 'Account' and press Alt-r. A new 'Arbitrator registration' tab will appear. Click into there and you should have a prefilled key to acknowledge, and then click on 'Register arbitrator'

3. Use the Bitcoin Core GUI to send some BTC funds to Bob and Alice

4. Use the GUI for Bob and Alice to set up fiat and altcoin accounts (SEPA/EURO and Monero tested for now)

Hit ctr c to exit the terminal process (you will need to clear up stray processes otherwise)

**Launch the web server**
```
npm run development
```
or
```
npm run production
```
Url's and endpoints will be logged to console.

Headless mode is not yet working due to: https://github.com/mrosseel/bisq-api/issues/6
