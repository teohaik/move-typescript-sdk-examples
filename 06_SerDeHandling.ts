import {
    Base64DataBuffer,
    Ed25519Keypair,
    JsonRpcProvider,
    LocalTxnDataSerializer,
    Network,
    RawSigner
} from '@mysten/sui.js';

const provider = new JsonRpcProvider(Network.LOCAL);
const txBytes = "VHJhbnNhY3Rpb25EYXRhOjoAAjiQANT7ay1Fv2aQy8R7kL/pbqSUAQAAAAAAAAAgHDqWbVUHrol87sPPEOpU59UD5LCy07nvFcMRbcyM5zcKY2FweV9hZG1pbghhZGRfZ2VuZQAEAQCSTnwckKQww4TdximZ9nzgVZY8nwQAAAAAAAAAIC1L2j8pugRacreQiKhX1E4UbzBNPj6Ifn0QmaONI+62AQHOnDeXh99NHJK6pb+aBnJO/0vS+wQAAAAAAAAAAAgHcGF0dGVybgAmBQQyZm94BmVwYW5kYQiYY2hlZXRhaAjMcGVuZ3Vpbgb/YmFzaWOzi7XX6QTDrPZ5AUnVAnLCD7pSnpgsQWPEBFn3wFP4Gnuj/JUTxTFEAQAAAAAAAAAgI7mHYzgRnCOWRYVhv8ZvIjpv7EzPKy2qgdL1yESMRQEBAAAAAAAAALgLAAAAAAAA";

const serDe = new LocalTxnDataSerializer(provider);

serDe.deserializeTransactionBytesToSignableTransaction(false, new Base64DataBuffer(txBytes))
    .then(function (res){
        console.log("Deserialized Data: "+JSON.stringify(res));
    })





interface BigInt {
    /** Convert to BigInt to string form in JSON.stringify */
    toJSON: () => string;
}
BigInt.prototype["toJSON"] = function () {
    return this.toString();
};
