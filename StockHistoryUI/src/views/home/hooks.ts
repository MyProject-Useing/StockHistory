import dayjs from 'dayjs';

const UP_COLOR = '#22ab94';
const DOWN_COLOR = '#c00c00';

interface StockData {
	amount: number; // 成交量
	change: number; // 表示股票价格从前一收盘价到当前收盘价的变化。
	close: number; // 收盘价
	high: number; // 最高价
	low: number; // 最低价
	open: number; // 开盘价
	pct_chg: number; // 表示股票价格从前一收盘价到当前收盘价的百分比变化。
	pre_close: number; // 代表股票在前一个交易周期的收盘价。
	trade_date: string; // 交易日期
	ts_code: string; // 股票代码
	vol: number; // 交易量
	[key: string]: any; // Additional properties
}

// 拆分数据
const splitData = (rawData: StockData[]) => {
	const categoryData: string[] = [];
	const values: [number, number, number, number][] = [];
	const volumes: [number, number, number][] = [];
	for (let i = 0; i < rawData.length; i++) {
		const { trade_date, open, close, low, high, vol } = rawData[i];
		categoryData.push(trade_date);
		values.push([open, close, low, high]);
		volumes.push([i, Math.abs(vol), open > close ? 1 : -1]);
	}

	return {
		categoryData,
		values,
		volumes,
	};
};
const getStartNumber = (dataLength: number = 1000) => {
	if (dataLength > 5000) {
		return 98;
	}

	if (dataLength > 4000) {
		return 96;
	}

	if (dataLength > 3000) {
		return 90;
	}

	if (dataLength > 2000) {
		return 74;
	}

	return 60;
};
// 获取提示框内容
const getTipsFormat = (currentData: StockData) => {
	const getColor = (value: number, comparisonValue: number) => (value > comparisonValue ? UP_COLOR : DOWN_COLOR);
	const riseFallAmount = currentData.close - currentData.pre_close;
	const riseFallPercentage = ((riseFallAmount / currentData.pre_close) * 100).toFixed(2);
	const tooltipContent = `<div class="tooltips-content">
			<div class="tips-item">${dayjs(currentData.trade_date).format('YYYYMMDD')}</div>
			<div class="tips-item">
				<span>开: </span>
				<span style="color: ${getColor(currentData.open, currentData.pre_close)}">${currentData.open}</span>
			</div>
			<div class="tips-item">
				<span>高: </span>
				<span style="color: ${getColor(currentData.high, currentData.open)}">${currentData.high}</span>
			</div>
			<div class="tips-item">
				<span>低: </span>
				<span style="color: ${getColor(currentData.low, currentData.open)}">${currentData.low}</span>
			</div>
			<div class="tips-item">
				<span>收: </span>
				<span style="color: ${getColor(currentData.close, currentData.open)};">${currentData.close}</span>
			</div>
			<div class="tips-item">
				<span>涨跌: </span>
				<span style="color: ${riseFallAmount >= 0 ? UP_COLOR : DOWN_COLOR};">${riseFallAmount.toFixed(2)}</span>
			</div>
			<div class="tips-item">
				<span>涨幅: </span>
				<span style="color: ${riseFallAmount >= 0 ? UP_COLOR : DOWN_COLOR};">${riseFallPercentage}%</span>
			</div>
		</div>`;

	return tooltipContent;
};

export const getOptions = (rawData: any[], title = '') => {
	const formatRow = rawData.map((item) => {
		return {
			...item,
			trade_date: dayjs(item.trade_date).format('YYYY-MM-DD'),
		};
	});
	const data = splitData(formatRow);
	const option = {
		title: {
			text: title, // 设置标题文本
			left: 'center', // 标题居中显示
		},
		backgroundColor: 'transparent', // 将背景色设置为透明
		animation: false,
		legend: {
			right: '5%', // 调整右侧距离
			top: 0,
			data: ['5日线', '10日线', '20日线', '30日线'],
		},
		tooltip: {
			show: true, // 设置为显示
			trigger: 'axis',
			padding: 4,
			className: 'echarts-tooltip',
			axisPointer: {
				type: 'cross',
			},
			alwaysShowContent: true,
			position: ['1%', 28], // 固定在左上角
			formatter: function (params: any) {
				const dataIndex = params[0].dataIndex;
				const currentData = formatRow[dataIndex];
				return getTipsFormat(currentData);
			},
		},
		axisPointer: {
			link: [{ xAxisIndex: 'all' }],
			label: {
				backgroundColor: '#6a7985',
			},
			triggerTooltip: true,
		},
		visualMap: {
			show: false,
			seriesIndex: 1, // 针对成交量部分
			dimension: 2, // 控制蜡烛图的涨跌状态
			pieces: [
				{
					value: 1,
					color: DOWN_COLOR, // 下跌时的颜色
					colorAlpha: 0.4, // 设置颜色的透明度为 0.6，虚化效果
				},
				{
					value: -1,
					color: UP_COLOR, // 上涨时的颜色
					colorAlpha: 0.4, // 设置颜色的透明度为 0.6，虚化效果
				},
			],
		},
		grid: [
			{
				left: '1%',
				right: '5%',
				height: '70%',
				borderColor: 'transparent', // 网格线颜色淡灰色
				show: true,
			},
			{
				left: '1%',
				right: '5%',
				top: '77%',
				height: '20%',
				borderColor: 'transparent',
			},
		],
		xAxis: [
			{
				type: 'category',
				data: data.categoryData,
				boundaryGap: false,
				axisLine: { onZero: false, lineStyle: { color: 'transparent' } },
				splitLine: { show: true },
				axisLabel: { show: false },
				axisTick: { show: false },
				min: 'dataMin',
				max: 'dataMax',
			},
			{
				type: 'category',
				gridIndex: 1,
				data: data.categoryData,
				boundaryGap: false,
				splitLine: { show: true },
				axisLabel: {
					interval: 'auto',
					textStyle: {
						fontSize: 12, // 调整字体大小
						color: '#666', // 调整字体颜色
					},
				},
				min: 'dataMin',
				max: 'dataMax',
			},
		],
		yAxis: [
			{
				scale: true,
				// 调整位置为右侧
				position: 'right',
				axisPointer: {
					label: {
						backgroundColor: '#f56c6c',
					},
				},
				axisLabel: {
					// 使用formatter强制显示小数
					formatter: function (value: any) {
						return value.toFixed(2);
					},
				},
			},
			{
				scale: true,
				gridIndex: 1,
				splitNumber: 2,
				axisLabel: { show: false },
				axisTick: { show: false },
				splitLine: { show: true },
			},
		],
		dataZoom: [
			{
				type: 'inside',
				xAxisIndex: [0, 1],
				start: getStartNumber(data.values.length),
				end: 100,
			},
			{
				show: false,
				xAxisIndex: [0, 1],
				type: 'slider',
				top: '85%',
				start: 98,
				end: 100,
			},
		],
		series: [
			{
				name: '日K',
				type: 'candlestick',
				data: data.values,
				yAxisIndex: 0, // 设置y轴为第一个y轴
				itemStyle: {
					color: UP_COLOR, // 上涨蜡烛的填充色
					color0: DOWN_COLOR, // 下跌蜡烛的填充色
					borderColor: UP_COLOR, // 上涨蜡烛的边框色
					borderColor0: DOWN_COLOR, // 下跌蜡烛的边框色
					borderColorDoji: '#000', //十字星边框色（即开盘价等于收盘价时候的边框色）
				},
			},
			{
				name: '成交量',
				type: 'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: data.volumes,
			},
		],
	};
	return option;
};
