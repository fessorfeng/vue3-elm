/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = '//elm.cangdu.org';
let routerMode = 'hash';
let imgBaseUrl = '';
// localapi, proapi 仓库没有这两个变量
let localapi = '';
let proapi = '';

if (process.env.NODE_ENV == 'development') {
    // imgBaseUrl = '/img/';
    imgBaseUrl = '//elm.cangdu.org/img/';

}else if(process.env.NODE_ENV == 'production'){
	baseUrl = '//elm.cangdu.org';
    imgBaseUrl = '//elm.cangdu.org/img/';
}

export {
	baseUrl,
	routerMode,
  imgBaseUrl,
  localapi,
  proapi
}
