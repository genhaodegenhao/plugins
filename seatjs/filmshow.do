




<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html;">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>快捷购票</title>
	<link rel="stylesheet" type="text/css" href="/css/global.css"/>
	<link rel="stylesheet" type="text/css" href="/css/layout.css">
    <link rel="stylesheet" type="text/css" href="/css/fast/fast.css">
    <script src="/js/jquery-1.8.3.min.js"></script>
    <script src="/js/common/template-native.js"></script>
    <script src="/js/common/json2.js"></script>
    <script src="/js/common/dateformat.js"></script>
    <script src="/js/fn.js"></script>
    <script type="text/javascript">
    	//查询影片排期列表数据
    	var path="";
    	//查询影片排期列表数据
		var queryShowData={
				"filmId":"",
				"cinemaId":304,
				"cinemaName":"北京CBD",
				"showDate":getDateYYYYMMDD(new Date()),
				"start":0,
				"num":500,
				"index":0,
				"showDateBox":"todayFilmShowBox" 
		};
		//查询影院列表配置数据
		var showCinemaOpts = {
				'hideEle':['showWraper'],
				'callback':'fastView.getFilmShowByCinema',
				'cityId':'8022251040',
				'cityName':'北京',
				'locCityId':'8022251040',
				'locCityName':'北京'
		};
		
		var filmId="20170504104302912547",
			scopeCinemaId="304",
			scopeCinemaName="北京CBD",
			scopeCityId="8022251040",
			scopeCityName="北京";
		/* var filmId="20170504104302912547",
		scopeCinemaId="",
		scopeCinemaName="",
		scopeCityId="",
		scopeCityName=""; */
			
		/* var queryShowData={
				"filmId":"",
				"cinemaId":"304",
				"cinemaName":"北京CBD",
				"showDate":"",
				"start":0,
				"num":500,
				"index":0,
				"showDateBox":"todayFilmShowBox"
		};
		//查询影院列表配置数据
		var showCinemaOpts = {
				'hideEle':['showWraper'],
				'callback':'fastView.getFilmShowByCinema',
				'cityId':"8022251040",
				'cityName':"北京",
				'locCityId':"8022251040",
				'locCityName':"北京"
		}; */
		/* 
		var FilmSessionData='';
		var fsdata=eval('('+FilmSessionData+')'); */
		
	</script>
</head>
<body>
	<input type="hidden" id="basePath" value="/" />
	<section id="showWraper">
    	<section id="filmShowHeader">
			<div class="header_nav_box">
				<div class="header_nav">
					<div class="back"><a href="javascript:window.history.back(-1);"><span class="back_img icon24 i400"></span></a></div>
					<span class="title fzl">战狼2</span>
					<div class="current_city fr" onclick="fastView.showCinemaListBySl();">
						<span class="icon24 i200" style="vertical-align:middle;"></span><span id="heaCinemaName"></span>
					</div>
					<!-- <div class="oper fzs" onclick="fastView.showCinemaListBySl()"><span class="oper_img icon24 i200"></span><span id="heaCinemaName" class="fzs"></span></div> -->
				</div>
			</div>
    	</section>
    	<div class="relative" style="height:44px;width:100%;">
	    	<div class="tbar" style="height:26px;z-index:1;width:100%;left:0; position: fixed;">
	    		<div class="">
					<div id="showDateBtnBox" class="btngroup"></div>
				</div>
			</div>
		</div>
		<!-- <div id="iconHelpBox">
			<ul id="iconHelp">
				<li>
					<div><span class="icon24 i401"></span><span class="ml6">全景声</span></div>
				</li>
				<li>
					<div><span class="icon24 i402"></span><span class="ml6">6FL 3D</span></div>
				</li>
				<li>
					<div><span class=" icon24 i403"></span><span class="ml6">IMAX</span></div>
				</li>
			</ul>
			<div class="clear"></div>
		</div> -->
		<section id="filmShowBox">
			<section id="todayFilmShowBox" class="show_list_box" data-index="0">
			</section>
			<section id="tomorrowFilmShowBox" class="show_list_box" data-index="1">
			</section>
		</section>
    </section>
    
	<script id="filmShowHeaderTem" type="text/html">
		<div class="header_nav_box">
		<div class="header_nav">
			<div class="back"><a href="javascript:window.history.back(-1);"><span class="back_img icon24 i400"></span></a></div>
			<div id="showDateBtnBox" class="btngroup">
				<a data-date="<#=querytoday#>" id="test" data-index="0" class="btn prl2 fzs current">今日<#=localtoday#></a><a data-date="<#=querytomorrow#>" data-index="1" class="btn prl2 fzs last ">明日<#=localtomorrow#></a>
			</div>
			<div class="oper fzs" onclick="fastView.showCinemaListBySl()"><span class="oper_img icon24 i200"></span><span id="heaCinemaName" class="fzs"><#=cinemaName#></span></div>
		</div>
		</div>
	</script>
    <script src="/js/common/history.js"></script>
    <script src="/js/cityandcinema/cityandcinema.js"></script>
    <script src="/js/filmshow/show2.js"></script>
</body>
</html>