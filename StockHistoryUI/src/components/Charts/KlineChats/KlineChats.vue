<template>
	<div class="container">
		<a-spin :spinning="spinning"></a-spin>
		<template v-if="!spinning">
			<div class="stock-title">
				<a-button type="link" class="mr5" @click="onRedirect"
					>{{ codeInfo.name }} ({{ sourceType[codeInfo.type] }}-{{ codeInfo.market_type }})</a-button
				>
				<span :style="{ color: getColorForNumberSign(changePercentage) }">{{ changePercentage }}%</span>
				<span class="ml16 correlation" v-show="!isMain && mode === 'kline'">
					相似度: <span :style="{ color: getColorForNumberSign(correlation) }">{{ correlation }}</span>
				</span>
			</div>
			<Line v-show="mode === 'minute'" :height="height" :width="width" :options="minuteOptions"></Line>
			<Line v-show="mode === 'kline'" :height="height" :width="width" :options="kLineOptions"></Line>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import Line from '/@/components/Charts/Line.vue';
import { getColorForNumberSign } from '/@/utils/styleUtils';
import { useStockData } from '/@/stores/stockData';
import { useMinuteChart, useKlineChart } from './useCharts';
import { calculateRatio } from '/@/utils/chatUtils';

import dayjs from 'dayjs';

export default defineComponent({
	name: 'KlineChats',
	components: { Line },
	props: {
		mode: { type: String, required: true },
		codeInfo: { type: Object, required: true },
		height: { type: String, default: '100%' },
		width: { type: String, default: '100%' },
		klineRange: { type: Number, default: 30 },
		displayedDays: { type: Number, default: 1 },
		isMain: { type: Boolean, default: false },
	},
	setup(props) {
		const sourceType = {
			XL: '新浪',
			GST: '股市通',
			DFCF: '东财',
		};

		const { minuteOptions, formatMinuteData, fetchFivedayData, fetchMinuteData, getMinuteOptions } = useMinuteChart(props);
		const { kLineOptions, getKlineOptions, fetchKlineData } = useKlineChart(props);

		const changePercentage = ref(0);
		const title = ref('');
		const spinning = ref(false);
		const correlation = ref(0);
		const stockStores = useStockData();

		const allMinuteData = ref<any[]>([]);
		const allDayData = ref<any[]>([]);

		const updateChart = () => {
			spinning.value = true;
			if (props.mode === 'minute') {
				fetchMinuteData()
					.then((res: any) => {
						allMinuteData.value = res;
						updateMinuteChart();
						fetchFivedayData()
							.then((res: any) => {
								allMinuteData.value.unshift(...res.slice(0, res.length - 1));
							})
							.catch(() => {});
					})
					.catch(() => {});
			} else {
				fetchKlineData()
					.then((res) => {
						if (res.length == 0) return false;
						allDayData.value = res;
						appendTodayKline(res);
						updateKilneChart();
					})
					.catch(() => {});
			}
			spinning.value = false;
		};

		const updateKilneChart = () => {
			const { percentage, options, ratioLines } = getKlineOptions(allDayData.value);
			changePercentage.value = percentage;
			Object.assign(kLineOptions, options);

			if (props.isMain) {
				stockStores.setDayLine(ratioLines);
			} else {
				setTimeout(async () => {
					correlation.value = await stockStores.computeCorrelation('kline', ratioLines);
				}, 1000);
			}
		};

		const updateMinuteChart = () => {
			if (allMinuteData.value.length == 0) return false;
			const { data, markLine } = formatMinuteData(allMinuteData.value);
			const { percentage, options } = getMinuteOptions(data, markLine);
			changePercentage.value = percentage;
			Object.assign(minuteOptions, options);
		};

		const appendTodayKline = (dayData: any[]) => {
			const todayStr = dayjs().format('YYYY-MM-DD');
			let todayDataExists = dayData.some((data) => data.time.includes(todayStr));
			if (!todayDataExists && allMinuteData.value.length > 0) {
				const todayMinuteData = allMinuteData.value[allMinuteData.value.length - 1];
				const open = todayMinuteData[0].price; // First price value
				const close = todayMinuteData[todayMinuteData.length - 1].price; // Last price value
				const low = Math.min(...todayMinuteData.map((data: any) => data.price)); // Minimum price value
				const high = Math.max(...todayMinuteData.map((data: any) => data.price)); // Maximum price value
				// Assuming the last entry is today's data
				const todayKlineData = {
					time: todayStr, // Today’s date
					open,
					close,
					low,
					high,
					ratios: calculateRatio(parseFloat(close), parseFloat(open)),
				};
				// Append today’s kline data to allDayData
				allDayData.value.push(todayKlineData);
			}
		};

		const onRedirect = () => {
			const { code, type, exchange, market_type } = props.codeInfo;
			const isStock = exchange.toUpperCase() !== 'FT';

			let url = '';
			if (type == 'XL') {
				if (isStock) {
					url =
						market_type == 'hk'
							? `https://stock.finance.sina.com.cn/hkstock/quotes/${code}.html`
							: `https://finance.sina.com.cn/realstock/company/${code}/nc.shtml`;
				} else {
					url = `https://finance.sina.com.cn/futures/quotes/${code.toLocaleUpperCase()}.shtml`;
				}
			} else if (type == 'GST') {
				const type = exchange === 'FT' ? 'futures' : exchange === 'BK' ? 'block' : 'stock';
				url = `https://gushitong.baidu.com/${type}/${market_type}-${code}`;
			} else if (type == 'DFCF') {
				url = `https://quote.eastmoney.com/unify/r/${code.replace('/center/boardlist.html#boards2-', '')}`;
			}
			window.open(url);
		};

		onMounted(() => updateChart());
		watch(
			() => props.mode,
			() => updateChart()
		);
		watch(
			() => props.displayedDays,
			() => props.mode !== 'kline' && updateMinuteChart()
		);
		watch(
			() => props.klineRange,
			() => props.mode === 'kline' && updateChart()
		);

		return {
			minuteOptions,
			kLineOptions,
			title,
			spinning,
			correlation,
			sourceType,
			changePercentage,

			getColorForNumberSign,
			onRedirect,
		};
	},
});
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;
}

.ant-spin {
	height: 100%;
	width: 100%;
	:deep(.ant-spin-dot) {
		margin: 25%;
	}
}

.stock-title {
	font-size: 14px;
	color: black;
	text-align: center;
	.ant-btn-link {
		padding: 0px;
	}
}
.ant-empty {
	margin-top: 50px;
}

.correlation {
	font-size: 14px;
	color: #3c3b3b;
}
</style>
