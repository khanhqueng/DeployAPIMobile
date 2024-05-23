require('dotenv').config();
const express = require('express')
const mysql = require('mysql2')
const db = require('./db/User')
const app = express();
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { createUsers, getUserByEmail, getPopularPlace, getRecommendedPlace, getVungTauFood, getVungTauShop, getComment, getUserByID, undoLike, undoDislike, getSavedLocation
    , insertComment, likeComment, dislikeComment, getProfile, addFavourite, deleteFavourite, addSavedLocation, deleteSaved, editName, editDob, editAvatar, getFavourite } = require('./APIcontroller/PUTapi')
const port = process.env.PORT || 8090;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
db.connect((err) => {
    if (err) {
        console.log("Unable to connect db")

    }
    console.log("Success");
})
app.get('/', (req, res) => {
    res.send("Hello api")
})
app.post('/api/createUser', createUsers)
app.get('/api/userLogin', getUserByEmail)
app.get('/api/popularPlace', getPopularPlace)
app.get('/api/getRecommend', getRecommendedPlace)
app.get('/api/getVungtauFood', getVungTauFood)
app.get('/api/getVungtauShop', getVungTauShop)
app.get('/api/getComment', getComment)
app.post('/api/postComment', insertComment)
app.post('/api/likeComment', likeComment)
app.post('/api/dislikeComment', dislikeComment)
app.get('/api/getProfile', getProfile)
app.post('/api/addFavourite', addFavourite)
app.delete('/api/deleteFavourite', deleteFavourite)
app.post('/api/addSavedLocation', addSavedLocation)
app.delete('/api/deleteSaved', deleteSaved)
app.post('/api/editName', editName)
app.post('/api/editDob', editDob)
app.post('/api/editAvatar', editAvatar)
app.get('/api/getFavourite', getFavourite)
app.get('/api/getUserByID', getUserByID)
app.post('/api/undoLike', undoLike)
app.post('/api/undoDislike', undoDislike)
app.get('/api/getSavedLocation', getSavedLocation)
