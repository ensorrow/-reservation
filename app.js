import Koa from 'koa';
const app = new Koa();
import render from './lib/render';
import route from 'koa-route';
import serve from 'koa-static';
import controller from './lib/controller';
import middleware from './lib/middleware';

app.use(serve(__dirname + '/public'));

// app.use(middleware.casAuth);

app.use(route.get('/', async (ctx) => {
	ctx.body = await render('main', {name: 'hmmmmm'});
}));

app.use(route.get('/api/events', controller.getEvents));
app.use(route.post('/api/events', controller.addEvents));

app.use(route.get('/404', async (ctx) => ctx.body = 'not found'));

app.listen(3000);