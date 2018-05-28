import { setState, getState, clearState } from "./state";
import EXIF from "../libs/exif";
import { loadBmap } from "./loader";
import config from "../config";
import fetch from "./fetch";

const BLANK_LIST = ["/login.*", "/register.*"];
const LOGIN_URL = "login.html";

let geoWatch = null;

function isLogin(mui) {
  const url = window.location.pathname;
  const isValidUrl = BLANK_LIST.some(reg => new RegExp(reg).test(url));
  // 如果是非黑名单内的url
  // 如果不存在token. 则打回到 login.html
  if (!getState("token") && !isValidUrl) {
    mui.openWindow({
      url: LOGIN_URL,
      id: LOGIN_URL
    });
  }
}

function goLogin(mui) {
  // 清除 所有 localStorage
  clearState();
  // 获取所有Webview窗口
  let curr = plus.webview.currentWebview();
  let wvs = plus.webview.all();
  for (let i = 0, len = wvs.length; i < len; i++) {
    //关闭除当前页面外的其他页面
    if (wvs[i].getURL() == curr.getURL()) continue;
    plus.webview.close(wvs[i]);
  }
  //打开login页面后再关闭setting页面
  plus.webview.open("login.html");
  curr.close();
}
//位置监听
function watchLocation(mui) {
  // 如果已经登录 有已接订单 获取司机信息并上传位置
  //plus.networkinfo.getCurrentType()网络状态
  if (getState("token")) {
    if (plus.networkinfo.getCurrentType() > 0) {
      uploadLocation.recievedList().then(recieved => {
        if (recieved.result) {
          if (recieved.data.length > 0) {
            uploadLocation.trailer().then(trailerInfo => {
              if (trailerInfo.result) {
                //可能会有多个已接
                let orderNo = "";
                recieved.data.forEach(element => {
                  if (recieved.data[recieved.data.length - 1] == element) {
                    orderNo += element.OrderNo;
                  } else {
                    orderNo += element.OrderNo + ",";
                  }
                });
                let params = []
                //获取本地存储的位置信息
                if (getState('location')) {
                  JSON.parse(getState('location')).forEach(element => {
                    element.DriverId = trailerInfo.data.Id
                    element.PlateNumber = trailerInfo.data.PlateNumber
                    element.OrderNo = orderNo
                    params.push(JSON.stringify(element))
                  });
                  console.log('上传了' + JSON.parse(getState('location')).length + '条本地位置')
                }
                params.push({
                  DriverId: trailerInfo.data.Id,
                  PlateNumber: trailerInfo.data.PartnerName,
                  OrderNo: orderNo,
                  Longitude: uploadLocation.getLocation().lng,
                  Latitude: uploadLocation.getLocation().lat,
                  Address: uploadLocation.getLocation().address,
                  CreateDate: new Date().toISOString().split('.')[0].split('T')[0] + ' ' + new Date().toISOString().split('.')[0].split('T')[1]
                });
                //位置上传
                uploadLocation.DriverLocation(params).then(json => {
                  if (json.result) {
                    console.log("上传位置成功");
                    clearState('location')
                  } else {
                    console.log("上传位置失败,添加当前位置到本地存储");
                    setState('location', JSON.stringify(params))
                  }
                });

              } else {
                console.log("司机信息获取失败");
              }
            });
          } else {
            //没有已接订单删除定位存储
            clearState('location')
          }
        } else {
          console.log("已接运单获取失败");
        }
      });
    } else {
      console.log('没网则存储位置到数组')
      let location = [{
        Longitude: uploadLocation.getLocation().lng,
        Latitude: uploadLocation.getLocation().lat,
        Address: uploadLocation.getLocation().address,
        CreateDate: new Date().toISOString().split('.')[0].split('T')[0] + ' ' + new Date().toISOString().split('.')[0].split('T')[1]
      }]
      if (getState('location')) {
        JSON.parse(getState('location')).forEach(item => {
          location.push(item)
        })
        setState('location', JSON.stringify(location))
      } else {
        setState('location', JSON.stringify(location))
      }
    }
  }
}

//位置信息接口
let uploadLocation = {
  //上传位置接口
  DriverLocation: params => {
    return new Promise((resolve, reject) => {
      fetch(config.driver.api.DriverLocation, { body: params }, "post").then(
        json => {
          resolve(json);
        }
      );
    });
  },
  //司机信息
  trailer: params => {
    return new Promise((resolve, reject) => {
      fetch(config.driver.api.trailer, { header: params }, "get").then(json => {
        resolve(json);
      });
    });
  },
  //已接运单
  recievedList: () => {
    return new Promise((resolve, reject) => {
      fetch(
        config.driver.api.orderTruck,
        { header: { type: "RECEIVED" } },
        "get"
      ).then(json => {
        resolve(json);
      });
    });
  },

  getLocation: () => {
    let lng = 0
    let lat = 0
    let address = ''
    //获取位置信息
    geoWatch = plus.geolocation.getCurrentPosition(
      function (position) {
        // coords 经纬度
        lng = position.coords.longitude
        lat = position.coords.latitude
        // address
        address = `${position.address.province}${
          position.address.city
          }${position.address.district}${position.address.street}`;

        // 清楚监听位置
        plus.geolocation.clearWatch(geoWatch);
        geoWatch = null;
      },
      function (e) {
        plus.nativeUI.toast("异常:" + e.message);
        // 清楚监听位置
        plus.geolocation.clearWatch(geoWatch);
        geoWatch = null;
      },
      { provider: "baidu" }
    );
    return {
      lng: lng,
      lat: lat,
      address: address
    }
  },
}

