/**
 * api code file
 */

const socketioJwt = require('socketio-jwt'); //to deal with authentication based in tokens -  WebSocket 
const user = require('../models/user.js'); //database use model
const item = require('../models/item.js');
const secret = 'this is the secret secret secret 12356'; // same secret as in api.js used here to verify the authentication token

var socketIDbyUsername = new Map(); // map to store clients the client object with username has key 
var usernamebySocketID = new Map(); // map to store clients the client object with socketid has key 
var ioSocket = null; // global store object for websocket

//timer function to decrement the remaining time in the items of the database with auctionTime bigger than 0. 
setInterval(() => {
    item.updateMany({ remainingtime: { $gt: 0 } }, { $inc: { remainingtime: -1 } }, { multi: true }, (updateError, updatedItems) => {
        if (updateError) {
            console.error(updateError);
        } else {
            if (updatedItems !== null) {
                item.find({ sold: false, remainingtime: 0 }, (findError, items) => {
                    if (findError) {
                        console.error(findError);
                    } else {
                        items.forEach((soldItem) => {
                            console.log("Item sold: " + soldItem.description);
                            // item.updateOne({ description: soldItem.description }, { $set: { sold: true } }, (updateError, updatedItem) => {
                            //     if (updateError) {
                            //         console.error(updateError);
                            //     } else {
                            //         console.log(updatedItem);
                            //     }
                            // });
                            item.deleteOne({ description: soldItem.description}, (deletedError, deletedItem) => {
                                if (deletedError) {
                                    console.error(deletedError);
                                } else {
                                    console.log(deletedItem);
                                }
                            })
                        });
                        for (var socketID of socketIDbyUsername.values()) {
                            ioSocket.to(socketID).emit("item:sold", items);
                        }
                    }
                });
                item.find({ sold: false }, (findError, items) => {
                    if (findError) {
                        console.error(findError);
                    } else {
                        for (var socketID of socketIDbyUsername.values()) {
                            ioSocket.to(socketID).emit("items:update", items);
                        }
                    }
                });
            }
        }
    });
}, 1000);


/*broadcasts a new item to all logged clients exported so that it can be called from the index.js module after receiving POST for 
 new item 
 */
exports.NewItemBroadcast = function (newItem) {

    if (ioSocket != null) {  // test if the socket was already created (at least one client already connected the websocket)

        itemtoSend = {
            description: newItem.description,
            currentbid: newItem.currentbid,
            wininguser: newItem.wininguser,
            remainingtime: newItem.remainingtime
        }

        for (var socketID of socketIDbyUsername.values()) { // for all clients call the emit method for each socket id to send the new:item method
            ioSocket.to(socketID).emit('new:item', itemtoSend);
        }
    }
}

// export function for listening to the socket
exports.StartSocket = (io) => {

    ioSocket = io; // store socket object for use in interval (timer) function

    io.use(socketioJwt.authorize({
        secret: secret,
        handshake: true
    }));

    io.on('connection', (socket) => {  // first time it is called is when the client connects sucessfully

        console.log(socket.decoded_token.username, 'user connected'); // shows username in the valid token sent by client
        // defintion and handling of events:

        //new user event sent by client
        socket.on('newUser:username', data => {
            // store client in the socketIDbyUsername map the id of the socket is obtainable in the socket object : socket.id 
            // store client in the usernamebySocketID map the username is received in the data object.  
            //you can use the .set method in the Maps
            socketIDbyUsername.set(data.username, socket.id);
            usernamebySocketID.set(socket.id, data.username);
            console.log("new user event received: ");
        });


        socket.on('send:bid', data => {
            console.log("received event send:bid with data = ", data);
            //verify in the database if the data.bid is higher than the current one and if so update the object
            item.findOne({ description: data.item.description }, (findError, bidItem) => {
                if (findError) {
                    console.error(findError);
                } else {
                    if (bidItem.currentbid < data.bid) {
                        item.updateOne({ description: bidItem.description },
                            { $set: { currentbid: data.bid, wininguser: usernamebySocketID.get(socket.id) } },
                            (updateError, result) => {
                                if (updateError) {
                                    console.error(updateError);
                                }
                            });
                    }
                }
            });
            //the the items are sent every second in the interval method so all clients will receive the updated info in the next second.
        });

        //Any other events that you wanto to add that are sent by the client to the server should be coded here you can use the Maps
        //to answer to all clients or the socket.emit method to reply to the same client that sent the received event.

        //when a user leaves this event is executed cleanup what you need here for example update user database
        socket.on('disconnect', function () {
            console.log("User disconnected");
            let username = usernamebySocketID.get(socket.id); // get username from socketId in the Map
            //update user status with looged in false
            user.updateOne({ username: username }, { $set: { islogged: false } }, (err, result) => {
                if (err) {
                    console.error(err);
                }
                if (result) {
                    console.log("User disconnected");
                }
            });
        });
    });
}