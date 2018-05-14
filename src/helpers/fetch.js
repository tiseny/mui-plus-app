import mui from './middleware';
import { getState, clearState } from './state';
import { goLogin } from './util';
import config from '../config';

const LOGIN_URL = 'login.html'

// 参数 序列化
function param(paramData) {

  const escape = window.encodeURIComponent;

  if(!paramData || typeof paramData !== 'object'){
    return ''
  }

  const params = Object.keys(paramData).map(key => {
    const val =  paramData[key];
    return `${escape(key)}=${val === undefined || val === null ? '' : escape(val)}`
  });
  
  return params.join('&');
}

// 请求地址
function getApiPath(url, paramData) {
  const requestParams = paramData || {};
  requestParams.t = (new Date()).getTime();

  let params = param(requestParams);

  if (params) {
    params = url.indexOf('?') === -1 ? `?${params}` : `&${params}`
  }

  return `${url}${params}`
}


function fetch(url, params = {header: null, body: null}, method, hasToken = true) {

	method = method.toUpperCase();

	let header = params ? params.header : {}
	let body = params ? params.body : null

	const NODE_ENV = document.title || ''
	// 如果 url 不是 http 开头, 并且是 
	if (NODE_ENV == 'development') {
		url = url.substr(url.indexOf('/api/'))
		//url = `${config.url}${url}`
	}

	url = getApiPath(url, header)

	let headers = {
		'Content-Type': method == 'UPLOAD' ? "multipart/form-data" : 'application/json'
	}
	// 如果需要 token, 除了登录注册以外.
	if (hasToken) {
		Object.assign(headers, {
			"api-token-sign": getState('token')
		})
	}
	// 如果是上传文件。 数据改成文件流形式
	if (method == 'UPLOAD') {
		let formData = new FormData();
		formData.append('file', body)
		body = formData
		// 重置 method
		method = 'post'
	}

	return new Promise((resolve, reject) => {
		mui.ajax(url, {
			data: body,
			dataType: 'json',						//服务器返回json格式数据
			type: method,								//HTTP请求类型
			timeout: 10000,							//超时时间设置为10秒；
			headers: headers,	              
			success:function(data){
				console.log(JSON.stringify(data))
				// 如果
				// 登录失效
				if (data && data.Code === '000002') {
					// 提醒
					mui._toast(data.Msg)
					setTimeout(() => {
						goLogin(mui);
					},2000)
				} else {
					resolve({
						result: data ? data.IsSuccess : false,
						data: data ? data.Data : null,
						msg: data ? data.Msg : ''
					})	
				}
			},
			error:function(xhr,type,errorThrown){
				console.log(JSON.stringify(xhr))
				//异常处理；
				mui._toast('系统异常');

				resolve({
					result: false,
					data: null
				})
			}
		});
	})
}

export default fetch;