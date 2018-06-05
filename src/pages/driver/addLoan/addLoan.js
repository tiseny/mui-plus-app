import mui from '../../../helpers/middleware';
import { pageBack, getQuery, imagePreview, photo } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import $ from 'jquery';
import './addLoan.redux';
import './addLoan.less';
import { decode } from 'punycode';

const template = require('../../../libs/art.template');

const task = {

  data: {
    imageUrl: '',
    imageId: ''
  },

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
      const Amount = $('#Amount').val()
      const UseDescription = $('#cause').val()
      const AttachmentId = task.data.imageId

      if (Amount <= 0) {
        mui.toast('请正确填写借款金额！')
        return
      } else if (!UseDescription) {
        mui.toast('请填写借款事由！')
        return
      } else if (!AttachmentId) {
        mui.toast('请上传附件图片！')
        return
      }
      
      mui.confirm('是否确认提交？', '申请信息影响借款速度', ['确认', '取消'], e => {
        if (e.index === 0) {
          mui(this).button('loading');
          app.addLoan.addLoan({
            Amount,
            UseDescription,
            AttachmentId
          }).then(json => {
            if (json.result) {
              mui.toast(json.msg || '提交成功')
              setTimeout(() => {
                // mui.openWindow({
                //   url: 'home.html',
                //   id: 'home.html'
                // });
                plus.webview.currentWebview().close()
              }, 1500);
            } else {
              mui.toast(json.msg || '提交失败')
              mui(this).button('reset');
            }
          })
        }
      })
    })
  },

  uploadImage: () => {
    mui('#image-wrap').on('tap', '.image-box-inner.plus', function() {
      const field = this.getAttribute('data-field');
      const type = this.getAttribute('data-type');

      photo((path, base64, bitdata) => {
        mui.os.plus && plus.nativeUI.showWaiting('上传中...');
        app.orderProcess.upaloadImage({
          
          data: bitdata
        }).then(json => {
          mui.os.plus && plus.nativeUI.closeWaiting();
          // 如果成功
          if (json.result) {
            mui._toast('上传成功')
            task.data.imageUrl = base64
            task.data.imageId = base64
            task.render()
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
    mui('#image-wrap').on('tap', '.image-box-inner.image', function() {
      const src = this.getAttribute('data-src');

      if (src) {
        imagePreview(mui, src, null)
      }
    })
  },

  deleteImage: () => {
    mui('#image-wrap').on('tap', '.mui-input-row.camera .mui-icon-close', function() {
      mui.confirm('确认要删除图片？', '提示', ['是', '否'], function(e) {
        if (e.index == 0) {
          // 清空本地的图片路径
          task.data.imageUrl = ""
          task.data.imageId = ""
          task.render()
        } 
      })
    })
  },

  render: () => {
    document.getElementById('image-wrap').innerHTML = template('image-template', {
      imageUrl: task.data.imageUrl,
      imageId: task.data.imageId
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

  task.render()

});