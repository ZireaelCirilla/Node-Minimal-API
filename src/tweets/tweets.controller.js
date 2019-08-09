var firebase = require("firebase-admin");
var db = firebase.database()

/**
 * POST     /api/users      -> create
 * GET      /api/users      -> getAll
 * GET      /api/users/:id  -> getById
 * PUT      /api/users/:id  -> update
 * DELETE   /api/users/:id  -> remove
 */

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
}

/**
 * Creates a tweet
 * @param {request} req Request
 * @param {*} res Response
 */
function create(req, res) {
    const data = req.body
    var tweetsRef = db.ref("tweets");
    tweetsRef.push(
        {
            "owner": data.username,
            "content": data.content,
            "date": Date.now()
        }
    ).then(snap => {
        var usersRef = db.ref(`users/${data.username}/tweets`)
        console.log(usersRef)
        usersRef.push({
            "tweetId": snap.key
        }).then(tweetRes => {
            console.log(tweetRes)
            return res.json(data).status(200)
        }).catch(err => {
            console.log("line 74")
            return res.send(err)
        })
    }).catch(err => {
        return res.send(err)
    })
}

/**
 * Returns all tweets
 * @param {request} req Request
 * @param {*} res Response
 */
function getAll(req, res) {
    var order = req.query.order
    var tweets = []
    var ref = db.ref("tweets")
    ref.once("value", function (snapshot) {
        snapshot.val()
        for (var key in snapshot.val()) {
            tweets.push(snapshot.val()[key])
        }
        if (order == "asc") {
            tweets.sort(function (a, b) { return a.date - b.date })
        } else if (order == "desc") {
            tweets.sort(function (a, b) { return b.date - a.date })
        }
        if (tweets == null) {
            return res.send("No tweets listed")
        } else {
            return res.json(tweets).status(200)
        }
    });
}

/**
 * Returns one tweet by Id
 * @param {request} req Request
 * @param {*} res Response
 */
function getById(req, res) {
    var tweet = {}
    var ref = db.ref(`tweets/${req.params.id}`)
    ref.once("value", function (snapshot) {
        tweet = snapshot.val()
        if (tweets == null) {
            return res.send("No tweet listed")
        } else {
            return res.json(tweet).status(200)
        }
    });
}

/**
 * Updates one tweet by Id
 * @param {request} req Request
 * @param {*} res Response
 */
function update(req, res) {

}

/**
 * Removes one tweet by Id
 * @param {request} req Request
 * @param {*} res Response
 */
function remove(req, res) {
    const tweetId = req.params.id
    const userRef = db.ref(`tweets/${tweetId}`)
    userRef.remove(removeRes => {
        return res.json(removeRes).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
}