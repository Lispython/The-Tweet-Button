var twttr=window.twttr||{};
(function(){
  if(!twttr.widgets){
	twttr.widgets={}
  }
  if(!twttr.widgets.host){
	twttr.widgets.host="platform{i}.twitter.com"
  }
  if(typeof twttr.widgets.ignoreSSL==="undefined"){
	twttr.widgets.ignoreSSL=false
  }
  function T(W){
	var Y=M(W);
	var X=twttr.widgets.host;
	var V=X.replace("{i}",G++);
	if(G==3){
	  G=0
	}
	return Y+"://"+V
  }
  function M(V){
	return(window.location.protocol.match(/s\:$/)||V)&&!twttr.widgets.ignoreSSL?"https":"http"
  }
  function S(Z){
	var W;
	for(var V in Z){
	  W=N.apply(this,V.split("."));
	  for(var X=0,Y;(Y=W[X]);X++){
		new Z[V](Y).render()}}
  }
  function I(a){
	var X;
	var Y;
	var W=function(){
	  if(document.readyState=="complete"){
		X()}
	};
	var V;
	var Z=function(){
	  try{
		document.documentElement.doScroll("left");
		X()
	  }
	  catch(b){}
	};
	if(window.addEventListener){
	  X=function(){
		if(!Y){
		  Y=true;
		  a()
		}
		window.removeEventListener("DOMContentLoaded",X,false);
		window.removeEventListener("load",X,false)
	  };
	  window.addEventListener("DOMContentLoaded",X,false);
	  window.addEventListener("load",X,false)
	}
	else{
	  if(window.attachEvent){
		V=window.setInterval(Z,13);
		X=function(){
		  if(!Y){
			Y=true;a()
		  }
		  window.clearInterval(V);
		  window.detachEvent("onreadystatechange",W);
		  window.detachEvent("onload",X)};window.attachEvent("onreadystatechange",W);window.attachEvent("onload",X)}}}
  function N(V,Z){
	var Y,a=[],W,X;
	try{
	  if(document.querySelectorAll){
		a=document.querySelectorAll(V+"."+Z)
	  }else{
		if(document.getElementsByClassName){
		  Y=document.getElementsByClassName(Z);
		  for(W=0;(X=Y[W]);W++){
			if(X.tagName.toLowerCase()==V){
			  a.push(X)}}
		}else{
		  Y=document.getElementsByTagName(V);
		  var c=new RegExp("\\b"+Z+"\\b");
		  for(W=0;(X=Y[W]);W++){
			if(X.className.match(c)){
			  a.push(X)}}}}
	}
	catch(b){}
	return a
  }
  function Q(V){
	return encodeURIComponent(V).replace(/\+/g,"%2B")
  }
  function D(V){
	return decodeURIComponent(V).replace(/\+/g," ")
  }
  function J(X){
	var W=[];
	for(var V in X){
	  if(X[V]!==null&&typeof X[V]!=="undefined"){
		W.push(Q(V)+"="+Q(X[V]))}
	}
	return W.sort().join("&")
  }
  function P(Y){
	var a={},X,Z,W,V;
	if(Y){
	  X=Y.split("&");
	  for(V=0;(W=X[V]);V++){
		Z=W.split("=");
		if(Z.length==2){
		  a[D(Z[0])]=D(Z[1])}
	  }
	}
	return a
  }
  function F(W,X){
	for(var V in X){
	  W[V]=X[V]
	}
	return W
  }
  function R(W){
	var V;
	if(W.match(/^https?:\/\//)){
	  return W
	}else{
	  V=location.host;
	  if(location.port.length>0){
		V+=":"+location.port
	  }
	  return[location.protocol,"//",V,W].join("")}
  }
  function A(){
	var V=document.getElementsByTagName("link");
	for(var W=0,X;(X=V[W]);W++){
	  if(X.getAttribute("rel")=="canonical"){
		return R(X.getAttribute("href"))}
	}
	return null
  }
  function K(X){
	var Y=[];
	for(var W=0,V=X.length;W<V;W++){
	  Y.push(X[W])
	}
	return Y
  }

  function C(){
	var W=document.getElementsByTagName("a"),c=document.getElementsByTagName("link"),V=/\bme\b/,Y=/^https?\:\/\/(www\.)?twitter.com\/([a-zA-Z0-9_]+)$/,b=K(W).concat(K(c)),a,e,X;
	for(var Z=0,d;(d=b[Z]);Z++){
	  e=d.getAttribute("rel");
	  X=d.getAttribute("href");
	  if(e&&X&&e.match(V)&&(a=X.match(Y))){
		return a[2]
	  }
	}
  }

  var E=decodeURIComponent(document.title),L=location.href,G=0,U={
	en:{
	  vertical:[55,62],
	  horizontal:[110,20],
	  none:[55,20]},
	es:{vertical:[64,62],
		horizontal:[110,20],
		none:[64,20]},
	ja:{vertical:[80,62],
		horizontal:[130,20],
		none:[80,20]},
	de:{vertical:[67,62],
		horizontal:[110,20],
		none:[67,20]},
	fr:{vertical:[65,62],
		horizontal:[110,20],
		none:[65,20]}
  },
  H={
	en:1,
	es:1,
	ja:1,
	fr:1,
	de:1
  },
  B={
	vertical:1,
	horizontal:1,
	none:1
  };
  twttr.TweetButton=function(Z){
	this.originElement=Z;
	var W=Z.href.split("?")[1],Y=W?P(W):{},V=Y.count||Z.getAttribute("data-count"),X=Y.lang||Z.getAttribute("data-lang");
	this.text=Y.text||Z.getAttribute("data-text")||E;
	this.via=Y.via||Z.getAttribute("data-via")||C();
	this.url=Y.url||Z.getAttribute("data-url")||A()||L;
	this.statusID=Y.status_id||Z.getAttribute("data-status-id");
	this.related=Y.related||Z.getAttribute("data-related");
	if(!B[V]){
	  V="horizontal"
	}
	this.count=V;
	if(!H[X]){
	  X="en"
	}
	this.lang=X
  };
  F(twttr.TweetButton.prototype,{
	parameters:function(){
	  var V;
	  if(this.statusID){
		V={
		  status_id:this.statusID
		}
	  }
	  else{
		V={
		  text:this.text,
		  url:this.url,
		  via:this.via,
		  related:this.related,
		  count:this.count,
		  lang:this.lang
		}
	  }
	  V._=(new Date()).getTime();
	  return J(V)
	},
	render:function(){
	  if(!twttr.TweetButton.fragment){
		twttr.TweetButton.fragment=document.createElement("div");
		twttr.TweetButton.fragment.innerHTML='<iframe allowtransparency="true" frameborder="0" scrolling="no" tabindex="0" class="twitter-share-button twitter-count-'+this.count+'"></iframe>'
	  }
	  var W=twttr.TweetButton.fragment.firstChild.cloneNode(false);
	  W.src=T()+"/widgets/tweet_button.html?"+this.parameters();
	  var X=U[this.lang][this.count];
	  W.style.width=X[0]+"px";
	  W.style.height=X[1]+"px";
	  var V=this.originElement.parentNode;
	  if(V){
		V.replaceChild(W,this.originElement)}
	}
  });
  var O={
	"a.twitter-share-button":twttr.TweetButton
  };
  S(O);
  I(function(){
	S(O)
  })
}());