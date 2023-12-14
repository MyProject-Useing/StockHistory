<template>
	<div class="select-none">
		<img :src="bg" class="wave" />
		<div class="login-container">
			<div class="login-box">
				<div class="login-form">
					<div class="login-title">{{ getThemeConfig.globalTitle }}</div>
					<Password @signInSuccess="signInSuccess" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
// 背景图
import bg from '/@/assets/login/bg.jpg';

import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const router = useRouter();

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

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
