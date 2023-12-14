import { defineStore } from 'pinia';

/**
 * 修改配置时：
 * 1、需要每次都清理 `window.localStorage` 浏览器永久缓存
 * 2、或者点击布局配置最底部 `一键恢复默认` 按钮即可看到效果
 */
export const useThemeConfig = defineStore('themeConfig', {
	state: (): ThemeConfigState => ({
		themeConfig: { "isDrawer": false, "primary": "#2E5CF6", "isIsDark": false, "topBar": "#ffffff", "topBarColor": "#606266", "isTopBarColorGradual": false, "menuBar": "#FFFFFF", "menuBarColor": "#505968", "menuBarActiveColor": "rgba(242, 243, 245, 1)", "isMenuBarColorGradual": false, "columnsMenuBar": "#545c64", "columnsMenuBarColor": "#e6e6e6", "isColumnsMenuBarColorGradual": false, "isColumnsMenuHoverPreload": false, "isCollapse": false, "isUniqueOpened": false, "isFixedHeader": false, "isFixedHeaderChange": false, "isClassicSplitMenu": true, "isLockScreen": false, "lockScreenTime": 30, "isShowLogo": true, "isShowLogoChange": false, "isBreadcrumb": false, "isTagsview": false, "isBreadcrumbIcon": false, "isTagsviewIcon": false, "isCacheTagsView": false, "isSortableTagsView": false, "isShareTagsView": false, "isFooter": true, "isGrayscale": false, "isInvert": false, "isWartermark": false, "wartermarkText": "有嘉投资-张先生", "tagsStyle": "tags-style-five", "animation": "slide-right", "columnsAsideStyle": "columns-round", "columnsAsideLayout": "columns-vertical", "layout": "transverse", "isRequestRoutes": true, "globalTitle": "有嘉投资-量化交易平台", "globalI18n": "zh-cn", "globalComponentSize": "default", "footerAuthor": "©2023 张先生" }
	}),
	actions: {
		setThemeConfig(data: ThemeConfigState) {
			this.themeConfig = data.themeConfig;
		},
	},
});
