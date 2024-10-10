import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { ref, reactive } from 'vue';

import { getColorForNumberSign } from '/@/utils/styleUtils';
import { getSpiderData } from '/@/api/spider';
import { calculateRatio, generateTimeSeries, calculateInterval, getFontColor, customToFixed } from '/@/utils/chatUtils';

const formatDate = (date: number) => dayjs(new Date(date)).format('YYYY-MM-DD');
const formatTime = (value: any, times: any[]) => (times.length < 250 ? dayjs(value).format('HH:mm') : dayjs(value).format('MM-DD HH:mm'));

// K线图配置
const getKlineDefaultOptions = () => ({
	animation: false,
	tooltip: {
		trigger: 'axis',
		backgroundColor: '#ebeef5d9',
		axisPointer: { type: 'cross' },
		formatter: klineTooltip,
	},
	grid: { left: '8%', right: '15%', top: '3%', bottom: '4%', height: '90%' },
});

const getKlineSourceOptions = (chartData: any) => {
	const { seriesData, preClose, times } = chartData;
	const roundPreClose = Number(preClose.toFixed(2));
	const yAxisSeries = times.map((time: any, index: number) => [time, seriesData[index][1]]);
	return {
		xAxis: {
			data: times,
			axisTick: { show: false },
			splitLine: { show: false },
			axisLine: { show: false },
			axisLabel: {
				fontSize: 10,
				formatter: formatDate,
			},
		},
		yAxis: [
			{
				scale: true,
				axisLabel: {
					fontSize: 10,
					color: (val: any) => getFontColor(val, roundPreClose),
					formatter: (value: any) => customToFixed(value),
				},
			},
			{
				show: true,
				scale: true,
				alignTicks: true,
				position: 'right',
				axisLabel: {
					formatter: (value: any) => `${calculateRatio(value, preClose)}%`,
					fontSize: 10,
					color: (val: any) => getFontColor(val, roundPreClose),
				},
				axisPointer: {
					label: {
						show: true,
						formatter: (params: any) => `${calculateRatio(params.value, preClose)}%`,
					},
				},
			},
		],
		series: [
			{
				type: 'candlestick',
				data: seriesData,
				yAxisIndex: 0,
				itemStyle: {
					color: '#14b143',
					color0: '#ef232a',
					borderColor: '#14b143',
					borderColor0: '#ef232a',
				},
			},
			{
				type: 'line',
				data: yAxisSeries,
				show: false,
				yAxisIndex: 1,
				lineStyle: { color: 'transparent' },
				itemStyle: { color: 'transparent' },
				tooltip: { show: false },
				symbol: 'none',
			},
		],
	};
};

// 分钟图配置
const getMinuteDefaultOptions = () => ({
	animation: false,
	tooltip: {
		trigger: 'axis',
		axisPointer: { animation: false },
		formatter: minuteTooltip,
	},
	grid: {
		top: '15px',
		left: '1%',
		right: '3%',
		bottom: '2%',
		containLabel: true,
	},
});

const getMinuteSourceOptions = (chartData: any) => {
	const { seriesData, ratios, interval, maxPrice, minPrice, preClose, times, markLine } = chartData;
	const roundPreClose = Number(preClose.toFixed(2));
	return {
		xAxis: [
			{
				type: 'category',
				data: times,
				axisLabel: {
					show: true,
					color: '#494949',
					formatter: (value: any) => formatTime(value, times),
				},
				interval: Math.ceil(times.length / 12),
				axisTick: { show: false },
				splitLine: { show: false },
				axisLine: { show: false },
			},
		],
		yAxis: [
			{
				type: 'value',
				min: minPrice,
				max: maxPrice,
				interval: interval / 2,
				axisLabel: {
					fontSize: 10,
					color: (val: any) => getFontColor(val, roundPreClose),
					formatter: (value: any) => value.toFixed(2),
				},
			},
			{
				type: 'value',
				position: 'right',
				max: ratios,
				min: -ratios,
				interval: ratios / 2,
				alignTicks: true,
				splitLine: { show: false },
				axisLabel: {
					inside: true,
					formatter: (value: any) => `${value.toFixed(2)}%`,
					fontSize: 10,
					verticalAlign: 'bottom',
					color: (val: any) => (Number(val) === 0 ? '#333' : Number(val) > 0 ? 'green' : 'red'),
				},
				axisPointer: {
					label: { show: true, formatter: '{value}%' },
				},
			},
		],
		series: [
			{
				name: '价格',
				type: 'line',
				connectNulls: true,
				lineStyle: { width: 1 },
				data: seriesData,
				showSymbol: false,
				areaStyle: {
					color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#dfeaff' },
						{ offset: 1, color: '#e7efff' },
					]),
				},
				markLine: {
					symbol: 'none',
					data: markLine.map((separator: any) => ({
						xAxis: separator,
						lineStyle: {
							type: 'solid',
							color: 'rgba(128, 128, 128, 0.2)',
							width: 1,
						},
						label: { show: false },
					})),
				},
			},
		],
	};
};

