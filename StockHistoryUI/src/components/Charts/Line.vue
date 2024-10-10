<template>
	<div ref="chartRef" :id="chartId" :style="{ height, width }"></div>
</template>

<script lang="ts" name="chatline">
import { defineComponent, onMounted, PropType, ref, Ref, watch } from 'vue';
import { useECharts } from '/@/hooks/web/useECharts';
export default defineComponent({
	name: 'single-line',
	props: {
		options: {
			type: Object,
			default: () => ({}),
		},
		width: {
			type: String as PropType<string>,
			default: '100%',
		},
		height: {
			type: String as PropType<string>,
			default: 'calc(100vh - 78px)',
		},
	},
	setup(props) {
		const chartId = `echarts_id_` + Date.now() + Math.random();
		const chartRef = ref<HTMLDivElement | null>(null);
		const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

		function initCharts() {
			setOptions(props.options);
		}

		watch(
			() => props.options,
			(val) => {
				initCharts();
			},
			{ deep: true }
		);

		onMounted(() => {
			initCharts();
		});

		return { chartRef, chartId };
	},
});
</script>
