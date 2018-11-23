import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';

const LOG_FILE_NAME = '../Access.log';
const writeToFile = (logData: string, cb: Function) => (
    fs.appendFile(LOG_FILE_NAME, logData, 'utf8', err => {cb(); if (err) throw err;}),
    logData
);
const safeDbQuote = (s: string) => s && s.replace(/\\/g, '\\x5C').replace(/"/, '\\x22');
const getXIP = (r: Request) => safeDbQuote((r.headers['x-real-ip'] || r.headers['x-forwarded-for']) as string) || '';
const getIP = (r: Request) => getXIP(r) ? r.connection.remoteAddress + '\txpi:' +  getXIP(r) : r.connection.remoteAddress;
const PORT = process.env.PORT || 3000;
const DELAY = 500;
const N = '\n';
const T = '\t';
const NT = N + T;
const logData = (r: Request): string =>
    Date.now() + T + 'ip:' + getIP(r) +
    NT + 'url:' + r.url +
    NT + 'query:'+ JSON.stringify(r.query) +
    N;
const logger = (r: Request, rs: Response, next: NextFunction) => (
    writeToFile(logData(r), () => setTimeout(next, DELAY)),
    console.log(Date.now() + T + 'ip:' + getIP(r), T + 'url:' + r.url)
);
const app = express();
app.use(logger)
app.use((rq,rs,nx) => (rs.locals.errors = null, nx()));

app.use(express.static('prod'));
app.use(express.static('debug'));
app.use(express.static('public'));

const mainPageRoutes: string[] = [];
const createUrl = (url: string) => `GET: <a href='${url}' target='_self'>${url}</a>`

app.get('/', (req, res) => {
    res.send(
        'Hello<br\><br\>\n'
        + req.url +
        '<br\><pre>'+ mainPageRoutes.map(createUrl).join('\n') + '<pre>' +
        '<hr/><form action="/" method="get" enctype="multipart/form-data">'+
        '<input id="textId" type="text" name="name">'+
        '<input type="submit" value="Submit">'+
        '</form>'+
    '');
});

mainPageRoutes.push('/test')
app.get('/test', (req, res) =>
    res.json({noteArray:[
        {note:'test data text 1', date: new Date()},
        {note:'test data text 2', date: new Date()},
        {note:'test data text 3', date: new Date()},
        {note:'test data text 4', date: new Date()},
    ]})
);

const noteArray: string[] = [];
mainPageRoutes.push('/notes')
app.get('/notes',
    (req, res) => res.json({noteArray})
);

mainPageRoutes.push('/notes/add')
app.get('/notes/add', (req, res) =>
    res.json(
        noteArray.unshift(req.query)
    )
);

mainPageRoutes.push('/notes/delete')
app.get('/notes/delete', (req, res) => 
    res.json(
        noteArray.splice(req.query.key, 1)
    )
);

try{
    app.listen(PORT, () => console.log('Server started on port: ' + PORT));
} catch(error){console.log('error:',error);}
console.log('Server initialized');
