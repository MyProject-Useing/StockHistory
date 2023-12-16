<template>
	<div class="chart-container">
		<el-autocomplete v-model="selectedStock" :fetch-suggestions="querySearchAsync" placeholder="请输入股票代码或名称" @select="handleSelect">
			<template #default="{ item }">
				<div class="value">{{ item.value }} {{ item.link }}</div>
			</template>
		</el-autocomplete>
		<div class="chart">
			<!-- 在这里展示股票名称 -->
			<div id="kline-chart"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { getHistoryByCode, fetchData } from '/@/api/admin/history';
import { getOptions } from './hooks';
import { ElLoading } from 'element-plus';

interface LinkItem {
	value: string;
	link: string;
}

// 定义基础属性
const selectedStock = ref<string>('000029'); // 存储用户选择的股票

// 在 data 中添加股票名称变量
const stockName = ref<string>('深深房A'); // 初始化为空字符串

const getChartData = async (symbol = '000001.sz') => {
	const loadingInstance1 = ElLoading.service({ fullscreen: true });
	getHistoryByCode({
		symbol,
		start_date: '2003-11-11', //'1986-00-00',
		end_date: dayjs(new Date()).format('YYYY-MM-DD'),
	})
		.then((res: any) => {
			const data = (res.history || []).reverse();
			loadingInstance1.close();
			createKLineChart(data);
		})
		.catch(() => {
			loadingInstance1.close();
			createKLineChart([]);
		});
};

// 创建Chart
const createKLineChart = (data: any[]) => {
	const myChart = echarts.init(document.getElementById('kline-chart') as HTMLDivElement, null, {
		renderer: 'canvas',
		useDirtyRect: false,
	});
	myChart.setOption(getOptions(data, stockName.value), true);
};

const getListByCode = async (): Promise<LinkItem[]> => {
	try {
		const rawData = await fetchData();
		const processedData: LinkItem[] = rawData.reduce((acc: LinkItem[], group: any) => {
			const groupData = group.data.map((item: any) => ({
				value: item.agdm,
				link: item.agjc.replace(/<[^>]*>/g, ''), // 去除HTML标签
			}));
			return [...acc, ...groupData];
		}, []);
		return processedData;
	} catch (error) {
		console.error('Error fetching data:', error);
		return [];
	}
};

const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
	try {
		const results = queryString ? (await getListByCode()).filter(createFilter(queryString)) : [];
		cb(results);
	} catch (error) {
		console.error('Error querying data:', error);
	}
};

const createFilter = (queryString: string) => {
	return (item: LinkItem) => {
		return item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
	};
};

const handleSelect = (item: LinkItem) => {
	selectedStock.value = item.value;
	const tsCode = convertToTsCode(selectedStock.value);
	stockName.value = item.link; // 获取股票名称
	if (tsCode) {
		getChartData(tsCode.toLowerCase()); // 小写转换
	}
};

const convertToTsCode = (inputCode: string): string | null => {
	const codeWithoutSuffix = inputCode.toUpperCase();

	// 如果股票代码已经包含后缀，直接返回
	if (codeWithoutSuffix.endsWith('.SH') || codeWithoutSuffix.endsWith('.SZ') || codeWithoutSuffix.endsWith('.HK')) {
		return codeWithoutSuffix;
	}

	// 根据输入的股票代码添加对应的后缀
	if (codeWithoutSuffix.startsWith('6') || codeWithoutSuffix.startsWith('9')) {
		return `${codeWithoutSuffix}.SH`; // 上海证券交易所
	} else if (codeWithoutSuffix.startsWith('0') || codeWithoutSuffix.startsWith('3')) {
		return `${codeWithoutSuffix}.SZ`; // 深圳证券交易所
	} else if (codeWithoutSuffix.startsWith('8') || codeWithoutSuffix.startsWith('4')) {
		return `${codeWithoutSuffix}.BJ`; // 北京证券交易所
	} else if (codeWithoutSuffix.startsWith('00')) {
		return `${codeWithoutSuffix}.HK`; // 香港证券交易所
	}

	return null; // 无法识别的股票代码格式
};

onMounted(() => {
	getChartData(convertToTsCode(selectedStock.value) as string);
});
</script>

<style scoped lang="scss">
.chart-container {
	height: 100%;
	width: 100%;
	.chart {
		height: auto;
		width: 100%;
	}
}

#kline-chart {
	height: 100vh;
	width: 100%;
}
</style>

<style lang="scss">
.tooltips-content {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	.tips-item {
		margin-right: 8px;
	}
}
</style>
