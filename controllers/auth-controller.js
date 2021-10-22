const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const crypto = require('crypto');
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
    let message = req.flash('message');
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
        errorMessage: message,
        oldInput: {email: "", password: ""},
        validationErrors: []
    });
  }

// * * * * * * * * * * POST LOGIN * * * * * * * * * * 
exports.postLogin = (req, res, next) => {
    //gather info from request
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log`${errors.array()}`;
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Log In',
          isAuthenticated: false,
          errorMessage: errors.array()[0].msg,
          oldInput: {email: email},
          validationErrors: errors.array()
        })
      }
    //does the user exist? Compare by email
    User.findOne({email: email})
        .then(user => {
            //if email address is not in the system, send user back to login page with error message.
            if(!user){
                return res.status(422).render('auth/signup', {
                    path: '/login',
                    pageTitle: 'Log In',
                    isAuthenticated: false,
                    errorMessage: "Email does not exist. Please sign up!",
                    oldInput: {email: email},
                    validationErrors: []
                  })
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
                    res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Log In',
                        isAuthenticated: false,
                        errorMessage: "Invalid email or password",
                        oldInput: {email: email},
                        validationErrors: []
                      });
                })
                //catch any errors, log them, and redirect to login page.
                .catch(err => {
                    console.log(`Error auth-controller 95: ${err}`);
                    res.redirect('/login');
                })

        })
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
    let message = req.flash('message');
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
        errorMessage: message,
        oldInput: {email: ""},
        validationErrors: []
    });
};

// * * * * * * * * * * POST SIGNUP * * * * * * * * * * 
exports.postSignup = (req, res, next) => {
    //gather info from form
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const securityQuestion1 = req.body.securityQuestion1;
    const securityQuestion2 = req.body.securityQuestion2;
    const securityQuestion3 = req.body.securityQuestion3;
    const securityAnswer1 = req.body.securityAnswer1;
    const securityAnswer2 = req.body.securityAnswer2;
    const securityAnswer3 = req.body.securityAnswer3;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log`Errors line auth controller 147: ${errors.array()}`;
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        oldInput: { name: name, email: email, securityQuestion1: securityQuestion1, securityQuestion2: securityQuestion2, securityQuestion3: securityQuestion3, securityAnswer1: securityAnswer1, securityAnswer2: securityAnswer2, securityAnswer3: securityAnswer3 },
        validationErrors: errors.array()
      });
    }

    let hashedAnswer1, hashedAnswer2, hashedAnswer;
    //If email doesn't exist, hash the password 12 times for good measure.

    bcrypt.hash(securityAnswer1, 12)
        .then(hashedAnswer => {
            hashedAnswer1 = hashedAnswer;
            bcrypt.hash(securityAnswer2, 12)
            .then(hashedAnswer => {
                hashedAnswer2 = hashedAnswer;
                bcrypt.hash(securityAnswer3, 12)
                .then(hashedAnswer => {
                    hashedAnswer3 = hashedAnswer;
                    bcrypt.hash(password, 12)
                    //then create a new user with the hashed password
                    .then(hashedPassword => {
                        const user = new User({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            cart: {items: []},
                            securityQuestion1: securityQuestion1,
                            securityQuestion2: securityQuestion2,
                            securityQuestion3: securityQuestion3,
                            securityAnswer1: hashedAnswer1,
                            securityAnswer2: hashedAnswer2,
                            securityAnswer3: hashedAnswer3
                        });
                        //save the new user
                        return user.save();
                    })
                    .then(result => {

                        res.render('auth/login', {
                            path: '/login',
                            pageTitle: 'Log In',
                            isAuthenticated: false,
                            errorMessage: "Thanks for signing up! ",
                            oldInput: {email: email},
                            validationErrors: []
                        });
                        console.log("Thanks for Signing Up!")
                        
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        console.log(`auth-controller 197: ${err}`);
                        return next(error);
                    });  
                    
                })
                .catch( err => {
                    const error = new Error(err);
                        error.httpStatusCode = 500;
                        console.log(`auth-controller 205: ${err}`);
                        return next(error);
                })
            })
            .catch( err => {
                const error = new Error(err);
                    error.httpStatusCode = 500;
                    console.log(`auth-controller 212: ${err}`);
                    return next(error);
            })
        })
        .catch()

    // bcrypt.hash(password, 12)
    //     //then create a new user with the hashed password
    //     .then(hashedPassword => {
    //         const user = new User({
    //             name: name,
    //             email: email,
    //             password: hashedPassword,
    //             cart: {items: []}
    //         });
    //         //save the new user
    //         return user.save();
    //     })
    //     //then redirect to login and send confirmation email
    //     .then(result => {
    //         res.redirect('/login');
    //         console.log("Thanks for Signing Up!")
    //         // return transporter.sendMail({
    //         //     to:email,
    //         //     from: 'nanci.newell@gmail.com',
    //         //     subject: 'Thanks for Signing Up!',
    //         //     html: "<h1>You've successfully signed up for Munchkin Madness!</h1><p>We're so happy to find another kindred spirit ready to take down their friends with silliness and adventure!</p>"
    //         // }, function(err, info){
    //         //     //log any errors or sucesses
    //         //     if(err){
    //         //         console.log(`Error auth-controller 145: ${err}`);
    //         //     } else {
    //         //         console.log(`Message sent: ${info}`);
    //         //     }
    //         // });
    //     })
    //     .catch(err => {
    //         const error = new Error(err);
    //         error.httpStatusCode = 500;
    //         console.log('auth-controller 278');
    //         return next(error);
    //     });    
};


