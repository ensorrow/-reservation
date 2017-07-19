import monk from 'monk';
import soap from 'soap';
const url = 'localhost:27017/order';
const db = monk(url);

export default {
	getName(id) {
		const user = db.get('user');
		return user.findOne(id);
	},
	saveName(params) {
		const user = db.get('user');
		return user.insert(params);
	},
	async saveEvent(params) {
		if(!params.end) params.end =  +params.start + 3600*2*1000;
		const events = db.get('events');
		const docs = await events.find({});
		if(docs && docs.some((doc) => {return (doc.start<=params.start && params.start<=doc.end) || (doc.start<=params.end && params.end<=doc.end)})) {
			return Promise.reject('该时间段已被预约！');
		}
		return events.insert(params);
	},
	async saveEvents(paramsArr) {
		const events = db.get('events');
		const docs = await events.find({});
		var flag = false;
		for(var params of paramsArr) {
			if(!params.end) params.end =  +params.start + 3600*2*1000;
			if(!docs.every((doc) => 
				doc.start>=params.end || doc.end<=params.start
			)) {
				flag = true;
				break;
			}
		}
		if(flag) return Promise.reject('存在已被预约的时间段，请检查！');
		return events.insert(paramsArr);
	},
	async getEvents(params) {
		const events = db.get('events');
		const docs = await events.find({});
		const result = docs.filter((doc) => doc.start >= params.start && doc.end <= params.end);
		return result;
	},
	async getUserInfo(netid) {
		var url = 'http://202.117.1.241/axis2/services/UserInfo?wsdl';
		var args = {auth: 'diff',uid: netid};
		return new Promise(function(resolve, reject) {
			soap.createClient(url, function(err, client) {
				client.getInfoById(args, function(err, result) {
					if(err) reject(err);
					else resolve(result && result.return);
				});
			});
		})
	}
}