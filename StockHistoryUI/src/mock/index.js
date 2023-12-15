// main.js or setupTests.js
import { mock, setup } from 'mockjs';

// 设置拦截ajax请求的相应时间
setup({ timeout: '200-600' });

// 获取菜单
mock('/mock/admin/menu', 'get', (options) => {
	const data = mock({
		data: [
			{
				id: '2000',
				parentId: '-1',
				weight: 1,
				name: 'router.systemManagement',
				path: '/system',
				meta: {
					isLink: '',
					isIframe: null,
					isKeepAlive: false,
					icon: 'iconfont icon-quanjushezhi_o',
					isAffix: false,
					title: '系统管理',
					isHide: false,
				},
				sortOrder: 1,
				menuType: '0',
				permission: null,
				children: [
					{
						id: '2001',
						parentId: '2000',
						weight: 0,
						name: 'router.logManagement',
						path: '/admin/logs',
						meta: {
							isLink: '',
							isIframe: false,
							isKeepAlive: false,
							icon: 'ele-Cloudy',
							isAffix: false,
							title: '日志管理',
							isHide: false,
						},
						sortOrder: 0,
						menuType: '0',
						permission: null,
						children: [
							{
								id: '2100',
								parentId: '2001',
								weight: 2,
								name: 'router.operationLog',
								path: '/admin/log/index',
								meta: {
									isLink: '',
									isIframe: false,
									isKeepAlive: false,
									icon: 'iconfont icon-jinridaiban',
									isAffix: false,
									title: '操作日志',
									isHide: false,
								},
								sortOrder: 2,
								menuType: '0',
								permission: null,
							},
						],
					},
				],
			},
		],
	});
	return {
		...data,
		code: 200,
		ok: true,
		message: 'Mock data fetched successfully',
	};
});

// 退出登录
mock('/mock/auth/token/logout', 'delete', (options) => {
	const data = mock({});
	return {
		...data,
		code: 200,
		ok: true,
		message: 'Mock data fetched successfully',
	};
});

// 检查当前用户的登录状态
mock('/mock/auth/token/check_token', 'get', (options) => {
	const data = mock({});
	return {
		...data,
		code: 200,
		ok: true,
		message: 'Mock data fetched successfully',
	};
});

// 获取用户列表
mock('/mock/admin/user/page', 'get', (options) => {
	const data = mock({
		data: {
			records: [
				{
					userId: '1717541847867371521',
					username: 'yuanchengzhi',
					password: '$2a$10$NW0YkghnbyWe1iYw0BIpA.abCiKHuI93/nV2vSiqrd4e0ilgRhzv.',
					salt: null,
					wxOpenid: null,
					giteeOpenId: null,
					oscOpenId: null,
					createTime: '2023-10-26 14:01:02',
					updateTime: null,
					delFlag: null,
					lockFlag: '0',
					phone: '123****1246',
					avatar: null,
					deptId: '13',
					tenantId: '1',
					deptName: '财务会计部',
					roleList: [
						{
							roleId: '2',
							roleName: '普通用户',
							roleCode: 'GENERAL_USER',
							roleDesc: '普通用户',
							dsType: 0,
							dsScope: '',
							createBy: null,
							updateBy: null,
							createTime: '2022-03-31 17:03:15',
							updateTime: '2023-04-03 02:28:51',
							delFlag: '0',
						},
					],
					postList: [
						{
							postId: '1',
							postCode: 'TEAM_LEADER',
							postName: '部门负责人',
							postSort: 0,
							remark: 'LEADER',
							createBy: null,
							updateBy: null,
							delFlag: '0',
							createTime: '2022-03-26 13:48:17',
							updateTime: '2023-03-08 16:03:35',
						},
					],
					nickname: '袁承志',
					name: '袁承志',
					email: 'yuanchengzhi@example.com',
				},
			],
			total: 14,
			size: 10,
			current: 1,
			orders: [
				{
					column: '',
					asc: true,
				},
				{
					column: '',
					asc: false,
				},
			],
			optimizeCountSql: true,
			searchCount: true,
			maxLimit: null,
			countId: null,
			pages: 2,
		},
	});
	return {
		...data,
		code: 200,
		ok: true,
		message: 'Mock data fetched successfully',
	};
});

