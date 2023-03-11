const { JsonRpc, Api } = require('eosjs')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch')
/**
 * @async
 * @param {string} privateKey The private key of the controlled wax wallet.
 * @param {string} walletAddress The wax address associated with the private key. (example: i15.y.c.wam, thepixelgibs, gibbotwallet)
 * @param {*} [walletPermission="active"] The wallet's permissions. If undefined, permission is set to default string 'active'
 * @param {*} [customSignatureProvider] Your custom Signature Provider. If undefined, JsSignatureProvider is used. 
 * 
 * The Signature Provider holds private keys and is responsible for signing transactions. Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production
 * @returns {{sendAssets: [AsyncFunction (anonymous)], burnAssets: [AsyncFunction (anonymous)], mintFromTemplate: [AsyncFunction (anonymous)], sendWax: [AsyncFunction (anonymous)]}}
 */
const jswaxdispatcher = function (privateKey, walletAddress, walletPermission, customSignatureProvider) {
    let signatureProvider;
    (walletPermission) ? walletPermission = walletPermission : walletPermission = `active`;
    (customSignatureProvider) ? signatureProvider = customSignatureProvider : signatureProvider = new JsSignatureProvider([privateKey]);
    const rpc = new JsonRpc('https://wax.greymass.com', { fetch });
    const api = new Api({ rpc, signatureProvider });

    /**
     * @async
     * @param {string[]} assetIds One or more asset ids of NFTs to send; In the form of an array of strings.
     * @param {string} recipient The recipient wallet of sent NFTs
     * @param {string} [memo] 
     * @returns {Promise<{transaction_id: string, processed: JSON}>} 
     */
    this.sendAssets = async function (assetIds, recipient, memo) {
        let result;
        try {
            result = await api.transact({
                actions: [
                    {
                        account: "atomicassets",
                        name: "transfer",
                        authorization: [
                            {
                                actor: walletAddress,
                                permission: walletPermission
                            }
                        ],
                        data: {
                            from: walletAddress,
                            to: recipient,
                            asset_ids: assetIds,
                            memo: memo
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
        } catch (err) { return err }
        return result;
    };
    /**
     * @async
     * @param {string[]} assetIds An array of asset ids to burn
     * @returns {Promise<{transaction_id: string, processed: JSON}>} 
     */
    this.burnAssets = async function (assetIds) { 
        (Array.isArray(assetIds)) ? assetIds = assetIds : assetIds = [assetIds];
        let result, actionArray = [];
        for (let asset of assetIds) {
            actionArray.push({
                account: "atomicassets",
                name: "burnasset",
                authorization: [
                    {
                        actor: walletAddress,
                        permission: walletPermission
                    }
                ],
                data: {
                    asset_owner: walletAddress,
                    asset_id: asset
                }
            })
        }
        try {
            result = await api.transact({
                actions: actionArray
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
        } catch (err) { return err }
        return result;
    };
    /**
     * @async
     * @param {string} collectionName - The 12 digit collection name of the asset(s) to be minted
     * @param {string} schemaName - The schema name
     * @param {number} templateId - The template number
     * @param {string} recipient - Wax wallet address to recieve the newly minted assets
     * @param {number} [amount=1] - The amount of assets to be minted. If undefined, amount is set to 1
     * @returns {Promise<{transaction_id: string, processed: JSON}>} 
     */
    this.mintFromTemplate = async function (collectionName, schemaName, templateId, recipient, amount) {
        (amount) ? this.amountToMint = amount : this.amountToMint = 1;
        let result;
        let actionArray = [];
        let actionObj = {
            account: "atomicassets",
            name: "mintasset",
            authorization: [
                {
                    actor: walletAddress,
                    permission: walletPermission
                }
            ],
            data: {
                authorized_minter: walletAddress,
                collection_name: collectionName,
                schema_name: schemaName,
                template_id: templateId,
                new_asset_owner: recipient,
                immutable_data: [],
                mutable_data: [],
                tokens_to_back: []
            }
        }
        for (let counter = 0; counter < this.amountToMint; counter++) {
            actionArray.push(actionObj)
        }
        try {
            result = await api.transact({
                actions: actionArray
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
        } catch (err) { return err }
        return result;
    };
    /**
     * @async
     * @param {number} quantity - Amount of WAXP to send to the recipient. Will be fixed to 8 decimal places.
     * @param {string} recipient - Wax wallet address recieving WAXP
     * @param {string} [memo] - Memo to include with WAXP transfer
     * @returns {Promise<{transaction_id: string, processed: JSON}>} 
     */
    this.sendWax = async function (quantity, recipient, memo) {
        let result, qtyStr = `${quantity.toFixed(8)} WAX`;
        try {
            result = await api.transact({
                actions: [
                    {
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [
                            {
                                actor: walletAddress,
                                permission: walletPermission
                            }
                        ],
                        data: {
                            from: walletAddress,
                            to: recipient,
                            quantity: qtyStr,
                            memo: memo
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
        } catch (err) { return err }
        return result;
    };
    /**
     * @param {number} quantity 
     * @param {string} ticker 
     * @param {string} tokenContractAcct 
     * @param {string} recipient 
     * @param {string} memo 
     * @returns 
     */
    this.sendTokens = async function (quantity, ticker, tokenContractAcct, recipient, memo) {
        let result, qtyStr = `${quantity} ${ticker}`;
        try {
            result = await api.transact({
                actions: [
                    {
                        account: tokenContractAcct,
                        name: 'transfer',
                        authorization: [
                            {
                                actor: walletAddress,
                                permission: walletPermission
                            }
                        ],
                        data: {
                            from: walletAddress,
                            to: recipient,
                            quantity: qtyStr,
                            memo: memo
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
        } catch (err) { return err }
        return result;
    };
}
exports.jswaxdispatcher = jswaxdispatcher
/*
transaction boilerplate

let result;
        try {
            result = await api.transact({
                actions: []
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })
        } catch (err) {return err}
        return result;
  */