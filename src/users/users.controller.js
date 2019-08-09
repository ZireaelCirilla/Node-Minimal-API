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
 * Creates a new user
 * @param {request} req Request
 * @param {*} res Response
 */
function create(req, res) {
    const data = req.body
    const username = data.username
    var usersRef = db.ref("users")
    const user = {
        [username]: {
            "email": data.email,
            "username": data.username,
            "name": data.name,
            "tweets": {}
        }
    }
    usersRef.update(user).then(snap => {
        return res.json(data).status(200)
    }).catch(err => {
        return res.send(err).status()
    })
}

/**
 * Returns all users
 * @param {request} req Request
 * @param {*} res Response
 */
function getAll(req, res) {
    var users = {}
    var ref = db.ref("users")
    ref.once("value", function (snapshot) {
        console.log(snapshot.val())
        users = snapshot.val()
        if (users == null) {
            return res.send("No users listed")
        } else {
            return res.json(users).status(200)
        }
    });
}

/**
 * Returns one user by Id
 * @param {request} req Request
 * @param {*} res Response
 */
function getById(req, res) {

}

/**
 * Updates one user by Id
 * @param {request} req Request
 * @param {*} res Response
 */
function update(req, res) {
    const data = req.body
    const username = req.params.username
    const userRef = db.ref(`users/${username}`)
    var user = {};
    await userRef.once("value", function (snapshot) {
        console.log(snapshot.val())
        user = snapshot.val()
        return
    })
    userRef.update({
        "name": data.name ? data.name : user.name,
        "email": data.email ? data.email : user.email
    }).then(reqResponse => {
        return res.json(reqResponse).status(200)
    })
}

/**
 * Removes one user by Id
 * @param {request} req Request
 * @param {*} res Response
 */
function remove(req, res) {
    const username = req.params.username
    const userRef = db.ref(`users/${username}`)
    userRef.remove(removeRes => {
        return res.json(removeRes).status(200)
    }).catch(err => {
        return res.json(err).status(400)
    })
}