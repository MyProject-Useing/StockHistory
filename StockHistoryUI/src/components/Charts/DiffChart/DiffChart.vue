<template>
	<a-spin :spinning="spinning">
		<div class="title">{{ product }}</div>
		<ChatLine ref="forwardsChartRef" height="300px" :key="chartKey" :options="mainOptions"></ChatLine>
		<ChatLine v-for="item in otherOptions" :key="item.name" :options="item.options" ref="otherChartRef" height="130px"></ChatLine>
	</a-spin>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeMount, nextTick } from 'vue';
import { get_positions, get_total_positions } from '/@/api/surfaceMap';
import { queryTable } from '/@/api/commonSql';
import { initPositionsOptions, initDefaultOptions } from './chartOptions';
import ChatLine from '/@/components/Charts/Line.vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

export default defineComponent({
	name: 'DiffChart',
	components: { ChatLine },
	props: {
		product: { type: String, default: '' },
		expire: { type: String, default: '' },
	},
	setup(props) {
		const { product, expire } = props;
		const spinning = ref(false);
		const mainOptions = reactive<AnyObject>(initPositionsOptions());
		const forwardsChartRef = ref();
		const otherChartRef = ref();
		const otherOptions = ref<AnyArray>([]);
		const chartKey = ref(`${product}-${expire}`);

		const mainKeys = ['positions', 'forwards'];

		const fetchData = async () => {
			spinning.value = true;
			try {
				const [trendList, spots] = await Promise.all([fetchPositions(), fetchSpots()]);

				if (trendList) {
					const mergedX = mergeXData(Object.values(trendList));
					updateMainChartOptions(mergedX, trendList.positions, trendList.forwards, spots);
					buildOtherChartOptions(trendList, mergedX, spots);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				spinning.value = false;
			}
		};

		const fetchPositions = () => {
			return expire !== 'Sum' ? get_positions(product, expire) : get_total_positions(product);
		};

		const fetchSpots = async () => {
			try {
				const result = await queryTable('marketdata.dayinfo_spots', { where: `where product ='${product}'` });
				return formatData(result);
			} catch (error) {
				console.error('Error fetching spots:', error);
				return [];
			}
		};

		const formatData = (data: any[]) => {
			return data.map((item: any) => [dayjs(item.date).format('YYYY-MM-DD'), Number(item.price)]);
		};

		const mergeXData = (dataSets: any[]): string[] => {
			const oneYearAgo = dayjs().subtract(1, 'year');
			const xSet = new Set(
				dataSets
					.flat()
					.map(([date]) => (dayjs(date).isAfter(oneYearAgo) ? date : null))
					.filter(Boolean)
			);
			return Array.from(xSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
		};

		const updateMainChartOptions = (mergedX: any[], positions: any[], forwards: any[], spots: any[]) => {
			const alignedData = alignMultipleData(mergedX, [positions, forwards, spots]);
			mainOptions.series.forEach((series: any, index: number) => (series.data = alignedData[index]));

			const { min, max } = getMinMax(positions);
			mainOptions.xAxis.data = mergedX;
			mainOptions.yAxis[0].min = min;
			mainOptions.yAxis[0].max = max;
		};

		const alignMultipleData = (mergedX: string[], dataSets: any[][]) => {
			return dataSets.map((data) => alignData(mergedX, data));
		};

		const alignData = (mergedX: string[], data: [string, number][]) => {
			const dataMap = new Map(data);
			return mergedX.map((date) => [date, dataMap.get(date) ?? NaN]);
		};

		const getMinMax = (data: [string, number][], isAbs = true) => {
			const values = data.map(([, value]) => value);
			const min = Math.min(...values);
			const max = Math.max(...values);
			return { min, max: isAbs ? Math.max(max, Math.abs(min)) : max };
		};

		const buildOtherChartOptions = (trendList: any, mergedX: any[], spots: any[]) => {
			const colors = ['rgba(234,76,137,1)', 'rgb(57, 0, 166)', 'rgb(0, 179, 204)'];
			const options = Object.keys(trendList)
				.filter((key) => !mainKeys.includes(key))
				.map((key, index) => createOtherChartOption(key, trendList, mergedX, spots, colors[index]));

			otherOptions.value = sortOtherOptions(options);
		};

		const createOtherChartOption = (key: string, trendList: any, mergedX: any[], spots: any[], color: string) => {
			let trendData = trendList[key];
			trendData = trendData.map(([date, value]: any) => [date, formatNumber(value)]);
			const options: AnyObject = initDefaultOptions(key, mergedX, trendData, color);
			const { min, max } = getMinMax(trendData, false);
			options.yAxis[0].min = min;
			options.yAxis[0].max = max;
			// 如果当前图表是 'rollts'，则添加 basis 线
			if (key === 'rollts') {
				const basisOptions = createBasisOptions(mergedX, spots, trendList['forwards']);
				options.series.push(basisOptions);
				options.yAxis[1].name = 'basis';
			}

			return { name: key, options };
		};

		const createBasisOptions = (mergedX: any[], spots: any[], forwards: any[]) => {
			const alignedSpots = alignData(mergedX, spots);
			const alignedForwards = alignData(mergedX, forwards);
			const basisData = alignedSpots
				.map((spotItem: any, i: number) => {
					const forwardItem: any[] = alignedForwards[i];
					// 判断日期是否相同并且确保两个值都不为空
					if (
						spotItem[0] === forwardItem[0] && // 日期相同
						spotItem[1] !== null &&
						!isNaN(spotItem[1]) && // spots 值不为空
						forwardItem[1] !== null &&
						!isNaN(forwardItem[1]) // forwards 值不为空
					) {
						return [spotItem[0], forwardItem[1] - spotItem[1]];
					}
					return null;
				})
				.filter((item) => item !== null); // 过滤掉 null 数据

			return {
				name: 'basis',
				type: 'line',
				yAxisIndex: 1,
				data: basisData,
				symbol: 'none',
				itemStyle: {
					color: 'rgb(255,27,0)',
					lineStyle: { width: 1.5 },
				},
			};
		};

		const sortOtherOptions = (options: any[]) => {
			return options.sort((a, b) => (a.name === 'rollts' ? 1 : b.name === 'rollts' ? -1 : 0));
		};

		const formatNumber = (value: string) => {
			return value == 'NaN' ? null : value;
		};

		const connectCharts = () => {
			const forwardsChart = echarts.getInstanceByDom(forwardsChartRef.value?.chartRef);
			const otherCharts = otherChartRef.value.map((ref: any) => echarts.getInstanceByDom(ref?.chartRef));
			if (forwardsChart && otherCharts.length) {
				echarts.connect([forwardsChart, ...otherCharts]);
				otherCharts.forEach((otherChart: any) => setupTooltipSync(forwardsChart, otherChart));
			}
		};

		const setupTooltipSync = (chart1: echarts.ECharts, chart2: echarts.ECharts) => {
			const syncTooltip = (source: echarts.ECharts, target: echarts.ECharts, event: echarts.ECElementEvent) => {
				const pointInPixel = [event.offsetX, event.offsetY];
				if (target.containPixel('grid', pointInPixel)) {
					const xValue = target.convertFromPixel({ xAxisIndex: 0 }, pointInPixel)[0];
					target.dispatchAction({ type: 'showTip', x: xValue });
				}
			};

			chart1.on('mousemove', (params: any) => syncTooltip(chart1, chart2, params.event));
			chart2.on('mousemove', (params: any) => syncTooltip(chart2, chart1, params.event));
			chart1.on('globalout', () => chart2.dispatchAction({ type: 'hideTip' }));
			chart2.on('globalout', () => chart1.dispatchAction({ type: 'hideTip' }));
		};

		onBeforeMount(async () => {
			await fetchData();
			setTimeout(() => {
				nextTick(connectCharts);
			}, 300);
		});

		return { spinning, mainOptions, otherOptions, forwardsChartRef, otherChartRef, chartKey };
	},
});
</script>

<style lang="scss" scoped>
.ant-spin-nested-loading {
	min-height: 500px;
}

.ant-spin-container {
	height: auto;
}

.title {
	text-align: center;
	font-size: 16px;
	font-weight: bolder;
}
</style>
