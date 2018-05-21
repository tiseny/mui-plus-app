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
  },

  //设置
  setTab: () => {
    $('.tab-hd')[task.obj.activeIndex].css({
      'color': '#1AAD19',
      'border-color': '#1AAD19'
    })
  },

  //顶部导航
  bindSwitchTab: () => {
    $('.tab-hd').click(function () {
      obj.activeIndex = $(this).dataset.activeIndex
      task.setTab()
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

});