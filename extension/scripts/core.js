function get_spaces_for_string(str){
  rtn="";
  i=7;
  while(i>str.length*2){
	i--;
	rtn += "";
  }
  return rtn;
}


var TBBase = {
  current_tab: null,
  counter: null,
  start: function() {
	console.log("TBBStarted");
	TBBase.set_badge_color();
	chrome.tabs.onUpdated.addListener(TBBase.update);
	chrome.tabs.onSelectionChanged.addListener(TBBase.update);
	//chrome.windows.onFocusChanged.addListener(TBBase.update);
  },
  get_count: function(url, callback){
	var count_url = "http://urls.api.twitter.com/1/urls/count.json?url=%url%";
	var to_replace={
	  '%url%': url
	}
	$.each(to_replace, function(k,v){
	  count_url = count_url.replace(k, v)
	});

	$.ajax({
	  url: count_url,
	  type: "GET",
	  dataType: "json",
	  success: function(data, status_message, request){
		var count=parseInt(data.count);
		console.log("Count for this page is \""+count+"\"");
		if(count){
		  if(count>=1000000){
			count=Math.round(count/1000000)+"M";
		  }
		  else if(count>=10000){
			  count=Math.round(count/1000)+"k";
		  }
		}
		TBBase.counter=count;
		callback(count);
	  },
	  error:  function(){
		return "Oops!";
	  }
	});
  },
  set_badge_text: function(text, tab_id)
  {	
	if (parseInt(text) == 0) text = "";
	obj = {
	  "text":get_spaces_for_string(text+"")+text,
	}
	if(tab_id){
	  obj.tabId = tab_id;
	}
	chrome.browserAction.setBadgeText(obj);
  },
  set_badge_color: function(tabid)
  {
	obj = {color: [149,200,62,255]}
	chrome.browserAction.setBadgeBackgroundColor(obj);
  },
  update: function(tab_id){
	chrome.tabs.get(tab_id,function(tab){
	  var url = tab.url;
	  chrome.windows.get(tab.windowId, function(window){
		chrome.tabs.getSelected(window.id, function(tab){
		  TBBase.current_tab = tab;
		  TBBase.get_count(url, TBBase.set_badge_text);
		  var count = TBBase.counter;
		  console.log("Count for this page before \""+count+"\"");
		  console.log("Count for this page rounded \""+count+"\"");
		});
	  })
	});
  },
  popup: function(tab){
	console.log("My popup");
	console.log(window);
	var message = tab.title;
	window.close();
	var widgetUrl = 'http://twitter.com/share?count=vertical';
	widgetUrl += '&original_referer='+encodeURIComponent(tab.ref);
	widgetUrl += '&text='+encodeURIComponent(message);
	widgetUrl += '&url='+encodeURIComponent(tab.url);
//	widgetUrl += '&via='+encodeURIComponent('');
	var W = 800,
    d = 400;
    var Z = screen.height;
    var Y = screen.width;
    var X = Math.round((Y / 2) - (W / 2));
    var c = 0;
	var p = window.open(widgetUrl,'wrttn_tweet_button',"left=" + X + ",top=" + c + ",width=" + W + ",height=" + d + ",personalbar=no,toolbar=no,scrollbars=yes,location=yes,resizable=yes");
    if (p) {
      p.focus();
    }
	TBBase.get_count(tab.url, TBBase.set_badge_text);
  },
  search_tweets: function(query){
	var loading = $('<li class="loading">&#x267B;</li>');
	$('#statuses').html(loading);
	var search_url="http://search.twitter.com/search.json?rpp=5&q=%query%".replace("%query%", query);
	console.log(search_url);
	//var search_url="http://search.twitter.com/search.json?rpp=7&q=%query%";
	console.log("Trieng to load "+ search_url);
	
	TBBase.get_count(query, function(count){
	  $("#counter").html(count);
	});
	$.ajax({
	  url: search_url,
	  type: "GET",
	  dataType: "json",
	  success: function(data, status_message, request){
		console.log("Data loaded");
		console.log(data);
		TBBase.update_statuses(data);
		console.log("Statuses updated");
	  },
	  error:  function(){
		$('#statuses').html("<li class=\"error\">There's been an error</li>");
	  }
	});
  },
  popup_init: function(){
	console.log('Popup init');
	chrome.tabs.getSelected(window.id, function(tab){
	  console.log("Try to find for "+tab.url);
	  $("#share-this").click(function(){
		console.log("ReTweet link");
		TBBase.popup(tab);
	  });
	  $(".refresh").click(function(){
		TBBase.search_tweets(tab.url);
	  });
	  TBBase.search_tweets(tab.url);
	});
	$("#search-input").keypress(function(event){
	  console.log("Enter");
	  if(event.keyCode=='13')TBBase.update_search();
	});
	$('#search-input').keydown(function(){
	  TBBase.update_search();
	});
			  //chrome.browserAction.onClicked.addListener(function(tab){
			//TBBase.popup(tab);
		  //});
  },
  update_search: function(){
	TBBase.search_tweets(encodeURIComponent($("#search-input").val()));
  },
  update_statuses: function(data){
	var to_update="";
	if(data.results.length>=1){
	  $.each(data.results, function(k,v){
		to_update +="<li class=\"hentry u-"+v.from_user+" status last-on-refresh\" id=\"status_"+v.id+"\">\
<span class=\"thumb vcard author\"><a href=\"http://twitter.com/"+v.from_user+"\" class=\"tweet-url profile-pic url\" target=\"_blank\"><img alt=\""+v.from_user+" class=\"photo fn\" height=\"48\" src=\""+v.profile_image_url+"\" width=\"48\"></a></span>  <span class=\"status-body\">\<span class=\"status-content\"><strong class=\"username\"><a href=\"http://twitter.com/"+v.from_user+"\" class=\"tweet-url screen-name\" target=\"_blank\">"+v.from_user+"</a></strong><span class=\"actions\"><div><a id=\"status_star_"+v.id+"\" class=\"fav-action non-fav\" title=\"favorite this tweet\">&nbsp;&nbsp;</a></div></span><span class=\"entry-content\">"+v.text+"</span></span><span class=\"meta entry-meta\" data=\"{}\"> <a class=\"entry-date\" rel=\"bookmark\" href=\"http://twitter.com/"+v.from_user+"/status/"+v.id+"\" target=\"_blank\"><span class=\"published timestamp\" data=\"{time:'"+v.created_at+"'\">"+v.created_at+"</span></a></span><ul class=\"actions-hover\"><li><span class=\"reply\"><span class=\"reply-icon icon\"></span><a href=\"/?status=@"+v.from_user+"&amp;in_reply_to_status_id="+v.id+"&amp;in_reply_to="+v.from_user+"\" title=\"reply to "+v.from_user+"\" target=\"_blank\">Reply</a></span></li><li><span class=\"retweet-link\"><span class=\"retweet-icon icon\"></span><a title=\"Retweet\" href=\"#\">Retweet</a></span></li></ul><ul class=\"meta-data clearfix\"></ul></span></li>";
	  });
	  $('#statuses').html(to_update);
	}
	else {
	  $('#statuses').html("<li class=\"error\">Ooops! Nothing found &#x267B;</li>");
	}
  }
}
