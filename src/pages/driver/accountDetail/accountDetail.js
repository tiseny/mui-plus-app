import mui from '../../../helpers/middleware';
import { pageBack, getQuery } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './accountDetail.redux';
import './accountDetail.less';

const DETAIL_URL = 'orderDetail.html'
const FEEDETAIL_URL = 'feeDetail.html'

const template = require('../../../libs/art.template');
const task = {
    //获取对账单数据
    fetchList: () => {
        app.getAccount.checkSheet({ id: getQuery(mui,'partnerBillId')}).then(json => {
            console.log(json)
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
            const id = this.getAttribute('data-Id')
            console.log(id)
            mui.openWindow({
                url: `${DETAIL_URL}?part_id=${id}`,
                id: DETAIL_URL,
                extras: {
                    part_id: id
                }
            });
        })
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


