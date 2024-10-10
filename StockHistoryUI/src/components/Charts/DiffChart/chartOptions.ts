import dayjs from 'dayjs';

// 定义单位转换函数，支持负数
const formatValueWithUnit = (value: number): string => {
	const absValue = Math.abs(value); // 获取绝对值
	let result = '';

	if (absValue >= 10000000) {
		// 千万
		result = (absValue / 10000000).toFixed(absValue % 10000000 === 0 ? 0 : 2) + '千万';
	} else if (absValue >= 10000) {
		// 万
		result = (absValue / 10000).toFixed(absValue % 10000 === 0 ? 0 : 2) + '万';
	} else {
		// 低于万
		result = absValue.toFixed(absValue % 1 === 0 ? 0 : 2);
	}

	return value < 0 ? '-' + result : result; // 负数添加负号
};

export const formatTooltip = (params: any) => {
	let formattedTooltip = params[0].axisValueLabel + '<br>';
	params.forEach((param: any) => {
		let value = param.value[1];
		if (typeof value === 'number' && value % 1 !== 0) {
			value = value.toFixed(2);
		}
		value = Number(value).toLocaleString();
		formattedTooltip += `${param.marker} ${param.seriesName}: ${value}<br>`;
	});
	return formattedTooltip;
};

export const initPositionsOptions = () => {
	return {
		xAxis: {
			type: 'category',
			data: [],
			axisTick: { show: false },
			splitLine: { show: false },
			axisLine: { show: false },
			axisLabel: {
				fontSize: 10,
				formatter: function (date: number) {
					return dayjs(new Date(date)).format('YYYY-MM-DD');
				},
			},
		},
		yAxis: [
			{
				type: 'value',
				name: 'positions',
				position: 'left',
				axisLabel: {
					fontSize: 10,
					formatter: (value: any) => formatValueWithUnit(value),
				},
			},
			{
				type: 'value',
				name: 'forwards/spots',
				position: 'right',
				scale: true,
				splitLine: { show: false },
				axisLabel: {
					fontSize: 10,
					formatter: (value: any) => formatValueWithUnit(value),
				},
			},
		],
		grid: {
			left: '5%',
			right: '5%',
			top: '35px',
			bottom: '30px',
		},
		animation: false,
		series: [
			{
				name: 'positions',
				type: 'line',
				symbol: 'none',
				connectNulls: true,
				yAxisIndex: 0,
				itemStyle: {
					color: 'rgb(255,27,0)',
					lineStyle: {
						width: 1.5,
					},
				},
				data: [],
			},
			{
				name: 'forwards',
				connectNulls: true,
				type: 'line',
				yAxisIndex: 1,
				symbol: 'none',
				itemStyle: {
					color: 'DodgerBlue',
					lineStyle: {
						width: 1.5,
					},
				},
				data: [],
			},
			{
				name: 'spots',
				type: 'line',
				connectNulls: true,
				yAxisIndex: 1,
				symbol: 'none',
				itemStyle: {
					color: '#c797eb',
					lineStyle: {
						width: 1.5,
					},
				},
				data: [],
			},
		],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				animation: false,
			},
			formatter: formatTooltip,
		},
	};
};

export const initDefaultOptions = (name: string, xData: any[], seriesData: any[], color = 'rgba(234,76,137,1)') => {
	return {
		animation: false,
		xAxis: {
			type: 'category',
			data: xData,
			axisTick: { show: false },
			splitLine: { show: false },
			axisLine: { show: false },
			axisLabel: {
				fontSize: 10,
				formatter: function (date: number) {
					return dayjs(new Date(date)).format('YYYY-MM-DD');
				},
			},
		},
		yAxis: [
			{
				type: 'value',
				name: name,
				position: 'right',
				axisLabel: {
					fontSize: 10,
					formatter: (value: any) => formatValueWithUnit(value),
				},
			},
			{
				type: 'value',
				name: '',
				position: 'left',
				scale: true,
				axisLabel: {
					fontSize: 10,
					formatter: (value: any) => formatValueWithUnit(value),
				},
			},
		],
		series: [
			{
				name: name,
				type: 'line',
				data: seriesData,
				yAxisIndex: 0,
				connectNulls: true,
				lineStyle: { width: 1.5 },
				symbol: 'none',
				smooth: true,
				itemStyle: {
					color: color,
				},
			},
		],
		grid: {
			left: '5%',
			right: '5%',
			top: '28px',
			bottom: '5px',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				animation: false,
			},
			formatter: formatTooltip,
		},
	};
};
