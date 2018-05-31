import mui from '../../../helpers/middleware';
import { goLogin } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './home.less';

let subpages = []
let pageshow = {};

mui('.mui-bar-tab .mui-tab-item').each(function (e) {
	let page = this.getAttribute('href')
	subpages.push(page)
})

mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: false
});


//创建子页面，首个选项卡页面显示，其它均隐藏；
mui._ready(function () {
	plus.nativeUI.showWaiting();
	// 如果 plus 支持
	if (mui.os.plus) {
		let self = plus.webview.currentWebview();
		for (let i = 0; i < subpages.length; i++) {
			let sub = plus.webview.create(subpages[i], subpages[i], {
				top: '43px',
				bottom: '51px',
				styles: {
					hardwareAccelerated: true
				},
				show: {
					event: "loaded"
				},
				waiting: {
					autoShow: false
				}
			});
			if (i > 0) {
				sub.hide();
			} else {
				pageshow[subpages[i]] = true;
			}
			self.append(sub);
		}
	}
	//当前激活选项
	let activeTab = subpages[0];
	let title = document.getElementById("title");

	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function (e) {
		let targetTab = this.getAttribute('href');
		if (targetTab == activeTab) {
			return;
		}
		// 如果是当前是费用
		if (targetTab == 'fee.html') {
			document.getElementById('header').classList.add('black')
		} else {
			document.getElementById('header').classList.remove('black')
		}

		//更换标题
		title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if (mui.os.ios || pageshow[targetTab]) {
			plus.webview.getWebviewById(targetTab).reload(true)
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			pageshow[targetTab] = true;
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;

		plus.nativeUI.closeWaiting()
	});
	//自定义事件，模拟点击“首页选项卡”
	document.addEventListener('gohome', function () {
		let defaultTab = document.getElementById("defaultTab");
		//模拟首页点击
		mui.trigger(defaultTab, 'tap');
		//切换选项卡高亮
		let current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
		if (defaultTab !== current) {
			current.classList.remove('mui-active');
			defaultTab.classList.add('mui-active');
		}
	});

});
