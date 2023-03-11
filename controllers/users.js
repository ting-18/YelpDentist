const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Dentist!');
            res.redirect('/dentists');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};


module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    // console.log("POST-REQ...", req.session);
    const redirectUrl = res.locals.returnTo || '/dentists';
    req.flash('success', 'welcome back!');    
    // console.log("POST-REQ2...", req.session);
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
};


// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', 'Goodbye!');
//     res.redirect('/dentists');
// })

module.exports.logout = function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/dentists');
    });
};