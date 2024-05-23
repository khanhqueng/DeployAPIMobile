const { query } = require('express');
const connection = require('../db/User')
function queryPromise(sql, value = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, value, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        })
    })
}
let createUsers = async (req, res) => {
    try {
        var { name, dob, email, password } = req.body;
        if (!name || !dob || !email || !password) {
            return
        }
        const user = [name, dob, email, password];
        const SQL = "INSERT INTO USERS (name , dob, email, password) VALUES (?,?,?,?)";
        const param = [email, password];
        const SQL2 = "SELECT * FROM USERS where email = ? and password = ?";
        const result = await queryPromise(SQL, user);
        const result2 = await queryPromise(SQL2, param);
        res.status(201).send(result2[0]);

    } catch (err) {
        res.status(401).send({ err });
    }
}

let getUserByID = async (req, res) => {
    try {
        const userID = req.query.userID; 
        const sql = "SELECT * FROM USERS WHERE userID = ?";
        const result = await queryPromise(sql, userID);
        if (result.length === 0) {
            res.send({ errror: "No matching" });
        }
        else {

            res.status(200).send(result[0])
        }

    }
    catch (err) {
        res.status(401).send(err);
    }
}

let getUserByEmail = async (req, res) => {
    try {
        var userEmail = req.query.email;
        var userPassword = req.query.pass;
        if (!userEmail || !userPassword) {
            res.send({ errror: "Please fill info" });
        }
        const userInfo = [userEmail, userPassword];
        const sql = "SELECT * FROM USERS where email = ? and password = ?";
        const result = await queryPromise(sql, userInfo);
        if (result.length === 0) {
            res.send({ errror: "No matching User" });
        }
        else {

            res.status(200).send(result[0])
        }


    } catch (err) {
        res.status(401).send(err);
    }
}
let getPopularPlace = async (req, res) => {
    try {

        const sql = "SELECT * FROM LOCATIONS,POPULAR WHERE LOCATIONS.locationID = POPULAR.locationID";
        const result = await queryPromise(sql);
        if (result.length === 0) {
            res.send({ errror: "No matching Popular" });
        }
        else {

            res.status(200).send(result)
        }



    } catch (err) {
        res.status(401).send(err);

    }
}
let getRecommendedPlace = async (req, res) => {
    try {

        const sql = "SELECT * FROM LOCATIONS,RECOMMEND WHERE LOCATIONS.locationID = RECOMMEND.locationID";
        const result = await queryPromise(sql);
        if (result.length === 0) {
            res.send({ errror: "No matching Popular" });
        }
        else {

            res.status(200).send(result)
        }



    } catch (err) {
        res.status(401).send(err);

    }
}
let getVungTauFood = async (req, res) => {
    try {

        const sql = "SELECT * FROM LOCATIONS WHERE type = 'food'";
        const result = await queryPromise(sql);
        if (result.length === 0) {
            res.send({ errror: "No matching " });
        }
        else {

            res.status(200).send(result)
        }



    } catch (err) {
        res.status(401).send(err);

    }
}
let getVungTauShop = async (req, res) => {
    try {

        const sql = "SELECT * FROM LOCATIONS WHERE type = 'shop'";
        const result = await queryPromise(sql);
        if (result.length === 0) {
            res.send({ errror: "No matching " });
        }
        else {

            res.status(200).send(result)
        }



    } catch (err) {
        res.status(401).send(err);

    }
}
let getComment = async (req, res) => {
    try {
        const locationID = req.query.ID;
        const sql = "SELECT * FROM COMMENT WHERE locationID = ?";
        const result = await queryPromise(sql, locationID);
        res.status(200).send(result)
    } catch (err) {
        res.status(401).send(err);
    }
}
let insertComment = async (req, res) => {
    try {
        var userID = req.query.userID;
        var locationID = req.query.locationID;
        var date = req.query.date;
        var numStar = req.query.numStar;
        var content = req.query.content;
        if (!userID || !locationID || !date || !numStar || !content) {
            return
        }
        const COMMENT = [userID, locationID, date, numStar, content, numStar, locationID, userID];
        const SQL = "INSERT INTO COMMENT(userID,locationID,date,numStar,content) VALUES (?,?,?,?,?); "
        const SQL2 = "UPDATE LOCATIONS SET avgStar = ((avgStar*totalComment)+ ?)/(totalComment+1),totalComment = totalComment+1 WHERE locationID = ? "
        const SQL3 = "UPDATE USERS SET totalComment = totalComment+1 WHERE userID = ? "
        const result = await queryPromise(SQL, COMMENT);
        const result2 = await queryPromise(SQL2, [numStar, locationID]);
        const result3 = await queryPromise(SQL3, userID);
        res.status(201).send("Success inserted");

    } catch (err) {
        res.status(401).send(err);
    }
}
let likeComment = async (req, res) => {
    try {
        const id = req.query.id;
        const SQL = "UPDATE COMMENT SET likes = likes+1 WHERE id = ?;";
        const SQL2 = "UPDATE USERS JOIN COMMENT ON USERS.userID=COMMENT.userID AND COMMENT.id = ? " +
            " SET reliability = ((reliability*totalComment + likes)/(likes+dislikes))/(totalComment+1) "
        const result = await queryPromise(SQL, id);
        const result2 = await queryPromise(SQL2, id);
        res.status(201).send("Success Like");

    } catch (err) {
        res.status(401).send({ err });
    }
}

