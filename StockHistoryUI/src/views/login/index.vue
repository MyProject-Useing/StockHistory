<template>
	<div class="login-container">
		<!-- <img :src="bg" class="backgroud-image" /> -->
		<Password @signInSuccess="signInSuccess" />
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { NextLoading } from '/@/utils/loading';
// 背景图
// import bg from '/@/assets/login/bg.jpeg';

import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));

const router = useRouter();

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	// 初始化登录成功时间问候语
	let currentTimeInfo = formatAxis(new Date());
	router.push('/');
	// 登录成功提示
	useMessage().success(`${currentTimeInfo}，欢迎回来`);
	// 添加 loading，防止第一次进入界面时出现短暂空白
	NextLoading.start();
};

// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>

<style scoped lang="scss">
.login-container {
	height: 100%;
	width: 100%;
	background: linear-gradient(#141e30, #243b55);
}
.backgroud-image {
	width: 100%;
	height: 100%;
}
</style>
