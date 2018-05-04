import config from '../config';
// 动态加载 js 
function loadScript(url, callback) {
  let head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onload = script.onreadystatechange = function() {
    if ((!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
      callback && callback();
      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null;
      if (head && script.parentNode) {
        head.removeChild(script);
      }
    }
  };
  head.insertBefore(script, head.firstChild);
};

// 加载 bmap
function loadBmap(callback) {
  const t = new Date().getTime()
  const url = `http://api.map.baidu.com/getscript?v=2.0&ak=${config.baiduAK}&services=&t=${t}`
  // 如果已经加载过 baidu ak
  if (window.BMap) {
    callback();
  } else {
    loadScript(url, callback)
  }
}

export {
  loadScript,
  loadBmap
}