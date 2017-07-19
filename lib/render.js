import views from 'co-views';
import path from 'path';

module.exports = views(path.join(__dirname, '/../public/views'), {
	map: {html: 'ejs'}
});