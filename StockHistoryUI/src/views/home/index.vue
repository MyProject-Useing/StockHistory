<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view"><MainCharts></MainCharts></div>
	</div>
</template>

<script setup lang="ts" name="home">
// 引入组件
const MainCharts = defineAsyncComponent(() => import('./charts.vue'));
</script>
