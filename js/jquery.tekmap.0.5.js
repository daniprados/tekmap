// TekMap by comunicatek.com  under the mit license.
// Author:  Dani Prados
// http://code.comunicatek.com
(function($) {
	
  //
  // private function for debugging
  //
  
	 function _marker(p,map){
		var point = new google.maps.LatLng(p.lat,p.lng),base,size,origin;
		var options = {position:point,map:map,draggable: p.draggable};
		if(p.icon){
			if(typeof p.icon === "object"){
				size = new google.maps.Size(p.icon.size[0], p.icon.size[0]);
				if(p.icon.base){ 
					base = new google.maps.Point(p.icon.base[0],p.icon.base[1]); 
				} else { 
					base = new google.maps.Point(0,0);
				}
				origin = new google.maps.Point(p.icon.origin[0],p.icon.origin[1]); 				
				var ico = new google.maps.MarkerImage(p.icon.url,size,base,origin);
				$.extend(options,options, {icon:ico});
			}else{
				$.extend(options,options,{icon: p.icon});
			}
		}
		if(p.shadow){
			if(typeof p.shadow === "object"){
				size = new google.maps.Size(p.shadow.size[0], p.shadow.size[0]);
				if(p.shadow.base){ 
					base = new google.maps.Point(p.shadow.base[0],p.shadow.base[1]); 
				} else { 
					base = new google.maps.Point(0,0);
				}
				origin = new google.maps.Point(p.shadow.origin[0],p.shadow.origin[1]); 				
				var ico = new google.maps.MarkerImage(p.shadow.url,size,base,origin);
				$.extend(options,options, {shadow:ico});
			}else{
				$.extend(options,options,{shadow: p.shadow});
			}
		}
		var marker = new google.maps.Marker(options);
		$.fn.TekMap.markers.push(marker);
		if(p.infowindow){
			var infowindow = new google.maps.InfoWindow({
				content: p.infowindow
			 });
			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});		
		}
		var f = p.drag || $.noop;
		if(p.draggable){
			google.maps.event.addListener(marker, "dragend",function(){
					f(marker);
			});
		}
	 }

	  function tekshow() {
		var o = $.fn.TekMap.opts;
		var myOptions= o.mapoptions;
		var latlng = new google.maps.LatLng(o.lat, o.lng);
		myOptions.center = latlng;
		var map = new google.maps.Map(this,myOptions);
		if(o.click){
			google.maps.event.addListener(map, "click",o.click);	
		}
		var $maps =$(this);
		for (var j = 0; j < o.markers.length; j++){
			_marker(o.markers[j],map);
		}
		$maps.data("tekmap",map);
	 }
	 
	function debug($obj) {
		if (window.console && window.console.log){
			window.console.log('tekmap initialized');
		}
	}		  
		  
  //
  // plugin definition
  //
	$.fn.TekMap = function(options) {
		debug(this);
		// build main options before element iteration
		$.fn.TekMap.opts = $.extend({}, $.fn.TekMap.defaults, options);
		// iterate and reformat each matched element
		$.fn.TekMap.markers = [];
		return this.each(tekshow);
		
	 };
	 
 
	 $.fn.TekMarker = function(p){
		$.fn.TekMap.p = $.extend({}, $.fn.TekMarker.defaults, p);
		if(p.addres){
			var geo = new google.maps.Geocoder();
			var self = this;	
			geo.geocode({'address':p.addres}, function(result,status){
						if (status == google.maps.GeocoderStatus.OK) {
								$.each(result,function(i,result){
								$.fn.TekMap.p.lat = result.geometry.location.lat();
								$.fn.TekMap.p.lng = result.geometry.location.lng();
								self.each($.fn.TekMarker.marker);
							});
						}
				});
			return(this);
		}else { 
			return(this.each($.fn.TekMarker.marker));
		}
	 };
	 
	 $.fn.TekMarker.marker = function(){
		var p = $.fn.TekMap.p;
		var map = $.fn.TekMap.map;
		if(!map){
			map = $(this).data("tekmap");
		}
		_marker(p,map);
	 };
	 
 
  $.fn.TekMap.markers = [];

  //
  // plugin defaults
  //
  $.fn.TekMap.defaults = {
    lat: 42,
	lng: 3,
	click : jQuery.noop,
	mapoptions : {
		  zoom: 12,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  scrollwheel: false
		},
	markers : []
				/*{    lat: 42, lng: 3,  draggable:false, infowindow:"<b>Hello</b>" }*/
    
  };
  
  $.fn.TekMarker.defaults = {draggable:false  };
//
// end of closure
//
})(jQuery);