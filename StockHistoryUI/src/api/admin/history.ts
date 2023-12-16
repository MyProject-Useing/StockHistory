import request from '/@/utils/request';

// 根据code 和 时间段 获取股票历史记录
export const getHistoryByCode = (params?: Object) => {
	return request({
		url: '/stock/history',
		method: 'get',
		params,
	});
};

// 证券所接口-通过名称获取下拉
export const getShortname = (params?: Object) => {
	return request({
		url: '/stock/shortname',
		method: 'get',
		params,
	});
};


// 证券所接口-获取完整股票列表
export const fetchData = (params?: Object) => {
	return request({
		url: '/stock/data',
		method: 'get',
		params,
	});
};
