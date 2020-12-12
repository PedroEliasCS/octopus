
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function inicialize(passport, getUserByEmail, getUserById) {
    //console.log('dentro do inicialize')
    const authenticateUser = async (email, password, done) => {
        
        //console.log('dentro do inicialize');
        const user = getUserByEmail(email);
        //console.log({user, email, password})
        if(user == null) {
            return done(null, false, {message: ' não cadastrado'})
        }
        
        try {
            if(await bcrypt.compare(password, user.password)) {
                //console.log('login com sucesso')
                return done(null, user)
            }else {
                //console.log('senha invalida')
                return done(null, false, {message : ' senha invalidada'})
            }
        } catch (e) {
            //console.log('erro para autenticar inicialize()  :', e )
            return done(e)
        }
    }
    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
  
    passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

function checkAuthenticated(req, res, next) {
    if(req.isAthenticated()) {
        return next()
    }

    res.redirect('/login')
    
}

module.exports = inicialize