// TekMap by comunicatek.com  under the mit license.
// Author:  Dani Prados
// http://code.comunicatek.com
// version 0.9
(function ($, google, window) {
	"use strict";
  //
  // private function for debugging
  //
	var previous = null;

	function private_marker(p, map) {
		var point = new google.maps.LatLng(p.lat, p.lng), base, size, origin,
			options = {position : point, map : map, draggable : p.draggable}, marker, ico,
			infowindow, f;
		if(p.options) {
			$.extend(options, options, p.options);			
		}			

		if (p.icon) {
			if (typeof p.icon === "object") {
				size = new google.maps.Size(p.icon.size[0], p.icon.size[0]);
				if (p.icon.base) {
					base = new google.maps.Point(p.icon.base[0], p.icon.base[1]);
				} else {
					base = new google.maps.Point(0, 0);
				}
				origin = new google.maps.Point(p.icon.origin[0], p.icon.origin[1]);
				ico = new google.maps.MarkerImage(p.icon.url, size, base, origin);
				$.extend(options, options, { icon : ico});
			} else {
				$.extend(options, options, { icon : p.icon});
			}
		}
		if (p.shadow) {
			if (typeof p.shadow === "object") {
				size = new google.maps.Size(p.shadow.size[0], p.shadow.size[0]);
				if (p.shadow.base) {
					base = new google.maps.Point(p.shadow.base[0], p.shadow.base[1]);
				} else {
					base = new google.maps.Point(0, 0);
				}
				origin = new google.maps.Point(p.shadow.origin[0], p.shadow.origin[1]);
				ico = new google.maps.MarkerImage(p.shadow.url, size, base, origin);
				$.extend(options, options, {shadow : ico});
			} else {
				$.extend(options, options, {shadow : p.shadow});
			}
		}
		marker = new google.maps.Marker(options);
		if (p.key) {
			$.extend(marker, {tekkey : p.key});
			$.fn.TekMap.markersAssoc[p.key] = marker;
		}
		$.fn.TekMap.markers.push(marker);

		if (p.infowindow) {
			infowindow = new google.maps.InfoWindow({ content : p.infowindow});
			google.maps.event.addListener(marker, 'click', function () {
				infowindow.open(map, marker);
				if (p.infowindowclosePrevious) {
					if (previous && previous !== infowindow) { previous.close(); }
					previous = infowindow;
				}
			});
		}
		f = p.drag || $.noop;
		if (p.draggable) {
			google.maps.event.addListener(marker, "dragend", function () {
				f(marker);
			});
		}
		if(p.deferred){
			p.deferred.resolve(point);
		}
		$.fn.TekMap.bound.extend(point);
	}

	function tekshow(i, elem) {
		var o = $.fn.TekMap.opts,
			myOptions = o.mapoptions,
			latlng,
			map,
			$maps = $(elem), dataLat, dataLng,dataMarkers;

		dataLat = $maps.data("lat");
		if(dataLat)	{
			o.lat = dataLat;
		}
		dataLng = $maps.data("lng");
		if(dataLng)	{
			o.lng = dataLng;
		}
		dataMarkers = $maps.data("markers");
		if(dataMarkers)	{
			o.markers = dataMarkers;
		}		


		latlng = new google.maps.LatLng(o.lat, o.lng);
		myOptions.center = latlng;
		map = new google.maps.Map(elem, myOptions);

		if (o.click) {
			google.maps.event.addListener(map, "click", o.click);
		}

		function show_markers() {
			var j;
			for (j = 0; j < o.markers.length; j += 1) {
				private_marker(o.markers[j], map);
			}
		}
		show_markers();

		$maps.data("tekmap", map);
	}

	function debug($obj) {
		if (window.console && window.console.log) {
			window.console.log('tekmap initialized' + $obj);
		}
	}

  //
  // plugin definition
  //
	$.fn.TekMap = function (options) {
		debug(this);
		// build main options before element iteration
		$.fn.TekMap.opts = $.extend({}, $.fn.TekMap.defaults, options);
		// iterate and reformat each matched element
		$.fn.TekMap.markers = [];
		$.fn.TekMap.markersAssoc = {};
		$.fn.TekMap.bound = new google.maps.LatLngBounds();
		return this.each(tekshow);
	};

	$.fn.TekfitBounds = function () {
		this.each( function(){
			var map = $(this).data("tekmap");
			map.fitBounds($.fn.TekMap.bound);
		});
		//return this.each(tekshow);
	};	

	$.fn.TekMarker = function (p) {
		var geo, self = this;

		$.fn.TekMap.p = $.extend({}, $.fn.TekMarker.defaults, p);
		if (p.addres) {
			geo = new google.maps.Geocoder();

			geo.geocode({'address' : p.addres}, function (result, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					$.each(result, function (i, result) {
						$.fn.TekMap.p.lat = result.geometry.location.lat();
						$.fn.TekMap.p.lng = result.geometry.location.lng();
						self.each($.fn.TekMarker.marker);
					});
				} else {
					p.deferred.reject();
				}
			});
			return (this);
		} else {
			return (this.each($.fn.TekMarker.marker));
		}
	};

	$.fn.TekMarker.marker = function () {
		var p = $.fn.TekMap.p,
			map = $.fn.TekMap.map;
		if (!map) {
			map = $(this).data("tekmap");
		}
		private_marker(p, map);
	};

	$.fn.TekMarker.trigger = function (key, name, c) {
		if ($.fn.TekMap.markersAssoc[key]) {
			google.maps.event.trigger($.fn.TekMap.markersAssoc[key], name);
			if (typeof c === "function") {
				c($.fn.TekMap.markersAssoc[key]);
			}
		}
	};

	$.fn.TekMarker.remove = function (key) {
		if ($.fn.TekMap.markersAssoc[key]) {
			$.fn.TekMap.markersAssoc[key].setMap(null);
			delete $.fn.TekMap.markersAssoc[key];
		}
	};

	$.fn.TekMap.markers = [];

  //
  // plugin defaults
  //
	$.fn.TekMap.defaults = {
		lat : 42,
		lng : 3,
		click : $.noop,
		mapoptions : {
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		},
		markers : []
		/*{    lat: 42, lng: 3,  draggable:false, infowindow:"<b>Hello</b>" }*/
	};

	$.fn.TekMarker.defaults = { draggable : false, infowindowclosePrevious : true };
//
// end of closure
//
}(jQuery, google, window));