// 工具函数
const klineTooltip = (params: any) => {
	const [_, open, close, low, high, ratio] = params[0].data;
	const openColor = getColor(open, close);
	const highColor = getColor(high, open);
	const lowColor = getColor(low, open);
	const closeColor = getColor(close, open);
	function getColor(value0: any, value1: any) {
		return value0 > value1 ? 'color: #00da3c;' : 'color: #ec0000;';
	}
	return `
        <div class='tooltips-content'>
            <div class='tips-item'><span>时间: </span><span>${formatDate(params[0].axisValue)}</span></div>
            <div class='tips-item'><span>开盘: </span><span style="${openColor}">${open}</span></div>
            <div class='tips-item'><span>收盘: </span><span style="${closeColor}">${close}</span></div>
            <div class='tips-item'><span>最高: </span><span style="${highColor}">${high}</span></div>
            <div class='tips-item'><span>最低: </span><span style="${lowColor}">${low}</span></div>
            <div class='tips-item'><span>涨跌幅: </span><span style="${getColor(ratio, 0)}">${ratio}%</span></div>
        </div>`;
};

const minuteTooltip = (params: any) => {
	return params
		.map(
			(param: any) => `
        时间：${param.axisValueLabel}<br>
        价格：${param.value[1]}<br>
        涨幅：<span style="color:${getColorForNumberSign(param.value[2])}">${param.value[2]}%</span>
    `
		)
		.join('<br>');
};

export function useMinuteChart(props: any) {
	const minuteOptions = reactive(getMinuteDefaultOptions());

	const fetchMinuteData = async () => {
		if (props.mode === 'kline') return;
		const data = await getSpiderData(props.mode, props.codeInfo);
		return [data];
	};

	const fetchFivedayData = async () => {
		if (props.mode === 'kline') return;
		const data = await getSpiderData('fiveday', props.codeInfo);
		return formatFivedayMinute(data);
	};

	const formatMinuteData = (allMinuteData: any[]) => {
		if (allMinuteData.length === 0) return {};
		const filteredData = allMinuteData.slice(-props.displayedDays);
		const daySeparators = allMinuteData.map((dayData: any) => dayData[0].time);
		const markLine = props.displayedDays === 1 ? [] : daySeparators.slice(-props.displayedDays).slice(1);
		return { data: filteredData, markLine };
	};

	const formatFivedayMinute = (marketData: string[]) => {
		if (!marketData) return [];
		// 创建一个对象用于按日期分组数据
		const groupedData: { [key: string]: { time: string; price: number }[] } = {};
		marketData.forEach((item: any) => {
			const [date] = item.time.split(' '); // 提取日期部分
			// 如果该日期还没有在groupedData中，初始化为一个空数组
			if (!groupedData[date]) {
				groupedData[date] = [];
			}
			// 将当前数据推入对应日期的数组中
			groupedData[date].push(item);
		});

		// 返回一个二维数组
		return Object.values(groupedData);
	};

	const getMinuteOptions = (minuteData: any, markLine: any) => {
		let chartData = minuteData.flat();
		if (chartData.length === 0) return {};

		const categoryData = generateTimeSeries([
			{ start: '09:00', end: '11:30' },
			{ start: '13:00', end: '15:00' },
		]);
		const minutePreClose = chartData[0].price;
		const seriesData = chartData.map((d: any) => [d.time, d.price, calculateRatio(d.price, minutePreClose)]);
		const ratios = seriesData.map((item: any) => item[2]);
		const price = chartData.map((item: any) => item.price);
		let times = chartData.map((item: any) => item.time);

		const indexToReplace = categoryData.findIndex((timeStr) => times[times.length - 1].includes(timeStr));
		if (indexToReplace !== -1) {
			categoryData.splice(0, indexToReplace - 1, ...times);
			times = categoryData;
		}

		const calcInterval = calculateInterval(minutePreClose, Math.min(...price), Math.max(...price));

		return {
			percentage: ratios[ratios.length - 1],
			options: getMinuteSourceOptions({
				seriesData,
				maxRatios: Math.max(...ratios),
				minRatios: Math.min(...ratios),
				preClose: minutePreClose,
				times,
				markLine,
				...calcInterval,
			}),
		};
	};
	return {
		minuteOptions,
		fetchFivedayData,
		fetchMinuteData,
		formatMinuteData,
		getMinuteOptions,
	};
}

export function useKlineChart(props: any) {
	const kLineOptions = reactive(getKlineDefaultOptions());

	const fetchKlineData = async () => {
		if (props.mode === 'minute') return;
		return await getSpiderData(props.mode, props.codeInfo);
	};

	const getKlineOptions = (allDayData: any[]) => {
		const lines = allDayData.slice(-props.klineRange);
		const categoryData = lines.map((item) => item.time);
		const values = lines.map((item) => [item.open, item.close, item.low, item.high, calculateRatio(parseFloat(item.close), parseFloat(item.open))]);
		const dayPreClose = values[0][1];
		const ratioLines = categoryData.map((time, index) => [time, values[index][2]]);
		return {
			percentage: calculateRatio(values[values.length - 1][1], dayPreClose),
			options: getKlineSourceOptions({
				seriesData: values,
				preClose: dayPreClose,
				times: categoryData,
			}),
			ratioLines,
		};
	};

	return {
		kLineOptions,
		fetchKlineData,
		getKlineOptions,
	};
}
