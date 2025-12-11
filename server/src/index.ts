import express from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:6000/tablego_db';

// mongodb connection
mongoose.connect(dbUrl).then((_) => {
    console.log(`Successfully connected to MongoDB at ${dbUrl}`);
}).catch(error => {
    console.log('MongoDB connection error:', error);
});

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:4200'];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());

// session
const sessionOptions: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'testsecret',
    resave: false,
    saveUninitialized: false
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/app', configureRoutes(passport, express.Router()));

app.listen(port, () => {
    console.log(`Server is listening on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});

console.log('After server is ready.');