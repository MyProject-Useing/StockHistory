<template>
	<div class="container">
		<el-select v-model="selectedStock" placeholder="请选择股票" size="large" @change="selectChange">
			<el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
		</el-select>

		<div class="chart-container">
			<div id="kline-chart"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { getHistoryByCode, fetchList } from '/@/api/admin/history';
import { getOptions } from './hooks';
import { ElLoading } from 'element-plus';

// 定义基础属性
const selectedStock = ref<string>();
const list = ref<SelectOptionType[]>([]);
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
	myChart.setOption(getOptions(data), true);
};

const selectChange = (val: any) => {
	getChartData(val);
};

onMounted(() => {
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

<style scoped lang="scss">
.container {
	height: 100%;
	width: 100%;
	.chart-container {
		height: 100%;
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
