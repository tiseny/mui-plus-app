import mui from '../../../helpers/middleware';
import { pageBack, getQuery } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import $ from 'jquery';
import './addLoan.redux';
import './addLoan.less';
import { decode } from 'punycode';

const template = require('../../../libs/art.template');
const LOAN_URL = 'loanOil.html'

const task = {

  //初始化页面
  intital: () => {
    $('#cause').bind('input propertychange', function () {
      if ($('#cause').val().length < 2 || $('#Amount').val() <= 0) {
        $('#submitApply').attr('disabled', 'true')
      } else {
        $('#submitApply').removeAttr('disabled')
      }
    })
    $('#Amount').bind('input propertychange', function () {
      if ($('#cause').val().length < 2 || $('#Amount').val() <= 0) {
        $('#submitApply').attr('disabled', 'true')
      } else {
        $('#submitApply').removeAttr('disabled')
      }
    })
  },

  //提交按钮
  bindSubmit: () => {
    $('#submitApply').click(function () {
      mui.confirm('是否确认提交？', '申请信息影响借款速度', ['确认', '取消'], e => {
        if (e.index === 0) {
          mui(this).button('loading');
          app.addLoan.addLoan({
            'Amount': $('#Amount').val(),
            'UseDescription': $('#cause').val()
          }).then(json => {
            if (json.result) {
              mui.toast(json.msg || '提交成功')
              setTimeout(() => {
                mui._openWindow({
                  url: `${LOAN_URL}`,
                  id:LOAN_URL
                });
              }, 1500);
            } else {
              mui.toast(json.msg || '提交失败')
              mui(this).button('reset');
            }
          })
        }
      })
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

  task.bindSubmit()

  task.intital()

});