
import  {
    _parseVAAAlgorand,
    submitVAAHeader,
    TransactionSignerPair
} from "@certusone/wormhole-sdk/lib/cjs/algorand/Algorand";

import {
    hexToUint8Array,
    textToUint8Array,
} from "@certusone/wormhole-sdk/lib/cjs/utils";

import algosdk, {
  Account,
  Algodv2,
  Transaction,
  assignGroupID,
  makeApplicationCallTxnFromObject,
  makePaymentTxnWithSuggestedParamsFromObject,
  OnApplicationComplete,
  mnemonicToSecretKey,
  waitForConfirmation,
  bigIntToBytes,
} from "algosdk";

async function signSendAndConfirmAlgorand(
    algodClient: Algodv2,
    txs: TransactionSignerPair[],
    wallet: Account
) {
    console.log("you suck");
    assignGroupID(txs.map((tx) => tx.tx));
    const signedTxns: Uint8Array[] = [];
    for (const tx of txs) {
        if (tx.signer) {
            signedTxns.push(await tx.signer.signTxn(tx.tx));
        } else {
            signedTxns.push(tx.tx.signTxn(wallet.sk));
        }
    }
    console.log("hi mom");
    await algodClient.sendRawTransaction(signedTxns).do();
    console.log("wait for confirm");
    const result = await waitForConfirmation(
        algodClient,
        txs[txs.length - 1].tx.txID(),
        4
    );
    return result;
}

class AlgoTests {
    constructor() {
    }

    async runTests() {
        const ALGO_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        const ALGOD_ADDRESS= "https://testnet-api.algonode.cloud";
        const ALGOD_PORT: number = 443;

        const algodClient = new Algodv2(ALGO_TOKEN, ALGOD_ADDRESS, ALGOD_PORT);
        let sender = mnemonicToSecretKey("castle sing ice patrol mixture artist violin someone what access slow wrestle clap hero sausage oyster boost tone receive rapid bike announce pepper absent involve")
        console.log(sender.addr);

        const params: algosdk.SuggestedParams = await algodClient.getTransactionParams() .do();

        let t = "01000000000100071c11ea6dac5ddbcf14e719758f30c226ce4efc20703d6e03be539109cf3dfc0b50197f424c0b3b56fe741d388dba6fedb6204bd591194003043e008a3cbadd006288eb7f000000000001f346195ac02f37d60d4db8ffa6ef74cb1be3550047543a4a9ee9acf4d78697b00000000000053a97205032574800030000000102000500951801eb03803af0244523ee2a86c3f27b126abe8904db4b45a82adb5fe21708b4ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a60000002df74798ee0000000002e5d4bafffffff80000002dcd97c520000000000336727501000000020000001f000000006288eb7f000000006288eb7f000000006288eb7b0000002df6ee18f000000000016a007c28fe05d2708c6571182a7c9d1ff457a221b465edf5ea9af1373f9562d16b8d15f9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b000002aa664cb90000000000913af31cfffffff8000002a9673ed6a00000000087e042aa01000000030000001f000000006288eb7f000000006288eb7f000000006288eb7b000002aa664cb90000000000913af31c0264e3935b6fb12d2c5d92d75adb8175ca5b454c7d7ec279b0d27647ee0fd33f08f781a893bc9340140c5f89c8a96f438bcfae4d1474cc0f688e3a52892c731800000000029020c000000000000186a0fffffff800000000028ae782000000000000e72a010000000100000018000000006288eb7f000000006288eb7b000000006288eb7b00000000029020c000000000000186a0101be52cc7068adf747f67759e86b478c6e90f81b05a8121d080cfa0a5a9a0736de025a4cf28124f8ea6cb8085f860096dbc36d9c40002e221fc449337e065b200000000000249f0000000000000c350fffffff800000000000a8a95000000000000c3e600000000000000001f000000006288eb7f000000006288eb7f00000000627d979300000000000249f0000000000000c350fc8dad765deb654af66edb4a25f30c85e22b52ab0c72fdef38059a6dd734c5dd026d1f1cf9f1c0ee92eb55696d3bd2393075b611c4f468ae5b967175edc4c25c0000000000c6f53400000000000fe5ecfffffff80000000000e147d8000000000003e09f000000000000000016000000006288eb7f000000006288eb7b00000000627ecd9c0000000000c6f53400000000000fe5ec"
        let vaa = hexToUint8Array(t)
        console.log(_parseVAAAlgorand(vaa))

        let sstate = await submitVAAHeader(algodClient, BigInt(86525623), vaa, sender.addr, BigInt(86525641))
        let txs = sstate.txs;

        let ret = await signSendAndConfirmAlgorand(algodClient, txs, sender);
        console.log(ret);
    }
}

let t = new AlgoTests()
t.runTests();