// 调用系统电话
function callPhone(number) {
  plus.nativeUI.confirm(
    `拨打${number}？`,
    function (e) {
      if (e.index == 0) {
        plus.device.dial(number, true);
      }
    },
    "温馨提示",
    ["是", "否"]
  );
}

// 打开系统地图，导航
function openMap(address) {
  //  解析地址
  loadBmap(() => {
    new BMap.Geocoder().getPoint(address, res => {
      plus.geolocation.getCurrentPosition(
        function (position) {
          const currentLon = position.coords.longitude;
          const currentLat = position.coords.latitude;

          let dst = new plus.maps.Point(res.lng, res.lat);
          let src = new plus.maps.Point(currentLon, currentLat);

          plus.maps.openSysMap(dst, "导航", src); // 调用系统地图显示
        },
        function (e) {
          plus.nativeUI.toast("异常:" + e.message);
        }
      );
    });
  });
}

// 拍照
function photo(callback) {
  const cmr = plus.camera.getCamera();
  cmr.captureImage(
    function (p) {
      //alert(p);//_doc/camera/1467602809090.jpg
      plus.io.resolveLocalFileSystemURL(
        p,
        function (entry) {
          //alert(entry.toLocalURL());//file:///storage/emulated/0/Android/data/io.dcloud...../doc/camera/1467602809090.jpg
          //alert(entry.name);//1467602809090.jpg
          const path = plus.io.convertLocalFileSystemURL(p);
          compressImage(path, entry, callback);
        },
        function (e) {
          plus.nativeUI.toast("读取拍照文件错误：" + e.message);
        }
      );
    },
    function (e) { },
    {
      filename: "_doc/camera/",
      index: 1
    }
  );
}

//压缩图片
function compressImage(url, file, callback) {
  const name = `_doc/upload/${file.name}`; //_doc/upload/F_ZDDZZ-1467602809090.jpg
  plus.zip.compressImage(
    {
      src: url, //src: (String 类型 )压缩转换原始图片的路径
      dst: name, //压缩转换目标图片的路径
      quality: 20, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
      overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
    },
    function (event) {
      //uploadf(event.target,pid);
      //event.target获取压缩转换后的图片url路
      //filename图片名称
      let img = new Image();
      img.src = url;
      img.onload = function () {
        let that = this;
        //获取照片方向角属性，用户旋转控制 ,判断当前图片是否需要做旋转操作。
        EXIF.getData(img, function () {
          /**
           * 图片的旋转方向信息
           * 1、图片没有发生旋转
           * 6、顺时针90°
           * 8、逆时针90°
           * 3、180° 旋转
           */
          let base64 = getBase64Image(that, EXIF.getTag(this, "Orientation"));
          let bitData = base64.replace("data:image/png;base64,", "");
          callback(file.name, base64, bitData);
          // 删除文件
          file.remove(
            function () {
              console.log("删除成功");
            },
            function () {
              console.log("删除失败");
            }
          );
        });
      };
    },
    function (error) {
      plus.nativeUI.toast("压缩图片失败");
    }
  );
}

