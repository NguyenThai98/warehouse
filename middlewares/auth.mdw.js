module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        res.render('auth/login');
    } else {
        next();
    }
};