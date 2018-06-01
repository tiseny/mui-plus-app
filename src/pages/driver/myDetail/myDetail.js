import mui from '../../../helpers/middleware';
import { getQuery, goLogin } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './myDetail.redux';
import './myDetail.less';

const template = require('../../../libs/art.template');

const task = {

    //获取my页面传递的参数
    fetchDetail: () => {
        mui.os.plus && plus.nativeUI.showWaiting('加载中...')
        app.myDetail.fetchDetail({}).then(json => {
            mui.os.plus && plus.nativeUI.closeWaiting()
            //检查是否过期
            const checkData = () => {
                //司机信息解析，如果时间过期添加_end数据
                for (let key in json.data) {
                    if (Date.parse(json.data[key]) && key !== 'Id') {
                        // console.log(key)
                        // console.log(Date.parse(json.data[key]))
                        let time = new Date()
                        let D_value = time.getTime() - Date.parse(json.data[key])  //现在的时间与司机信息里的时间差值
                        try {
                            json.data[key] = json.data[key].split(' ')[0]
                            if (D_value > 0) {
                                json.data[key + '_end'] = '已过期'              //如果大于0，则是已过期
                                //添加trailer元素
                            } else if (D_value <= 0 && Math.abs(D_value / 1000 / 60 / 60 / 24) <= 30) {      //如果差值小于30天  
                                json.data[key + '_end'] = '即将过期'
                            }
                        } catch (err) { }
                    }
                }
            }
            checkData()
            const html = template('myDetail-template', {
                data: json.data,
                id: getQuery(mui, 'part_id'),
                title: decodeURI(getQuery(mui, 'part_title'))
            })
            document.getElementById('myDetail-mui').innerHTML = html
        }).catch(err => {
            console.log(err)
        })
    },

    //密码修改
    changePass: () => {
        mui("body").on('tap', '#changePassBtn', function () {
            let oldPass = $('#oldPass').val();
            let newPass = $('#newPass').val();
            let rePass = $('#confirmPass').val();

            //新密码与确认密码是否相同
            if (newPass == rePass && oldPass) {
                mui(this).button('loading');
                app.myDetail.changePass({
                    "OldPassword": oldPass,
                    "NewPassword": newPass,
                    "NewPasswordConfirm": rePass
                }).then(json => {
                    mui(this).button('reset');
                    if (json.result) {
                        mui.toast('修改成功')
                        setTimeout(() => {
                            goLogin(mui)
                        }, 1500);
                    } else {
                        mui.toast(json.msg || '出现错误')
                    }
                })
            }
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

    task.changePass()

})

