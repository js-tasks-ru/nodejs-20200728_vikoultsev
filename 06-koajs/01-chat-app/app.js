const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribers = new Set();

router.get('/subscribe', async (ctx) => {
  const promise = new Promise((resolve) => {
    ctx.resolve = resolve;
    subscribers.add(ctx);
  });
  return await promise;
});

router.post('/publish', async (ctx) => {
  const {message} = ctx.request.body;
  ctx.response.status = 200;

  if (!message) {
    return;
  }

  subscribers.forEach((subscriber) => {
    subscriber.response.body = message;
    subscriber.response.status = 200;
    subscriber.resolve(message);
    subscribers.delete(subscriber);
  });
});

app.use(router.routes());

module.exports = app;