let undoLike = async (req, res) => {
    try {
        const id = req.query.id;
        const SQL = "UPDATE COMMENT SET likes = likes-1 WHERE id = ?;";
        const SQL2 = "UPDATE USERS JOIN COMMENT ON USERS.userID=COMMENT.userID AND COMMENT.id = ? " +
            " SET reliability = ((reliability*totalComment + likes)/(likes+dislikes))/(totalComment+1) "
        const result = await queryPromise(SQL, id);
        const result2 = await queryPromise(SQL2, id);
        res.status(201).send("Success Like");

    } catch (err) {
        res.status(401).send({ err });
    }
}

let dislikeComment = async (req, res) => {
    try {
        const id = req.query.id;
        const SQL = "UPDATE COMMENT SET dislikes = dislikes+1 WHERE id=?";
        const SQL2 = "UPDATE USERS JOIN COMMENT ON USERS.userID=COMMENT.userID AND COMMENT.id = ? " +
            " SET reliability = ((reliability*totalComment + likes)/(likes+dislikes))/(totalComment+1) "
        const result = await queryPromise(SQL, id);
        const result2 = await queryPromise(SQL2, id);
        res.status(201).send("Success Dislike");

    } catch (err) {
        res.status(401).send({ err });
    }
}

let undoDislike = async (req, res) => {
    try {
        const id = req.query.id;
        const SQL = "UPDATE COMMENT SET dislikes = dislikes-1 WHERE id=?";
        const SQL2 = "UPDATE USERS JOIN COMMENT ON USERS.userID=COMMENT.userID AND COMMENT.id = ? " +
            " SET reliability = ((reliability*totalComment + likes)/(likes+dislikes))/(totalComment+1) "
        const result = await queryPromise(SQL, id);
        const result2 = await queryPromise(SQL2, id);
        res.status(201).send("Success Dislike");

    } catch (err) {
        res.status(401).send({ err });
    }
}

