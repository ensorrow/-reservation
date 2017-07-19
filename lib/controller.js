import modelService from './model';
import parse from 'co-body';

export default {
	async getEvents(ctx) {
		try{
			const params = ctx.query;
			// if(params.start) params.start = Date.parse(params.start);
			// if(params.end) params.end = Date.parse(params.end);
			if(!params.start||!params.end) throw new Error("参数不完整！");
			const events = await modelService.getEvents(params);
			this.body = {
				code: 200,
				data: events
			};
		}catch(err){
			console.log(err);
			this.body = {
				code: 500,
				msg: err
			}
		}
	},
	async addEvents(ctx) {
		try{
			const events = await parse.json(ctx);
			if(!events) throw new Error('请求参数为空！');
			if(events instanceof Array) {
				if(!events.length) throw new Error('请求参数为空！');
				await modelService.saveEvents(events);
			}else{
				await modelService.saveEvent(events);
			}
			this.body = {
				code: 200,
				msg: '预约已提交！'
			};
		}catch (err){
			console.log(err);
			this.body = {
				code: 500,
				msg: err
			}
		}
	}
}