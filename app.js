// npm install pm2 express  ejs -g
// alysson6801@hotmail.com
// comunismo123456

if(process.env.NODE_ENV  !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')

const users = []

const initializePassport = require('./passport-config');
const { flush } = require('pm2');
const { get } = require('http');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);





app.use(express.static(path.join(__dirname, 'html')));
app.set('views', path.join(__dirname, 'html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({extended: false}));
app.use(flash());
console.log('pedrooo')
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.get('/correlacao/processo/manual', checkAuthenticated, (req, res) => {
    res.render('correlacao/processo/manual..html')
})


app.get('/correlacao/processo/importar', checkAuthenticated, (req, res) => {
    res.render('correlacao/processo/importar.html')
});


app.get('/correlacao', checkAuthenticated, (req, res) => {
    res.render('correlacao/correlacao.html')
});

app.get('/descritiva', checkAuthenticated, (req, res) => {
    res.render('descritiva/descritiva.html')
});


app.get('/probabilidade/binominal',checkAuthenticated, (req, res) => {
    res.render('probabilidade/Binominal/binominal.html')
});

app.get('/probabilidade/normal',checkAuthenticated, (req, res) => {
    res.render('probabilidade/Normal/normal.html')
});

app.get('/probabilidade/uniforme',checkAuthenticated, (req, res) => {
    res.render('probabilidade/Uniforme/uniforme.html')
});


app.get('/probabilidade', checkAuthenticated,(req, res) => {
    res.render('probabilidade/probabilidade.html')
});


app.get('/login/cadastrar', (req, res) => {
    res.render('login/cadastrar.html')
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/cadastrar',
    failureFlash: true
}))


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login/login')
});

app.get('/', (req, res) => {
    res.render('index.html');
});

app.post('/login/cadastrar', async (req ,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch (e) {
        req.redirect('/login/cadastrar')
    }
        //console.log(users)
})

app.get('/login/auntentic', (req, res) => {
    res.render('login/autentic.html')
})


function checkAuthenticated(req, res, next) {
    //console.log('check atenticação')
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkNotAuthenticated(req, res, next) {
    //console.log('não atenticar')
    try {
        if(req.isAuthenticated()) {
          return  res.redirect('/login/auntentic')
        }
        next()
    
    } catch (e) {
        //console.log('erro no no check')       
        return e
    }
}





app.listen(3000);

// git init
// git add .
// git commit -m "publish website"
// git remote add umbler https://geonosis.deploy.umbler.com/jnyx56re/octopusproj-com.git
// git push umbler master
// meu deusss