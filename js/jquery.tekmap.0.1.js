//
// create closure
//
(function($) {
  //
  // plugin definition
  //
	$.fn.TekMap = function(options) {
		debug(this);
		// build main options before element iteration
		$.fn.TekMap.opts = $.extend({}, $.fn.TekMap.defaults, options);
		// iterate and reformat each matched element
		return this.each(tekshow);
		
	 };
	 
	  function tekshow() {
		var o = $.fn.TekMap.opts;
		var myOptions= o.mapoptions;
		var latlng = new google.maps.LatLng(o.lat, o.lng);
		myOptions.center = latlng;
		var map = new google.maps.Map(this,myOptions);
		$maps =$(this);
		for (var j = 0; j < o.markers.length; j++){
			_marker(o.markers[j],map);
		}
		$maps.data("tekmap",map);
	 };
	 
	 $.fn.TekMarker = function(p,map){
		 $.fn.TekMap.p = p;
		 $.fn.TekMap.map = map;
		return(this.each($.fn.TekMarker.marker));
	 };
	 
	 $.fn.TekMarker.marker = function(){
		var p = $.fn.TekMap.p;
		var map = $.fn.TekMap.map;
		if(!map){
			var map = $(this).data("tekmap");
		}
		_marker(p,map);
		//google.maps.event.addListener(marker, "dragend",mou);

	 }
	 
	 function _marker(p,map){
		var point = new google.maps.LatLng(p.lat,p.lng);
		var marker = new google.maps.Marker({position:point,map:map,draggable: p.draggable});
		if(p.infowindow){
			var infowindow = new google.maps.InfoWindow({
				content: p.infowindow
			 });
			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});		
		}
	 }
	 
  //
  // private function for debugging
  //
  function debug($obj) {
    if (window.console && window.console.log)
      window.console.log('tekmap initialized');
  };

  //
  // plugin defaults
  //
  $.fn.TekMap.defaults = {
    lat: 42,
	lng: 3,
	mapoptions : {
		  zoom: 12,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  scrollwheel: false
		},
	markers : [
				{    lat: 42, lng: 3,  draggable:false, infowindow:"<b>Hello</b>" }
			],
    background: 'yellow'
  };
//
// end of closure
//
})(jQuery);