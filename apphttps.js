require('dotenv').config();

//for Azure
const session = require('express-session');
const flash = require('connect-flash');
const msal = require('@azure/msal-node');
var cookieParser = require('cookie-parser');

//for onyx
const config = require('config');
const fs = require('fs');
const express = require('express');
const path = require('path');
// const spdy = require('spdy'); //for https
const http2 = require('http2');
const http2Express = require('http2-express-bridge');

const cors = require('cors');
const morgan = require('morgan');
const MBTiles = require('@mapbox/mbtiles');
const TimeFormat = require('hh-mm-ss');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// config constants
const morganFormat = config.get('morganFormat');
const htdocsPath = config.get('htdocsPath');
const privkeyPath = config.get('privkeyPath');
const fullchainPath = config.get('fullchainPath');
const port = config.get('port');
const defaultZ = config.get('defaultZ');
const mbtilesDir = config.get('mbtilesDir');
const logDirPath = config.get('logDirPath');

// logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: `${logDirPath}/coesite-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
    }),
  ],
});

logger.stream = {
  write: message => {
    logger.info(message.trim());
  },
};

const authRouter = require('./routes/auth'); //before app
// const app = express();
const app = http2Express(express);

//(before indexRouter) from here
// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
app.locals.users = {};

// MSAL config
const msalConfig = {
  auth: {
    clientId: process.env.OAUTH_APP_ID,
    authority: process.env.OAUTH_AUTHORITY,
    clientSecret: process.env.OAUTH_APP_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

// Create msal application object
app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);
//(before indexRouter) until here

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mapRouter = require('./routes/map'); //test 0104
//const plowRouter = require('./routes/plow')// for future extension
//const plowORouter = require('./routes/plow-open') // for future extension
//const vtileSRouter = require('./routes/vtile-s') // for single module
const vtileMRouter = require('./routes/vtile-m'); //test 0308
const vtileORouter = require('./routes/vtile-open'); //test 0322
const vtilePRouter = require('./routes/vtile-pass'); //test 0713

// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(
  session({
    secret: process.env.OAUTH_APP_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  })
);

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function (req, res, next) {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash('error_msg');

  // Check for simple error string and
  // convert to layout's expected format
  var errs = req.flash('error');
  for (var i in errs) {
    res.locals.error.push({ message: 'An error occurred', debug: errs[i] });
  }

  // Check for an authenticated user and load
  // into response locals
  if (req.session.userId) {
    res.locals.user = app.locals.users[req.session.userId];
  }

  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//app.use(logger('dev'))
app.use(
  morgan(morganFormat, {
    stream: logger.stream,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, htdocsPath)))

app.use('/', indexRouter);
app.use('/auth', authRouter); //after app.use('/', indexRouter)
app.use('/users', usersRouter);
app.use('/map', mapRouter);
//app.use('/plow', plowRouter)
//app.use('/plow-open', plowORouter)
//app.use('/vtile-s', vtileSRouter)
app.use('/vtile-m', vtileMRouter);
app.use('/vtile-open', vtileORouter);
app.use('/vtile-pass', vtilePRouter); //0713

// error handler
//app.use((req, res) => {
//    res.sendStatus(404)
//})

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = http2.createSecureServer(
  {
    key: fs.readFileSync(privkeyPath),
    cert: fs.readFileSync(fullchainPath),
    allowHTTP1: true, // HTTP/1.1 もサポート
  },
  app
);

server
  .listen(port, () => {
    console.log(`✅ HTTP/2 Server running on https://localhost:${port}`);
  })
  .on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ ポート ${port} はすでに使用されています！`);
    } else {
      console.error(`🚨 サーバー起動エラー:`, err);
    }
  });
