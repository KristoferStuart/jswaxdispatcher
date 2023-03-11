# jswaxdispatcher
Quickly integrate submitting WAX blockchain transactions into NodeJS projects
## Installation
`npm i jswaxdispatcher`
## Usage
```js
const { jswaxdispatcher } = require('jswaxdispatcher')
const projectWallet = new jswaxdispatcher(privateKey, walletAddress, permission, signatureSigner) //permission & signatureSigner optional but recommended.

projectWallet.sendWax(quantity, recipient, memo) //memo optional
    .then((res) => {console.log(res)});
```
## Functions
### `.sendWax( quantity, recipient , memo )`
Send an address WAX with optional memo

### `.sendToken( quantity, symbol, tokenContractAcct, recipient, memo )`
Send an address a specified token with optional memo

### `.sendAssets( assetIds[], recipient, memo )`
Send an address NFTs by specified asset_ids with optional memo

### `.burnAssets( assetIds[] )`
Burn NFTs by specified asset_ids

### `.mintFromTemplate( collectionName, schemaName, templateId, recipient, amount )`
Mint NFTs by specified template #, wallet must be authorized with the collection