let getProfile = async (req, res) => {
    try {
        const userID = req.query.id;


        const SQL = "SELECT totalComment,reliability,name,dob,email FROM USERS WHERE userID = ?";
        const result = await queryPromise(SQL, userID);
        if (result.length === 0) {
            res.send({ errror: "No matching users" });
        }
        else {

            res.status(200).send(result)
        }

    } catch (err) {
        res.status(401).send({ err });
    }
}
let getFavourite = async (req, res) => {
    try {
        const userID = req.query.id;


        const SQL = "SELECT photo,name,address,avgStar FROM LOCATIONS, FAVOURITE WHERE FAVOURITE.userID = ? AND LOCATIONS.locationID = FAVOURITE.locationID";
        const result = await queryPromise(SQL, userID);
        if (result.length === 0) {
            res.send({ errror: "No matching favourite" });
        }
        else {

            res.status(200).send(result)
        }

    } catch (err) {
        res.status(401).send({ err });
    }
}
let addFavourite = async (req, res) => {
    try {
        var userID = req.query.userID;
        var locationID = req.query.locationID
        const info = [userID, locationID]

        const SQL = "INSERT INTO FAVOURITE VALUES (?,?)";
        const result = await queryPromise(SQL, info);
        res.status(201).send("Success Updated");

    } catch (err) {
        res.status(401).send({ err });
    }
}
let deleteFavourite = async (req, res) => {
    try {
        var userID = req.query.userID;
        var locationID = req.query.locationID
        const info = [userID, locationID]

        const SQL = "DELETE FROM FAVOURITE WHERE userID = ? AND locationID = ?";
        const result = await queryPromise(SQL, info);
        res.status(201).send("Success deleted");

    } catch (err) {
        res.status(401).send({ err });
    }
}
let addSavedLocation = async (req, res) => {
    try {
        var userID = req.query.userID;
        var name = req.query.name;
        var address = req.query.address;
        const info = [userID, name, address]

        const SQL = "INSERT INTO SAVEDLOCATION VALUES (?,?,?)";
        const result = await queryPromise(SQL, info);
        res.status(201).send("Success Saved");

    } catch (err) {
        res.status(401).send({ err });
    }
}
let deleteSaved = async (req, res) => {
    try {
        var userID = req.query.userID;
        var name = req.query.name;
        const info = [userID, name]

        const SQL = "DELETE FROM SAVEDLOCATION WHERE userID = ? AND name = ?";
        const result = await queryPromise(SQL, info);
        res.status(201).send("Success deleted");

    } catch (err) {
        res.status(401).send({ err });
    }
}
let editName = async (req, res) => {
    try {
        var userID = req.query.userID;
        var name = req.query.newname;

        const info = [name, userID]

        const SQL = "UPDATE USERS SET name = ? WHERE userID = ?";
        const result = await queryPromise(SQL, info);
        res.status(201).send("Success Updated");

    } catch (err) {
        res.status(401).send({ err });
    }
}
let editDob = async (req, res) => {
    try {
        var userID = req.query.userID;
        var dob = req.query.newdob;

        const info = [dob, userID]

        const SQL = "UPDATE USERS SET dob = ? WHERE userID =?";
        const result = await queryPromise(SQL, info);
        res.status(201).send("Success Updated");

    } catch (err) {
        res.status(401).send({ err });
    }
}
let editAvatar = async (req, res) => {
    try {
        var userID = req.query.userID;
        var avatar = req.query.avatarlink;

        const info = [avatar, userID]

        const SQL = "UPDATE USERS SET avatar = ? WHERE userID = ?";
        const result = await queryPromise(SQL, info);
        res.status(201).send("Success Updated");

    } catch (err) {
        res.status(401).send({ err });
    }
}

let getSavedLocation = async (req, res) => {
    try {
        const userID = req.query.userID;
        const SQL = "SELECT * FROM SAVEDLOCATION WHERE userID =?"
        const result = await queryPromise(SQL, userID);
        res.status(201).send(result);
    }
    catch (err) {
        res.status(401).send({ err });
    }
}

module.exports = {
    createUsers, getUserByEmail, getPopularPlace, getRecommendedPlace, getVungTauFood, getVungTauShop, getComment, getUserByID, undoLike, undoDislike, getSavedLocation
    , insertComment, likeComment, dislikeComment, getProfile, addFavourite, deleteFavourite, addSavedLocation, deleteSaved, editName, editDob, editAvatar, getFavourite
}