var Field = require('./api.field');

module.exports = () => {


	var sign = {
		_id: new Field('Number'),
		caption: new Field('String'),
		code: new Field('String'),
		dateFrom: new Field('Date'),
		dateTo: new Field('Date'),
		strId: new Field('String')
	};

	var currentUser = {
		_id: new Field('String'),
		_registered: new Field('DateOrEmpty'),
		_lastLogin: new Field('DateOrEmpty'),
		token: new Field('Enum', ['54ca40c428ee720017753946', '54c9008e91860e001e0da5d6']),
		type: new Field('Enum', ['anon']),
		birthdate: new Field('DateOrEmpty'),
		feedItemSelection: new Field('Array'),
		sign: new Field('String')
	};

	var articleItem = {
		week: new Field('Date'),
		imageThumb: new Field('Object'),
		title: new Field('String'),
		text: new Field('String'),
		shortText: new Field('String'),
		dateFrom: new Field('Date'),
		oracleId: new Field('Number'),
		dateTo: new Field('Date'),
		perex: new Field('String'),
		type: new Field('String'),
		image: new Field('Object')
	};

	var horoscopeItemLunar = {
		url: new Field('String'),
		image: new Field('Object'),
		text1: new Field('String'),
		text2: new Field('String'),
		text3: new Field('String'),
		date: new Field('Date'),
		type: new Field('Enum', ['lunar'])
	};

	var horoscopeItemDaily = {
		addons: new Field('Object'),
		date: new Field('Date'),
		shortText: new Field('String'),
		signId: new Field('Number'),
		text: new Field('String'),
		type: new Field('Enum', ['horoscopeDaily'])
	};

	var horoscopeItemMonthly = {
		addons: new Field('Object'),
		date: new Field('Date'),
		shortText: new Field('String'),
		signId: new Field('Number'),
		text: new Field('String'),
		type: new Field('Enum', ['horoscopeMonthly'])
	};

	var signRelation = {
		mySign: new Field('Number'),
		percentage: new Field('Number'),
		targetSign: new Field('Number')
	};

	var signItemRelation = {
		relations: new Field('Array', new Field('EnumObject', [signRelation])),
		type: new Field('String')
	};

	var feedItems = {
		_id: new Field('String'),
		data: new Field('EnumObject', [horoscopeItemLunar, horoscopeItemDaily, horoscopeItemMonthly, articleItem, signItemRelation]),
		dateFrom: new Field('Date'),
		dateTo: new Field('Date'),
		originId: new Field('String'),
		priority: new Field('Number'),
		type: new Field('String')
	};

	return {sign, currentUser, articleItem, horoscopeItemDaily, horoscopeItemMonthly, horoscopeItemLunar, feedItems};
};