// 获取部门列表
mock('/mock/admin/dept/tree', 'get', (options) => {
	const data = mock({
		data: [
			{
				id: '1',
				parentId: '0',
				weight: 1,
				name: '总裁办',
				isLock: false,
				createTime: '2023-04-03 13:04:47',
				children: [
					{
						id: '2',
						parentId: '1',
						weight: 2,
						name: '技术部',
						isLock: false,
						createTime: '2023-04-03 13:04:47',
						children: [
							{
								id: '7',
								parentId: '2',
								weight: 7,
								name: '研发部',
								isLock: false,
								createTime: '2023-04-03 13:04:47',
								children: [
									{
										id: '8',
										parentId: '7',
										weight: 11,
										name: 'UI设计部',
										isLock: false,
										createTime: '2023-04-03 13:04:47',
									},
								],
							},
							{
								id: '9',
								parentId: '2',
								weight: 12,
								name: '产品部',
								isLock: false,
								createTime: '2023-04-03 13:04:47',
							},
						],
					},
					{
						id: '3',
						parentId: '1',
						weight: 3,
						name: '市场部',
						isLock: false,
						createTime: '2023-04-03 13:04:47',
						children: [
							{
								id: '10',
								parentId: '3',
								weight: 13,
								name: '渠道部',
								isLock: false,
								createTime: '2023-04-03 13:04:47',
							},
							{
								id: '11',
								parentId: '3',
								weight: 14,
								name: '推广部',
								isLock: false,
								createTime: '2023-04-03 13:04:47',
							},
						],
					},
					{
						id: '4',
						parentId: '1',
						weight: 4,
						name: '销售部',
						isLock: false,
						createTime: '2023-04-03 13:04:47',
						children: [
							{
								id: '12',
								parentId: '4',
								weight: 15,
								name: '客服部',
								isLock: false,
								createTime: '2023-04-03 13:04:47',
							},
						],
					},
					{
						id: '5',
						parentId: '1',
						weight: 5,
						name: '财务部',
						isLock: false,
						createTime: '2023-04-03 13:04:47',
						children: [
							{
								id: '13',
								parentId: '5',
								weight: 16,
								name: '财务会计部',
								isLock: false,
								createTime: '2023-04-03 13:04:47',
							},
							{
								id: '14',
								parentId: '5',
								weight: 17,
								name: '审计风控部',
								isLock: false,
								createTime: '2023-04-03 13:04:47',
							},
						],
					},
				],
			},
		],
	});
	return {
		data: data.data,
		code: 200,
		ok: true,
		message: 'Mock data fetched successfully',
	};
});

// 获取部门列表
mock('/mock/dept', 'get', (options) => {
	const data = mock({
		'data|1-10': [
			{
				'id|+1': 1,
				name: '@cword(2, 5)部门',
				'order|+1': 1,
				email: '@email',
				createTime: '@date("yyyy-MM-dd HH:mm:ss")',
				'children|1-10': [
					{
						'id|+1': 100,
						name: '@cword(2, 5)部门',
						'order|+1': 1,
						email: '@email',
						createTime: '@date("yyyy-MM-dd HH:mm:ss")',
					},
				],
			},
		],
	});
	return {
		...data,
		code: 200,
		message: 'Mock data fetched successfully',
	};
});

// 获取岗位列表
mock('/mock/post', 'get', (options) => {
	const data = mock({
		'data|10-20': [
			{
				'id|+1': 1,
				name: '@cword(2, 5)岗位',
				postCode: '@cword(2, 5)',
				'order|+1': 1,
				remark: '@cword(5, 15)',
				createTime: '@date("yyyy-MM-dd HH:mm:ss")',
			},
		],
		total: '@integer(120, 1221100)',
	});
	return {
		...data,
		code: 200,
		message: 'Mock data fetched successfully',
	};
});

// 获取菜单列表
mock('/mock/menu', 'get', (options) => {
	const data = mock({
		'data|1-10': [
			{
				'id|+1': 1,
				name: '@cword(2, 5)菜单',
				'order|+1': 1,
				type: '菜单',
				path: '@url()',
				'icon|1': ['ep:menu', 'fa-solid:book-reader', 'ep:user', 'ep:avatar'],
				createTime: '@date("yyyy-MM-dd HH:mm:ss")',
				'children|1-5': [
					{
						'id|+1': 100,
						name: '@cword(2, 5)',
						'order|+1': 1,
						'icon|1': ['ep:menu', 'fa-solid:book-reader', 'ep:user', 'ep:avatar'],
						'type|1': ['菜单'],
						path: '@url()',
						createTime: '@date("yyyy-MM-dd HH:mm:ss")',
						'children|0-2': [
							{
								'id|+1': 1000,
								'name|1': ['新增', '删除', '编辑', '审核', '导出'],
								'order|+1': 1,
								type: '按钮',
								createTime: '@date("yyyy-MM-dd HH:mm:ss")',
							},
						],
					},
				],
			},
		],
	});
	return {
		...data,
		code: 200,
		message: 'Mock data fetched successfully',
	};
});

// 获取角色列表
mock('/mock/role', 'get', (options) => {
	const data = mock({
		'data|12-50': [
			{
				'id|+1': 1,
				roleName: '@cword(2, 5)角色',
				roleCode: '@cword(2, 5)',
				roleDesc: '@cword(5, 15)',
				createTime: '@date("yyyy-MM-dd HH:mm:ss")',
			},
		],
		total: '@integer(120, 1221100)',
	});
	return {
		...data,
		code: 200,
		message: 'Mock data fetched successfully',
	};
});

// 获取用户列表
mock('/mock/user', 'get', (options) => {
	const data = mock({
		'data|10-50': [
			{
				'id|+1': 1,
				userName: '@cname()',
				password: '@cword(10)',
				deptId: '@integer(1, 10)',
				phone: mock(/^1[3456789]\d{9}$/),
				role: '@integer(1, 10)',
				deptName: '@cword(2, 5)部门',
				post: '@cword(2, 5)岗位',
				'lockFlag|1': ['已锁定', '正常'],
				createTime: '@date("yyyy-MM-dd HH:mm:ss")',
			},
		],
		total: '@integer(120, 1221100)',
	});
	return {
		...data,
		code: 200,
		message: 'Mock data fetched successfully',
	};
});

// 删除
mock('/mock/delete', 'get', (options) => {
	return {
		code: 200,
		message: 'Mock data fetched successfully',
	};
});

// 修改
mock('/mock/update', 'get', (options) => {
	return {
		code: 200,
		message: 'Mock data fetched successfully',
	};
});
// 新增
mock('/mock/add', 'get', (options) => {
	return {
		code: 200,
		message: 'Mock data fetched successfully',
	};
});
