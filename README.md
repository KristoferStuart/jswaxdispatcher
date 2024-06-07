<h1>DEPRECATED]</h1>
Please use [Wharfkit](https://wharfkit.com/) for future implementation of the WAX Blockchain in your projects

# jswaxdispatcher
Quickly integrate submitting WAX blockchain transactions in NodeJS projects
## Installation
`npm i jswaxdispatcher`
## Usage
```js
const { jswaxdispatcher } = require('jswaxdispatcher')
const projectWallet = new jswaxdispatcher(privateKey, walletAddress, permission, customSignatureProvider)
//permission & customSignatureProvider optional but recommended.
//DEFAULTS permission = 'active', customSignatureProvider = JsSignatureProvider from eosjs

projectWallet.sendWax(quantity, recipient, memo) //memo optional
    .then((res) => {console.log(res)});
```
## Functions
### `.sendWax( quantity, recipient , memo )`
Send an address WAX with optional memo

### `.sendTokens( quantity, symbol, tokenContractAcct, recipient, memo )`
Send an address a specified token with optional memo

### `.sendAssets( assetIds[], recipient, memo )`
Send an address NFTs by specified asset_ids with optional memo

### `.burnAssets( assetIds[] )`
Burn NFTs by specified asset_ids

### `.mintFromTemplate( collectionName, schemaName, templateId, recipient, amount )`
Mint NFTs by specified template #, wallet must be authorized with the collection
## WARNING
The default customSignatureProvider is JsSignatureProvider included with eosjs.

"Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production" 
~[eosjs documentation](https://github.com/EOSIO/eosjs)




