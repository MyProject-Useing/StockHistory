import { defineStore } from 'pinia';
import { Session } from '/@/utils/storage';
import { getUserInfo, login } from '/@/api/login/index';
import { useMessage } from '/@/hooks/message';

/**
 * @function useUserInfo
 * @returns {UserInfosStore}
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),

	actions: {
		/**
		 * 登录方法
		 * @function login
		 * @async
		 * @param {Object} data - 登录数据
		 * @returns {Promise<Object>}
		 */
		async login(data: any) {
			data.grant_type = 'password';
			data.scope = 'server';

			return new Promise((resolve, reject) => {
				login(data)
					.then((res) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error(err?.msg || '系统异常请联系管理员');
						reject(err);
					});
			});
		},

		/**
		 * 获取用户信息方法
		 * @function setUserInfos
		 * @async
		 */
		async setUserInfos() {
			await getUserInfo().then((res) => {
				const userInfo: any = {
					user: res.data.sysUser,
					time: new Date().getTime(),
					roles: res.data.roles,
					authBtnList: res.data.permissions,
				};
				this.userInfos = userInfo;
			});
		},
	},
});
