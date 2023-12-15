import request from '/@/utils/request';

// 根据code 和 时间段 获取股票历史记录
export const getHistoryByCode = (params?: Object) => {
	return request({
		url: '/stock/history',
		method: 'get',
		params,
	});
};

// 获取股票列表
export const fetchList = (params?: Object) => {
	return request({
		url: '/stock/list',
		method: 'get',
		params,
	});
};
