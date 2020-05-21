/**
 * api code file
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const item = require('../models/item.js');
const user = require('../models/user.js');
const secret = 'this is the secret secret secret 12356'; // same secret as in socket.js used here to sign the authentication token
//get the file with the socket api code
const socket = require('./socket.js');

/*
 * POST User sign in. User Sign in POST is treated here
 */
exports.Authenticate = (req, res) => {
    console.log('Received Authentication POST');
    
    user.findOne({$and: [{username: req.body.username}, {password: req.body.password}]}, (findError, userExist) => {
        if (findError) {
            console.error(findError);
            res.status(500).send("Error finding user.");
        } else {
            if (userExist === null) {
                console.error("Unauthorized. Invalid user or password.");
                res.status(401).send("Unauthorized. Invalid user or password.");
            } else {
                user.updateOne({username: req.body.username}, {$set: {islogged: true}}, (updateError, updatedUser) => {
                    if (updateError) {
                        console.error(updateError);
                        res.status(500).send("Error updating user.");
                    } else {
                        if (updatedUser === null) {
                            console.error("Item not found.");
                            res.status(404).send("Item not found.");
                        } else {
                            console.log("User authenticaded.");
                            var token = jwt.sign(req.body, secret);
                            res.json({username: req.body.username, token: token});
                        }
                    }
                });
            }
        }
    });
 };

/*
 * POST User registration. User registration POST is treated here
 */

exports.NewUser = (req, res) => {
    console.log("Received form submission new user");
    console.log(req.body);
    // check if username already exists
    user.findOne({username: req.body.username}, (findError, userExists) => {
        if (findError) {
            console.error(findError);
            res.status(500).send("Error finding user.");
        } else {
            //If it still does not exist 
            if (userExists === null) {
                //create a new user 
                user.create({
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    islogged: false
                }, (creationError, newUser) => {
                    if (creationError) {
                        console.error(creationError);
                        res.status(500).send("Error creating new user.");
                    } else {
                        console.log("Successfully created new user");
                        //reply with the created user in a JSON object
                        res.json({
                            name: newUser.name,
                            email: newUser.email,
                            username: newUser.username,
                            password: newUser.password
                        });
                    }
                });
            //if the user already exist reply with error
            } else {
                console.error("Username already exists.");
                res.status(409).send("Username already exists.");
            }
        }
    });
};

exports.Unregister = (req, res) => {
    console.log("Received form submission for unregistration");
    console.log(req.body);

    user.deleteOne({username: req.body.username}, (findError, userExists) => {
        if (findError) {
            console.error(findError);
            res.status(500).send("Error finding user.");
        } else {
            if (userExists.deletedCount != 0) {
                res.status(200).send("Successfully unregistered user.")
            } else {
                res.status(404).send("User to unregister not found.")
            }
        }
    });
}

/*
 * POST Item creation. Item creation POST is treated here
 */
exports.NewItem = (req, res) => {
    console.log("received form submission new item");
    console.log(req.body);
    //check if item already exists using the description field if not create item;
    item.findOne({description: req.body.description}, (findError, itemExists) => {
        if (findError) {
            console.error(findError);
            res.status(500).send("Error finding item.");
        } else {
            if (itemExists === null) {
                item.create({
                    description: req.body.description,  
                    currentbid: req.body.currentbid,
                    remainingtime: req.body.remainingtime,
                    wininguser: req.body.wininguser,    
                    sold: false
                }, (creationError, newItem) => {
                    if(creationError) {
                        console.error(creationError);
                        res.status(500).send("Error creating new item.");
                    } else {
                        console.log("Successfully created new item.");
                        res.json({
                            description: newItem.description,
                            currentbid: newItem.currentbid,
                            remainingtime: newItem.remainingtime,
                            wininguser: newItem.wininguser,
                            sold: newItem.sold
                        });
                        socket.NewItemBroadcast(newItem);
                    }
                });
            } else {
                console.error("Item already exists.");
                res.status(409).send("Username already exists.");
            }
        }
    });
};

/*
 GET to obtain all active items in the database 
 */
exports.GetItems = (req, res) => {
    item.find({sold: false}, (err, items) => {
        if (err) {
            console.log("Error finding items.");
            res.status(500).send("Error finding items.");
        } else {
            console.log("Successfully sent items list.")
            res.json(items);
        }
    });
};
