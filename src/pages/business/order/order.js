import mui from '../../../helpers/middleware';
import { getQuery } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './order.redux';
import './order.less';

const template = require('../../../libs/art.template');

const task = {
    //获取参数
    fetchDetail: () => {
        mui.os.plus && plus.nativeUI.showWaiting('加载中...')
        app.order.fetchDetail({

        }).then(json => {
            mui.os.plus && plus.nativeUI.closeWaiting()
        }).catch(err => {
            console.log(err)
        })
    }
}
// ios 导航状态
mui.init({
    statusBarBackground: '#f7f7f7',
    swipeBack: true
});
// 调用h5 plus的事件系统
mui._ready(function () {

    task.fetchDetail()

})

