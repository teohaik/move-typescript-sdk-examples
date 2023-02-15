/**
 * Retrieves all Transactions performed by a given address and fetches the events emitted from the 1st transaction
 */
import { JsonRpcProvider } from '@mysten/sui.js';

let message: string = 'Hello, Sui user!';
console.log(message);

const myAddress = '0x3e68b87e765d62a8c7ab8c2fbb284ad72d750e17'; //Example Address

const provider = new JsonRpcProvider('https://fullnode.devnet.sui.io:443');

provider.getTransactionsForAddress(myAddress)
    .then(function (transactions) {
        console.log("Transactions for Address " +myAddress);
        console.log(transactions);
        if(transactions.length > 0) {
            getEventsForTransaction(transactions);
        }
    });
//
// function getEventsForTransaction(transactions: any) {
//     var transactionToGetEvents = transactions[0];
//     const txEvents = provider.getEventsByTransaction(
//         transactionToGetEvents
//     ).then(function (events) {
//         console.log("Events for transaction " + transactionToGetEvents);
//         console.log(events);
//     });
// }
//
// const senderEvents =  provider.getEventsBySender(
//     myAddress
//   ).then(function (events) {
//     console.log("Events by sender "+myAddress);
//     console.log(events);
// } );