exports.getReset = (req, res, next) => {
    let message = req.flash('message');
    if(message.length > 0){
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        isAuthenticated: false,
        errorMessage: message
    })
}


exports.postReset = (req, res, next) => {
    const errors = validationResult(req);
    // crypto.randomBytes(32, (err, buffer) => {
    //     if(err){
    //         return res.redirect('/reset');
    //     }
    //     const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                req.flash('message', "Sorry, no account found.");
                return res.redirect('/reset');
            }
            // user.resetToken = token;
            // user.resetExpiration = Date.now() + 3600000;
            // user.save()
            //  .then(result => {
   
                const securityQuestions=[user.securityQuestion1, user.securityQuestion2, user.securityQuestion3];
    
                res.render('auth/security-questions', {
                    path: '/security-questions',
                    pageTitle: 'Security Questions',
                    isAuthenticated: false,
                    errorMessage: "",
                    securityQuestions: securityQuestions,
                    oldInput: {securityAnswer1: "", securityAnswer2: "", securityAnswer3: ""},
                    validationErrors: errors.array(),
                    email: req.body.email
                })
    
            
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            console.log('auth-controller 313');
            return next(error);
            });
}

exports.postSecurityQuestions = (req, res, next) => {
    const email = req.body.email;
    const securityAnswer1 = req.body.securityAnswer1;
    const securityAnswer2 = req.body.securityAnswer2;
    const securityAnswer3 = req.body.securityAnswer3;

    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: email})
        .then(user => {
            if(!user){
                req.flash('message', "Sorry, no account found.");
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetExpiration = Date.now() + 3600000;
            user.save()
                .then(result => {
                    return res.redirect(`/reset/${token}`);
                })
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    console.log(`auth controller 234 token: ${token}`);
    User.findOne({resetToken: token, resetExpiration: {$gt: Date.now()}})
        .then(user => {
            console.log(`auth controller 237 user: ${user}`);
            let message = req.flash('message');
                if(message.length > 0){
                    message = message[0];
                } else {
                    message = null;
                }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                isAuthenticated: false,
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            console.log('auth-controller 261');
            return next(error);
          });
    
    
    
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    const errors = validationResult(req);

    let resetUser;

    User.findOne({resetToken: token, resetExpiration: { $gt: Date.now()}, _id: userId}).then(user => {
        resetUser = user;

        if(!errors.isEmpty()){
            console.log`auth-controller 268: ${errors.array()}`;
            req.flash('message', errors.array()[0].msg);
            //res.redirect('/admin/edit-product/:prodId');
            return res.redirect(`/reset/${token}`);
        }
        
        bcrypt.hash(newPassword, 12)
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            req.flash('message', "Password reset. Please log in.");
            res.redirect('/login');
        })
    })
    
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log('auth-controller 302');
        return next(error);
      });

}