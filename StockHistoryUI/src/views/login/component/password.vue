<template>
	<el-form size="large" class="login-box" ref="loginFormRef" :rules="loginRules" :model="state.ruleForm" @keyup.enter="onSignIn">
		<h2 class="login-title"><img :src="logo" /> {{ getThemeConfig.globalTitle }}</h2>
		<el-form-item class="user-box" prop="username">
			<el-input text placeholder="请输入用户名" v-model="state.ruleForm.username" clearable autocomplete="off"> </el-input>
		</el-form-item>
		<el-form-item class="user-box" prop="password">
			<el-input :type="state.isShowPassword ? 'text' : 'password'" placeholder="请输入密码" v-model="state.ruleForm.password" autocomplete="off">
			</el-input>
		</el-form-item>
		<div class="login-animation4">
			<a href="#">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				登录
			</a>
			<!-- <el-button text class="login-content-submit" :loading="loading" @click="onSignIn">
				<span>登 录</span>
			</el-button> -->
		</div>
	</el-form>
</template>

<script setup lang="ts" name="password">
import { reactive, ref, defineEmits } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import logo from '/@/assets/logo.jpg';

// 定义变量内容
const emit = defineEmits(['signInSuccess']); // 声明事件名称
const loginFormRef = ref(); // 定义LoginForm表单引用
const loading = ref(false); // 定义是否正在登录中
const state = reactive({
	isShowPassword: false, // 是否显示密码
	ruleForm: {
		// 表单数据
		username: 'admin', // 用户名
		password: '123456', // 密码
		code: '', // 验证码
		randomStr: '', // 验证码随机数
	},
});

const loginRules = reactive({
	username: [{ required: true, trigger: 'blur', message: '请输入用户名' }], // 用户名校验规则
	password: [{ required: true, trigger: 'blur', message: '请输入密码' }], // 密码校验规则
});

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 账号密码登录
const onSignIn = async () => {
	const valid = await loginFormRef.value.validate().catch(() => {}); // 表单校验
	if (!valid) return false;

	loading.value = true; // 正在登录中
	try {
		await useUserInfo().login(state.ruleForm); // 调用登录方法
		emit('signInSuccess'); // 触发事件
	} finally {
		loading.value = false; // 登录结束
	}
};
</script>

<style lang="scss" scoped>
.login-box {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 400px;
	padding: 40px;
	transform: translate(-50%, -50%);
	background: rgba(0, 0, 0, 0.5);
	box-sizing: border-box;
	box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
	border-radius: 10px;

	.login-title {
		margin: 0 0 30px;
		padding: 0;
		color: #fff;
		justify-content: center;
		font-size: 23px;
		display: flex;
		align-items: center;
		img {
			width: 33px;
			height: 31px;
			margin-right: 8px;
		}
	}
	.user-box {
		position: relative;
		:deep(.el-input__wrapper) {
			background: none;
			box-shadow: none;
			border-bottom: 1px solid #fff;
			border-radius: 0;
			padding: 0px;
			input {
				width: 100%;
				font-size: 16px;
				color: #fff;
				&:focus ~ label,
				&:valid ~ label {
					top: -20px;
					left: 0;
					color: #03e9f4;
					font-size: 12px;
				}
			}

			input.el-input__inner:-webkit-autofill {
				background-color: transparent !important;
			}
		}

		label {
			position: absolute;
			top: 0;
			left: 0;
			padding: 10px 0;
			font-size: 16px;
			color: #fff;
			pointer-events: none;
			transition: 0.5s;
		}
	}
	.login-animation4 {
		text-align: center;
		margin-top: 52px;
		a {
			position: relative;
			display: inline-block;
			padding: 10px 20px;
			color: #03e9f4;
			font-size: 16px;
			text-decoration: none;
			text-transform: uppercase;
			overflow: hidden;
			transition: 0.5s;
			letter-spacing: 4px;
		}

		a:hover {
			background: #03e9f4;
			color: #fff;
			border-radius: 5px;
			box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
		}

		a span {
			position: absolute;
			display: block;
		}

		a span:nth-child(1) {
			top: 0;
			left: -100%;
			width: 100%;
			height: 2px;
			background: linear-gradient(90deg, transparent, #03e9f4);
			animation: btn-anim1 1s linear infinite;
		}

		a span:nth-child(2) {
			top: -100%;
			right: 0;
			width: 2px;
			height: 100%;
			background: linear-gradient(180deg, transparent, #03e9f4);
			animation: btn-anim2 1s linear infinite;
			animation-delay: 0.25s;
		}

		a span:nth-child(3) {
			bottom: 0;
			right: -100%;
			width: 100%;
			height: 2px;
			background: linear-gradient(270deg, transparent, #03e9f4);
			animation: btn-anim3 1s linear infinite;
			animation-delay: 0.5s;
		}

		a span:nth-child(4) {
			bottom: -100%;
			left: 0;
			width: 2px;
			height: 100%;
			background: linear-gradient(360deg, transparent, #03e9f4);
			animation: btn-anim4 1s linear infinite;
			animation-delay: 0.75s;
		}

		// :deep(.el-form-item__content) {
		// 	justify-content: flex-end;
		// }
		// .login-content-submit {
		// 	padding: 0px 29px;
		// }
	}
}

@keyframes btn-anim1 {
	0% {
		left: -100%;
	}
	50%,
	100% {
		left: 100%;
	}
}

@keyframes btn-anim2 {
	0% {
		top: -100%;
	}
	50%,
	100% {
		top: 100%;
	}
}

@keyframes btn-anim3 {
	0% {
		right: -100%;
	}
	50%,
	100% {
		right: 100%;
	}
}

@keyframes btn-anim4 {
	0% {
		bottom: -100%;
	}
	50%,
	100% {
		bottom: 100%;
	}
}
</style>
