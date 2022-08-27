const passport = require('passport'); 
const User = require('../models/user')
const bcrypt = require('bcrypt')

const userController = () =>{
    return {
        getRegister (req, res){
            return res.render('./auth/register')
        },
        async postRegister (req, res){
             
            const {username, email, password} = req.body; 
             
            // Check that every field to filled
            if(!username || !email || !password){
                req.flash('error', 'All field Required');
                req.flash('username', username);
                req.flash('email', email);
                return res.redirect('/login');
            } 
            
            let f = false;

            // check email already exist or not
            var userExist = await User.find({email : email});
            if(userExist){
                req.flash('error', 'Email already taken');           
                return res.redirect('/register');
            }
   
            // Hash the password
            const hashPassword = await bcrypt.hash(password, 10 );
            
            const user = new User({
                username: username,
                email: email,
                password: hashPassword
            });
            
            
            user.save()
            .then(() => {
                return res.redirect('/');
            }).catch((err) => {
                req.flash('error', 'Something wents wrong');
                console.log(err);
                return res.redirect('/register');
            })        
            
             
        },
        getLogin (req, res){
            return res.render('./auth/login')
        },
        postLogin (req, res, next){
            const {email, password} = req.body; 
            
            if(!email || !password){
                req.flash('error', 'All field Required');
                // req.flash('email', email);                 
                return res.redirect('/login');
            }

            passport.authenticate('local', ( err, user, info ) =>{
                // if error occure
                  if(err){
                      req.flash('error', info.message);
                      return next(err);
                  }
                  
                  // if user does not exist
                  if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login');
                  }

                  req.logIn(user , (err) =>{
                      if(err){
                        req.flash('error', info.message)
                        return  next(err);
                      }

                      return res.redirect('/');                   
                  })
            })(req, res, next)

        },
        logout (req, res, next){
            req.logout(function(err) {
                if (err) { return next(err); }
                return res.redirect('/login');
            });               
        }
    }
}

module.exports = userController;