const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const { indexOf } = require('lodash');
const router = new Router();

const subscribers= [];

router.get('/subscribe', async (ctx, next) => {
    try { 
        let message = await new Promise((res, rej) => {
            subscribers.push(res);
        });
        ctx.body = message;
    } catch {
        ctx.status = 500;
        ctx.body = 'Internal server error';
    }
});

router.post('/publish', async (ctx, next) => {
    if ("message" in ctx.request.body && ctx.request.body.message){
        while(subscribers.length){
            subscribers.shift()(ctx.request.body.message);
        }
        ctx.body = 'Ok';
    } else {
        ctx.status = 400;
        ctx.body = 'Bad request';
    }
});

app.use(router.routes());

module.exports = app;
