module.exports = function (req, res, next) {
    if (req.session.authUser.role_account != 1) {
        res.render('notification/denied');
    } else {
        next();
    }

};