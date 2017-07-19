import fetch from 'node-fetch';
const host = 'https://cas.eeyes.net/login/';
const service = 'http://test.dev:3000';

export default {
    async casAuth(ctx,next) {
        if(ctx.user) {
            return await next();
        }else{
            const ST = ctx.request.query.ticket;
            if(ST) {
                const re = await fetch(`${host}?service=${service}&ticket=${ST}`);
                console.log(re);
                return await next();
            }else{
                ctx.redirect(`${host}?service=${service}`);
            }
        }
    }
}