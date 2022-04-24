if (process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require('express');
const app = express();

// atlas
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/marketplace'
// mongoose
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// view path, ejs
const path = require('path');
const viewPath = path.join(__dirname, 'views');
app.set('views', viewPath);
app.set('view engine', 'ejs');

// ejs-mate
const engine = require('ejs-mate');
app.engine('ejs', engine);

// serve static files
app.use(express.static(__dirname + '/public'));

// connect mongo
const MongoStore = require('connect-mongo');

// session
const session = require('express-session');
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600 // time period in seconds
  })
}))

// passport
const passport = require('passport');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//  passport local
const LocalStrategy = require('passport-local');

// passport local mongoose
const User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// current user middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

// home page
const Listing = require('./models/listing');
app.get('/', async(req, res) => {
  const listings = await Listing.find();
  res.render('listings/index', {listings});
})

// router
const listingRouter = require('./router/listings');
const userRouter = require('./router/users');
const reviewRouter = require('./router/reviews');
app.use('/listings', listingRouter);
app.use('/', userRouter);
app.use('/users/:id/reviews', reviewRouter);

const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})