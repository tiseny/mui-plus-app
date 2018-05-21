import mui from '../../../helpers/middleware';
import { pageBack } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './account.redux';
import './account.less';

const DETAIL_URL = 'accountDetail.html'

const template = require('../../../libs/art.template');
const task = {
    //获取对账单数据
    fetchList: () => {
        app.getAccount.checkSheet({}).then(json => {
            json.data = task.formatData(json.data)
            json.data.forEach(ele => {
                task.getStatus(ele)
            })
            const html = template('account-template', { data: json.data });
            document.getElementById('account-view').innerHTML = html;
        })
    },

    //格式化数据列表
    formatData: (data) => {
        data.forEach(element => {
            element.CheckSheetDate = element.CheckSheetDate.split(' ')[0]
        });
        return data
    },

    //点击进入详情
    bindToDetail: () => {
        mui("body").on('tap', '.mui-table-view-cell', function () {
            const Id = this.getAttribute('data-Id')
            const state = this.getAttribute('data-state')
            mui.openWindow({
                url: `${DETAIL_URL}?partnerBillId=${Id}&state=${state}`,
                partnerBillId: DETAIL_URL,
                extras: {
                    partnerBillId: Id,
                    state: state
                }
            });
        })
    },

    //状态值
    getStatus: function (item) {
        const StatusArr = ['未提交', '等待审核', '已提交', '审核中', '审核通过', '付款中', '付款完结', '已退回']
        const StateArr = ['', '平台审核通过', '司机不通过', '司机通过']
        const stateColor = {
            '平台审核通过': '#222',
            '司机不通过': '#f30',
            '司机通过': '#1AAD19',
            '未提交': '#999',
            '等待审核': '#ffc107',
            '已提交': '#222',
            '审核中': '#9112c8',
            '审核通过': '#ff9630',
            '付款中': '#2196F3',
            '付款完结': '#3a0',
            '已退回': '#f30'
        }

        // 优先 支付状态 id 
        if (item.PaymentStatusId != null) {
            item.stateName = StatusArr[item.PaymentStatusId]
            item.stateColor = stateColor[item.stateName]
        } else {
            item.stateName = StateArr[item.CheckSheetStatusId] || '司机通过'
            item.stateColor = stateColor[item.stateName]
        }
    }
}




// ios 导航状态
mui.init({
    statusBarBackground: '#f7f7f7',
    swipeBack: false
});


// 调用h5 plus的事件系统
mui._ready(function () {

    pageBack(mui)

    task.fetchList()

    task.bindToDetail()

});


