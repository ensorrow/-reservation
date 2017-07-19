import passport from 'koa-passport';
import cas from 'passport-cas';



passport.use(new (cas.Strategy)({
    version: 'CAS3.0',
    ssoBaseUrl: 'https://cas.eeyes.net/',
    serverBaseURL: 'http://test.dev:3000',
    validateURL: 'http://piao.eeyes.net/'
}, function(profile, done) {
    if (2>3) {
      return done(false);
    }
    if (!profile.user) {
      return done(null, false, {message: 'Unknown profile.user'});
    }
    return done(null, profile.user);
}));