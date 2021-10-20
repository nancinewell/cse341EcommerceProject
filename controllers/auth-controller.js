const User = require('../models/user');
const bcrypt = require('bcryptjs');
//const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.API_KEY);
// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//       api_key: process.env.API_KEY
//     }
//   }));


  // * * * * * * * * * * GET LOGIN * * * * * * * * * * 
  exports.getLogin = (req, res, next) => {
    //set message
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    } else {
        message = null;
    }

    //render login page
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage: message
    });
  }

// * * * * * * * * * * POST LOGIN * * * * * * * * * * 
exports.postLogin = (req, res, next) => {
    //gather info from request
    const email = req.body.email;
    const password = req.body.password;

    //does the user exist? Compare by email
    User.findOne({email: email})
        .then(user => {
            //if email address is not in the system, send user back to login page with error message.
            if(!user){
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }

            //The email exists. Compare the hashed password in mongodb with the hashed password passed through the req.
            bcrypt.compare(password, user.password)
                .then(theyMatch => {
                    //if they match, then set the session info
                    if(theyMatch){
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        //save the session, log any errors, and send Home
                        return req.session.save((err) => {
                            console.log(`Error auth-controller 56: ${err}`);
                            res.redirect('/');
                        });
                    }
                    //If they don't match, then send back to login page with error message.
                    req.flash('error', 'Invalid email or password');
                    res.redirect('/login');
                })
                //catch any errors, log them, and redirect to login page.
                .catch(err => {
                    console.log(`Error auth-controller 66: ${err}`);
                    res.redirect('/login');
                })

        })
    //catch any errors and log them.
    .catch(err => {
        console.log(`Error auth-controller 73: ${err}`);
    });
}

// * * * * * * * * * * POST LOGOUT * * * * * * * * * * 
exports.postLogout = (req, res, next) => {
    //destroy the session, log any errors, and redirect Home
    req.session.destroy( err => {
        console.log(`Error  auth-controller 81: ${err}`);
        res.redirect('/');
    })
}

// * * * * * * * * * * GET SIGNUP * * * * * * * * * * 
exports.getSignup = (req, res, next) => {
    //set message
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    } else {
        message = null;
    }
    //send to signup page with page info
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        isAuthenticated: false,
        errorMessage: message
    });
};

// * * * * * * * * * * POST SIGNUP * * * * * * * * * * 
exports.postSignup = (req, res, next) => {
    //gather info from form
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    //Does user already exist?
    User.findOne({email:email})
        .then(userDoc => {
            //if email already exists, redirect to login page with error message
            if(userDoc){
                req.flash('error', 'Email already exists. Please log in.');
                return res.redirect('/login');
            }
            
            //compare password and confirmPassword. If they don't match, then return to signup page with error
            if(password !== confirmPassword){
                req.flash('error', 'Passwords don\'t match. Please ensure the password is the same in both fields.');
                return res.redirect('/signup');
            }

            //If email doesn't exist, hash the password 12 times for good measure.
            return bcrypt.hash(password, 12)
                //then create a new user with the hashed password
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    });
                    //save the new user
                    return user.save();
                })
                //then redirect to login and send confirmation email
                .then(result => {
                    res.redirect('/login');
                    console.log("Thanks for Signing Up!")
                    // return transporter.sendMail({
                    //     to:email,
                    //     from: 'nanci.newell@gmail.com',
                    //     subject: 'Thanks for Signing Up!',
                    //     html: "<h1>You've successfully signed up for Munchkin Madness!</h1><p>We're so happy to find another kindred spirit ready to take down their friends with silliness and adventure!</p>"
                    // }, function(err, info){
                    //     //log any errors or sucesses
                    //     if(err){
                    //         console.log(`Error auth-controller 145: ${err}`);
                    //     } else {
                    //         console.log(`Message sent: ${info}`);
                    //     }
                    // });
                })
                .catch(err => {
                    console.log(`Error auth-controller 160: ${err}`);
                });
        })
        .catch(err => {
            console.log(`Error auth-controller 164: ${err}`);
        });
};