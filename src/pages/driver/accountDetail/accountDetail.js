import mui from '../../../helpers/middleware';
import { pageBack, getQuery } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './accountDetail.redux';
import './accountDetail.less';
import { decode } from 'punycode';

const ACCOUNT_URL = 'account.html'
const partnerBillId = getQuery(mui, 'partnerBillId')

const template = require('../../../libs/art.template');
const task = {
    //获取对账单数据
    fetchList: () => {
        const state = getQuery(mui, 'state')
        app.getAccount.checkSheet({ partnerBillId: partnerBillId }).then(json => {
            let waybill = []
            let loan = []
            let oil = []
            let waybillTotal = 0
            let loanTotal = 0
            let oilTotal = 0
            json.data.forEach(ele => {
                if (ele.CostType == 1) {
                    waybill.push(ele)
                    waybillTotal += ele.Amount
                } else if (ele.CostType == 2) {
                    oil.push(ele)
                    oilTotal += ele.Amount
                } else {
                    loan.push(ele)
                    loanTotal += ele.Amount
                }
            })
            const html = template('accountDetail-template', {
                waybill, 
                oil,
                loan,
                state: decodeURI(state),
                oilTotal: Number(oilTotal).formatMoney(),
                loanTotal: Number(loanTotal).formatMoney(),
                waybillTotal: Number(waybillTotal).formatMoney(),
                total: Number(waybillTotal + loanTotal + oilTotal).formatMoney()
            });
            document.getElementById('mui-content').innerHTML = html;
        })
    },
    
    //核对账单
    bindCheck: () => {
        mui(document.body).on('tap', '.mui-btn', function (ele) {
            mui.confirm('是否确认提交？', '提交后不可修改', ['确认', '取消'], e => {
                if (e.index == 0) {
                    const id = ele.detail.target.dataset.id
                    mui(this).button('loading');
                    document.getElementById(id).disabled = true
                    app.getAccount.submitCheck({
                        partnerBillId: partnerBillId,
                        isThrough: ele.detail.target.dataset.isthrough
                    }).then(json => {
                        if (json.result) {
                            mui.toast('提交成功')
                            setTimeout(() => {
                                mui.openWindow({
                                    url: `${ACCOUNT_URL}`,
                                    extras: {}
                                });
                            }, 1500);
                        } else {
                            mui.toast(json.msg || '提交失败')
                            mui('.mui-btn').button('reset');
                            document.getElementById(id).disabled = false
                        }
                    })
                }
            })
        });
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

    task.bindCheck()

});


