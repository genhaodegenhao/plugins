//判断移动端是否是安卓，ios设备
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

if (isAndroid) {
	alert("安卓");
} else if (isiOS) {
	alert("IOS");
}