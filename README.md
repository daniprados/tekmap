<h1>TekMap</h1>
	<div class="txt-contingut"><p><strong>Objective:</strong></p>
<p>Create a plugin to simplify the integration of maps googlemaps (R) with the V3 API. The plugin must return the jQuery object and apply the maps to all selected elements. Why version 3? The second is outdated and simple google has stopped supporting it.</p>
<p>&nbsp;</p>
<p><strong>The plugin:</strong></p>
<p>Basic Call:</p>
<p>$ ("# Map"). TekMap ();</p>
<p>is not very useful but it creates a map centered. But we can do more interesting things such as adding bookmarks.</p>
<pre>$(&ldquo;#map&rdquo;).TekMap({
       lat: 42.2,
    lng: 3.2,
    mapoptions : {
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scrollwheel: false
        },
    markers : [{    lat: 42.2, lng: 3.2,  draggable:false, infowindow:"<strong>Hello</strong>" }]
 }
)</pre>
<p>
	Added  html tag initialization : 
	<pre>
		 &lt;div class=&quot;map&quot; data-lat=&#39;42.99624282178582&#39; data-lng=&#39;1.933349609375&#39; data-markers=&#39;[{&quot;lat&quot;:42.99624282178582,&quot;lng&quot;:1.933349609375,&quot;draggable&quot;:false,&quot;infowindow&quot;:&quot;Tekmap demo by Comunicatek!&quot;}]&#39;&gt;&lt;/div&gt;
	</pre>

	and  then

	<pre><p>$ (".map"). TekMap ();</p></pre>

</p>

More info at <a href="http://code.comunicatek.com/en/tekmap.html">here</a>.
