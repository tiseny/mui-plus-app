import mui from '../../../helpers/middleware';
import { pageBack, getQuery } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import $ from 'jquery';
import './loanOil.redux';
import './loanOil.less';
import { decode } from 'punycode';

const template = require('../../../libs/art.template');

const task = {

  obj: {
    activeIndex: 0,
    stateColor: {
      '未提交': '#999',
      '等待审核': '#ffc107',
      '已提交': '#222',
      '审核中': '#9112c8',
      '审核通过': '#ff9630',
      '付款中': '#2196F3',
      '付款完结': '#3a0',
      '已退回': '#f30'
    }
  },

  //设置
  setTab: () => {
    //$('.tab-hd')[task.obj.activeIndex]是DOM对象，$($('.tab-hd')[task.obj.activeIndex])是jQuery对象
    $($('.tab-hd')[task.obj.activeIndex]).css({
      'color': '#1AAD19',
      'border-color': '#1AAD19'
    })
    $('.tab-hd').not($('.tab-hd')[task.obj.activeIndex]).css({
      'color': '#222',
      'border-color': '#fff'
    })
    $($('.content-bd')[task.obj.activeIndex]).show()
    $('.content-bd').not($('.content-bd')[task.obj.activeIndex]).hide()
    task.fetchList()
  },

  //顶部导航
  bindSwitchTab: () => {
    $('.tab-hd').click(function () {
      task.obj.activeIndex = $($(this)).data().index
      task.setTab()
    })
  },

  //获取数据
  fetchList: () => {
    let func = null
    let temp = ''
    if (task.obj.activeIndex === 0) {
      func = app.loanOil.getLoan
      temp = 'loan-template'
    } else {
      func = app.loanOil.getOil
      temp = 'oil-template'
    }
    func({}).then(json => {
      json.data.forEach(element => {
        element['stateColor'] = task.obj.stateColor[element.State]
      });
      const html = template(temp, { data: json.data });
      $('.content-bd')[task.obj.activeIndex].innerHTML = html;
    })
  },

  //跳转借款申请
  bindAddLoan: () => {
    mui('body').on('tap', "#add-btn", function () {
      mui.openWindow({
        url: 'addLoan.html',
        extras: {}
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

  task.bindSwitchTab()

  task.setTab()

  task.bindAddLoan()

});