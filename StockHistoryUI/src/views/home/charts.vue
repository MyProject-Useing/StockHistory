<template>
	<div>
		<el-select v-model="selectedStock" placeholder="请选择股票" size="large" @change="selectChange">
			<el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
		</el-select>

		<div class="chart-container">
			<div id="kline-chart" style="height: 100vh"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { getHistoryByCode, fetchList } from '/@/api/admin/history';
import { getOptions } from './hooks';

// 定义基础属性
const selectedStock = ref<string>();
const list = ref<SelectOptionType[]>([]);

const getChartData = async (symbol = '000001.sz') => {
	getHistoryByCode({
		symbol,
		start_date: '2019-01-01',
		end_date: '2020-02-13',
	})
		.then((res: any) => {
			createKLineChart(res.history);
		})
		.catch(() => {
			createKLineChart([]);
		});
};

// 创建Chart
const createKLineChart = (data: any[]) => {
	const myChart = echarts.init(document.getElementById('kline-chart') as HTMLDivElement, null, {
		renderer: 'canvas',
		useDirtyRect: false,
	});
	myChart.setOption(getOptions(data), true);
};

const selectChange = (val: any) => {
	getChartData(val);
};

onMounted(() => {
	// getChartData();
	fetchList().then((res) => {
		list.value = (res || []).map((item: any) => {
			return {
				label: item.name,
				value: item.symbol,
			};
		});
		selectedStock.value = list.value[0]?.value as string;
		getChartData(selectedStock.value);
	});
});
</script>

<style>
#kline-chart {
	width: 100%;
}
</style>
