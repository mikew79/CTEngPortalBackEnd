const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const db = require('_helpers/db');
const User = db.User;
const Group = db.Group;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

//Fully Tested and Working
async function authenticate({ username, password }) {
    const user = await User.findOne({ 'email' : username });

    if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutPassword } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-password');
}

async function getById(id) {
    return await User.findById(id).select('-password');
}

//Fully Tested and Working
async function create(userParam) {

    // validate
    if (await User.findOne({ 'email': userParam.email })) {
        console.log("Exists");
        throw 'Email "' + userParam.email + '" is already registered';
    }
    const user = new User(userParam);

    //Assign new id
    user._id = new mongoose.Types.ObjectId();

    // hash password
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }

    //Set user group
    const group = await Group.findOne({ 'name' : userParam.group });

    if(group) {
        user.gid = group._id;  
    } else {
        throw 'Group "' + userParam.group + '" is not a valid user Group';  
    }


    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}