// 获取 base64 图片数据
//将图片压缩转成base64
function getBase64Image(img, orientation) {
  let width = img.width;
  let height = img.height;
  // 1 - 0度
  // 6 - 90度
  // 8 - -90度
  // 3 - 180度
  const ANGEL = {
    "1": "0",
    "3": "180",
    "6": "90",
    "8": "-90"
  };
  //绘制图形
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width; /*设置新的图片的宽度*/
  canvas.height = height; /*设置新的图片的长度*/
  if (orientation == "6") {
    // 旋转大小
    canvas.width = height;
    canvas.height = width;

    ctx.translate(height, 0);
    //清空画布指定像素
    ctx.clearRect(-width, -height, width, height);
    // 画布旋转 90度
    ctx.rotate(ANGEL[orientation] * Math.PI / 180); //把画布旋转90度
    ctx.fillRect(width, height, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height); /*绘图*/
  return canvas.toDataURL("image/jpeg", 0.5);
}

function pageBack(mui) {
  // 退出
  let backButtonPress = 0;
  // 区分 mui.back 方法
  mui.back = function (event) {
    backButtonPress++;
    if (backButtonPress > 1) {
      plus.runtime.quit();
    } else {
      plus.nativeUI.toast("再按一次退出应用");
    }
    setTimeout(function () {
      backButtonPress = 0;
    }, 1000);
    return false;
  };
}

function getQuery(mui, name) {
  const str = location.search.replace("?", "");
  const obj = {};
  const arr = str.split("&");
  const len = arr.length;

  if (len > 0) {
    for (let i = 0; i < len; i++) {
      const tempArr = arr[i].split("=");
      if (tempArr.length === 2) {
        obj[tempArr[0]] = tempArr[1];
      }
    }
  }

  let queryValue = name ? obj[name] : obj;
  // 如果是支持plus
  if (mui.os.plus) {
    const pw = plus.webview.currentWebview();
    queryValue = pw[name];
  }

  return queryValue;
}

// 图片预览
function imagePreview(mui, src, deleteFunc) {
  const popup = document.createElement("div");
  const id = `fix-popup-${new Date().getTime()}`;

  let html = `<div class="image-view-wrap"><img class="mui-media-object" src="${src}"></div>`;

  if (deleteFunc) {
    html += `<div class="image-options"><a href="javascript:;" class="opt-btn" data-action="delete">删除</a></div>`;
  }

  html += `<div class="popup-backdrop"></div>`;

  // 设置id
  popup.setAttribute("id", id);
  popup.setAttribute("class", "fix-popup");
  popup.innerHTML = html;
  document.body.appendChild(popup);

  // 监听弹窗
  popup.addEventListener("tap", function (e) {
    const targetClass = e.target.getAttribute("class");
    // 如果不是操作元素
    if (targetClass.indexOf("opt-btn") === -1) {
      popup.parentNode.removeChild(popup);
    }
  });

  // 监听删除
  mui(".fix-popup").on("tap", ".opt-btn", function (e) {
    e.stopPropagation();
    const action = this.getAttribute("data-action");
    switch (action) {
      case "delete":
        {
          mui.confirm("确认要删除图片？", "提示", ["是", "否"], function (e) {
            if (e.index == 0) {
              deleteFunc().then(() => {
                popup.parentNode.removeChild(popup);
              });
            } else {
              popup.parentNode.removeChild(popup);
            }
          });
        }
        break;
    }
  });
}

// 检索柜号
function checkContainerNo(ContainerNo) {
  const unicodetbs = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  // 转换成小写
  ContainerNo = ContainerNo.toLowerCase().replace(/\s/g, "");
  // 如果位数少于 1位
  if (ContainerNo.length != 11) {
    return false;
  }

  let b = 0;
  let c = 0;

  for (var i = 0; i < 10; i++) {
    let s = ContainerNo.charAt(i);
    b = unicodetbs.indexOf(s);
    c += Math.round(Math.pow(2, i)) * b;
  }

  if ((c % 11) % 10 != ContainerNo.charAt(10)) {
    return false;
  } else {
    return true;
  }
}

// 获取手持端信息
function getDeviceInfo() {
  return {
    imei: plus.device.imei, //国际移动设备身份码
    imsi: plus.device.imsi, //国际移动用户识别码
    model: plus.device.model, //设备的型号
    vendor: plus.device.vendor, //设备的生产厂商
    uuid: plus.device.uuid //设备的唯一标识
  };
}
// 更新版本
function update(mui) {
  plus.runtime.getProperty(plus.runtime.appid, function (inf) {
    var current_version = inf.version;
    var url = severUlr + "version/gainApkVersion";
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      //苹果手机
      mui.ajax({
        type: "get",
        dataType: "json",
        url: "https://itunes.apple.com/lookup?id=111030274", //获取当前上架APPStore版本信息
        data: {
          id: 111030274 //APP唯一标识ID
        },
        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        success: function (data) {
          mui.each(data, function (i, norms) {
            mui.each(norms, function (key, value) {
              mui.each(value, function (j, version) {
                if (j == "version") {
                  if (version > current_version) {
                    console.log("发现新版本:V" + version);
                    document.location.href =
                      "https://itunes.apple.com/cn/app/san-gu-hui/id111030274?mt=8"; //上新APPStore下载地址
                  }
                }
              });
            });
          });
          return;
        }
      });
    } else if (/android/.test(ua)) {
      mui.ajax(url, {
        data: {
          apkVersion: current_version
        },
        dataType: "json",
        type: "POST",
        timeout: 10000,
        success: function (data) {
          if (data.success) {
            mui.toast("发现新版本:V" + data.data.apkVersion); //获取远程数据库中上新andriod版本号
            var dtask = plus.downloader.createDownload(
              data.data.apkUrl,
              {},
              function (d, status) {
                if (status == 200) {
                  plus.nativeUI.toast("正在准备环境，请稍后！");
                  plus.runtime.install(d.filename); // 自动安装apk文件
                } else {
                  console.log("版本更新失败:" + status);
                }
              }
            );
            dtask.start();
          } else {
            console.log("当前版本号已是最新");
            return;
          }
        },
        error: function (xhr, type, errerThrown) {
          mui.toast("网络异常,请稍候再试");
        }
      });
    }
  });
}

export {
  getQuery,
  pageBack,
  goLogin,
  watchLocation,
  isLogin,
  callPhone,
  openMap,
  photo,
  imagePreview,
  checkContainerNo,
  getDeviceInfo,
  update
};
