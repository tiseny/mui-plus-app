import mui from '../../../helpers/middleware';
import { getQuery } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import $ from 'jquery';
import './feeDetail.redux';
import './feeDetail.less';

const template = require('../../../libs/art.template')

//费用选择
const extraCategory = []
//费用录入费用列表
const add_feeList = []

const task = {
	//状态
	state: {
		mode: 'add',
		defaultFeeList: [],																									// 管理端录入的费用
		categoryList: [],																									  // 分类
		feeList: [],																										    // 选择的分类
		feeArrs: []																													// 选择项 index
	},
	
	//监听加一笔按钮显示复选框
	listenerAddFee: () => {
		mui('body').on('tap', '#add-btn', function(){
			// 勾选已经选择的选择
			$('#category-wrap').find('.item').removeClass('selected');
			task.state.feeArrs.forEach(item => {
				$('#category-wrap').find('.item').eq(item).removeClass('selected').addClass('selected');
			})

			$('#category-wrap').show()
		})
	},

	listenButton: () => {
		mui('body').on('tap', '.mui-btn', function(){
			const action = this.getAttribute('data-action')
			switch (action) {
				case "0":
					const btn = this
					const params = []
					// todo 添加费用
					task.checkValid().then(() => {
						mui.confirm('请确认信息是否正确, 提交后无法修改？', '提交提醒', ['确认','取消'], function(e) {
							if (e.index == 0) {
								const list = task.state.defaultFeeList.concat(task.state.feeList)
								// 开启loading
								mui(btn).button('loading');
								// list
								list.forEach(item => {
									params.push({
										Id: getQuery(mui, 'order_id'),
						        OrderNo: getQuery(mui, 'order_no'),
						        CostItem_Id: item.Id,
						        CostName: item.Name,
						        CurrencyName: item.CurrencyName,
						        Currency_Id: item.Currency_Id,
						        CostType: item.Category,
										Amount: item.Money,
										Quantity: 1										//费用数量,不可删除
									})
								})

								app.feeDetail.addFee(params).then(json => {
									mui(btn).button('reset');
									if (json.result) {
										mui._toast('添加成功')
										setTimeout(() => {
											mui._openWindow({
										    url:'home.html',
										    id: 'order.html',
										    extras:{
									        activeIndex:2
										    }
											});
										}, 1500)
									} else {
										mui._toast(json.msg || '添加失败')
									}
								})
							} 
						})
					})
					break;
				case "1":
					// 
					mui.back();
					break;
				case "2":
					// 选择了费用项
					$('#category-wrap').find('.item.selected').each(function() {
						let currIndex = $(this).index()
						let currItem = task.state.categoryList[currIndex]
						// 如果已经被选择则不加入
						if (!task.state.feeList.some(item => item.Id == currItem.Id)) {
							currItem.Money = ''
							task.state.feeList.push(currItem)
							task.state.feeArrs.push(currIndex)
						}
					})
					// 隐藏
					$('#category-wrap').hide()
					// 重新渲染, 无需更改 total
					const list = task.state.defaultFeeList.concat(task.state.feeList)
					task.renderAddPage(list)
					break;
				default:
					// statements_def
					$('#category-wrap').hide()

					break;
			}
		})
	},

	listenInput: () => {
		$('body').on('input propertychange','.input-wrap input', function(e) {
			const index = $(this).parent().index()
			const feeIndex = index - task.state.defaultFeeList.length
			if (feeIndex >= 0) {
				task.state.feeList[feeIndex].Money = $(this).val()
			} else {
				task.state.defaultFeeList[index].Money = $(this).val()
			}

			const list = task.state.defaultFeeList.concat(task.state.feeList)

			let total = 0

			list.forEach(item => {
				total += +item.Money
			})

			task.state.total = total

			$('#number').text(Number(total).formatMoney())
		})

		// 监听滑动事件 （不属于默认费用）
		mui('body').on('swipeleft','.input-wrap .mui-input-row', function(e) {
			const currIndex = $(this).index() - task.state.defaultFeeList.length 
			const distance = e.detail.distance 
			if (distance > 50 && currIndex >= 0) {
				mui.confirm('确认要删除？', '删除提醒', ['确认','取消'], function(e) {
					if (e.index == 0) {
						task.state.feeList.splice(currIndex, 1)
						task.state.feeArrs.splice(currIndex, 1)

						const list = task.state.defaultFeeList.concat(task.state.feeList)

						let total = 0

						list.forEach(item => {
							total += +item.Money
							console.log(item.Money)
						})

						task.state.total = total

						task.renderAddPage(list)
					} 
				})
			}
		})
	},

	listenCategory: () => {
		mui('body').on('tap','.category-wrap .item', function(e) {
			$(this).toggleClass('selected')
		})
	},

	//获取费用数据
	fetchFeeDetail:() => {
		const isAccount = getQuery(mui, 'isAccount')
		const func = !!isAccount ? app.feeDetail.fetchDetail : app.feeDetail.fetchFee

		func({
			OrderId: getQuery(mui,'order_id'),
			partnerBillId: getQuery(mui,'partnerBillId'),
		}).then(json => {
			//费用总金额
			let total = 0;
			json.data.forEach(item => {
				total += +item.Amount
			})
			document.getElementById('feeDetail-page').innerHTML = template('fee-template', {
				list: json.data,
				mode: task.state.mode,
				total: Number(total).formatMoney()
			})
		})
	},

	//获取费用种类数据
	fetchFeeCategory:() => {
		return new Promise((resolve, reject) => {
			app.feeDetail.feeCategory().then(json => {
				task.state.categoryList = json.data
				resolve(json.data)
			})
		})
	},

	fetchDefaultFee: () => {
		return new Promise((resolve, reject) => {
			let total = 0;
			
			app.feeDetail.fetchDefault().then(json => {
				json.data.forEach(item => {
					total += +item.Money
				})
				task.state.defaultFeeList = json.data
				task.state.total = total
				resolve(json.data)
			})
		})
	},

	initPage: () => {
		task.state.mode = getQuery(mui,'OrderStatus') == '11' ? 'show' : 'add'
		if (task.state.mode == 'show') {
			task.fetchFeeDetail()
		} else {
			task.fetchDefaultFee().then(data => {
				task.fetchFeeCategory().then(json => {
					task.renderAddPage(task.state.defaultFeeList)
				})
			})
		}
	},

	renderAddPage: (data) => {
		// 过滤掉 后台录入费用项目
		const defaultIds = task.state.defaultFeeList.map(item => item.Id)
		const categoryList = task.state.categoryList.filter(item => defaultIds.indexOf(item.Id) == -1)
		document.getElementById('feeDetail-page').innerHTML = template('fee-template', {
			list: data,
			categoryList: categoryList,
			mode: task.state.mode,
			total: Number(task.state.total).formatMoney()
		})
	},

	// 校验 是否录入了 默认费用项目
	checkValid: () => {
		return new Promise((resolve, reject) => {
			const item = task.state.defaultFeeList.concat(task.state.feeList).filter(item => item.Money ==='')
			if (item.length>0) {
				mui._toast(`请填写${item.Name}！`)
			} else {
				resolve()
			}
		})
	}

}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: false
});


// 调用h5 plus的事件系统
mui._ready(function() {

	task.initPage()

	task.listenerAddFee()

	task.listenButton() 

	task.listenCategory()

	task.listenInput()

});

