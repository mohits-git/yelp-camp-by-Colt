const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({ username, email })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash('success', "Welcome to the YelpCamp")
            res.redirect('/campgrounds')
        })
    }
    catch(err) {
        req.flash('error', err.message);
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res)=> {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash('success', "Logged out!!")
        res.redirect('/campgrounds');
    })
}
