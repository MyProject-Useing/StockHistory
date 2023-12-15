import request from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { validateNull } from '/@/utils/validate';
import { useUserInfo } from '/@/stores/userInfo';
import other from '/@/utils/other';
/**
 * https://www.ietf.org/rfc/rfc6749.txt
 * OAuth 协议 4.3.1 要求格式为 form 而不是 JSON 注意！
 */
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

/**
 * 登录
 * @param data
 */
export const login = (data: any) => {
	let encPassword = data.password;
	// 密码加密
	if (import.meta.env.VITE_PWD_ENC_KEY) {
		encPassword = other.encryption(data.password, import.meta.env.VITE_PWD_ENC_KEY);
	}
	return request({
		url: '/auth/oauth2/token',
		method: 'post',
		data: { username: data.username, password: encPassword },
	});
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
	return request({
		url: '/admin/user/info',
		method: 'get',
	});
};

export const logout = () => {
	return request({
		url: '/auth/token/logout',
		method: 'delete',
	});
};