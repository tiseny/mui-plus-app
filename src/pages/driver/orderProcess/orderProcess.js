import mui from '../../../helpers/middleware';
import { getQuery, imagePreview, photo } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './orderProcess.redux';
import './orderProcess.less';

const template = require('../../../libs/art.template');

const render = data => {
	document.getElementById('orderProcess-page').innerHTML = template('orderProcess-template', {
		data,
		title: decodeURI(getQuery(mui, 'action')),
		mode: getQuery(mui, 'mode')
	});
	// 初始化
	mui('.mui-input-row input').input(); 
}

const IMG_KEY = {
	// 提柜
	'柜后门':  'ORDER_CABINETREARDOOR',
	'封条': 'ORDER_SEALS',
	// 到场
	'工厂大门': 'ORDER_FACTORYGATE',
	// 离场
	'空柜': 'ORDER_BEFORESHIPMENT',
	'货装一半': 'ORDER_SHIPMENTING',
	'装好': 'ORDER_AFTERSHIPMENT',
	'封锁条': 'ORDER_LOCKSTRIP',
	// 还柜
	'过磅单': 'ORDER_WEIGHINGLIST',
	'还柜纸': 'ORDER_CABINETPAPER'
}

const PAGE_KEY = {
	'提柜确认': 'BORROW_CONTAINER',
	'到场确认': 'ARRIVAL_VENUE',
	'离场确认': 'LEAVE_VENUE',
	'还柜确认': 'RETURN_CONTAINER',
}

const task = {

	state: {
		pageData: {
			ArkHeavy: "", 								// 柜重量
			BookingNum: "",								// 订舱号
			SealNumber: "",								// 封条号
			SerialNumOfBookingNum: "",		// 序号
			TankNo: "",										// 柜号
			WeighingWeight: "",						// 过磅货重

			ghm: "",											// 柜后门
			ft: "",												// 封条

			gcdm: "",											// 工厂大门

			kg: "",												// 空柜
			hzyb: "",											// 货装一半
			zh: "",												// 装好
			fst: "",											// 封锁条

			gbd: "",											// 过磅单
			hgz: "",											// 还柜纸
		}
	},

	uploadImage: () => {
		mui('#orderProcess-page').on('tap', '.image-box-inner.plus', function() {
			const field = this.getAttribute('data-field');
			const type = this.getAttribute('data-type');
			
			photo((path, base64, bitdata) => {
				app.orderProcess.upaloadImage({
		      orderId: getQuery(mui, 'order_id'),
		      businessKey: IMG_KEY[type],
		      data: bitdata
		    }).then(json => {
		    	console.log(json)
		      // 如果成功
		      if (json.result) {
		       	task.state.pageData[field] = base64
						render(task.state.pageData)
		      }
		    })
		    // 清空本地的图片路径
				//task.state.pageData[field][index] = base64
				//render(task.state.pageData)
				//console.log(path, base64)
			})
		})
	},

	previewImage: () => {
		mui('#orderProcess-page').on('tap', '.image-box-inner.image', function() {
			const src = this.getAttribute('data-src');
			const mode = this.getAttribute('data-mode');
			const field = this.getAttribute('data-field');

			if (src) {
				const deleteFunc = mode === 'add' ? () => {
					return new Promise((resolve,reject) => {
						// 清空本地的图片路径
						task.state.pageData[field] = ""
						render(task.state.pageData)
						resolve();
					})	
				} : null 
				imagePreview(mui, src, deleteFunc)
			}
		})
	},

	deleteImage: () => {
		mui('#orderProcess-page').on('tap', '.mui-input-row.camera .mui-icon-close', function() {
			const field = this.getAttribute('data-field');

			mui.confirm('确认要删除图片？', '提示', ['是', '否'], function(e) {
				if (e.index == 0) {
					// 清空本地的图片路径
					task.state.pageData[field] = ""
					render(task.state.pageData)
				} 
			})
		})
	},

	// 获取 待解运单数据
	fetchDetail: () => {
		mui.os.plus && plus.nativeUI.showWaiting('加载中...');

		const sectionName = decodeURI(getQuery(mui, 'action'))

		app.orderProcess.fetchDetail({
      orderId: getQuery(mui, 'order_id'),
      sectionName: PAGE_KEY[sectionName]
		}).then(json => {
			mui.os.plus && plus.nativeUI.closeWaiting();

			const attachs = json.data.Attachs
			const ghm = attachs.filter(item => item.BusinessCode == IMG_KEY['柜后门'])
			const ft = attachs.filter(item => item.BusinessCode == IMG_KEY['封条'])

			const gcdm = attachs.filter(item => item.BusinessCode == IMG_KEY['工厂大门'])

			const kg = attachs.filter(item => item.BusinessCode == IMG_KEY['空柜'])
			const hzyb = attachs.filter(item => item.BusinessCode == IMG_KEY['货装一半'])
			const zh = attachs.filter(item => item.BusinessCode == IMG_KEY['装好'])
			const fst = attachs.filter(item => item.BusinessCode == IMG_KEY['封锁条'])

			const gbd = attachs.filter(item => item.BusinessCode == IMG_KEY['过磅单'])
			const hgz = attachs.filter(item => item.BusinessCode == IMG_KEY['还柜纸'])
			
			task.state.pageData = json.data
			// 数组默认为数组
			task.state.pageData.ghm = ghm && ghm.AttachUrl || ''
			task.state.pageData.ft = ft && ft.AttachUrl || ''

			task.state.pageData.gcdm = gcdm && gcdm.AttachUrl || ''			

			task.state.pageData.kg = kg && kg.AttachUrl || ''
			task.state.pageData.hzyb = hzyb && hzyb.AttachUrl || ''
			task.state.pageData.zh = zh && zh.AttachUrl || ''
			task.state.pageData.fst = fst && fst.AttachUrl || ''

			task.state.pageData.gbd = gbd && gbd.AttachUrl || ''
			task.state.pageData.hgz = hgz && hgz.AttachUrl || ''

			render(task.state.pageData)
		})
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: true,
});


// 调用h5 plus的事件系统
mui._ready(function() {

	task.fetchDetail()

	task.previewImage()

	task.uploadImage()

	task.deleteImage();

});
