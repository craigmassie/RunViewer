var maxkit = 0;
var walkdistance = 0;

google.maps.Map.prototype.fit = function(bounds){
	this.setCenter(bounds.getCenter(), this.getBoundsZoomLevel(bounds));
};

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

document.getElementById('fileInput').onchange = function () {
	document.getElementById('openwarn').remove();
	document.getElementById('legend').style.visibility='visible';
	document.getElementById('static').style.pointerEvents='auto';
	var f = this.value;
	f = f.replace(/.*[\/\\]/, '');

	var node = document.createElement("LI");
	var nodein = document.createElement("a");
	nodein.setAttribute('href', '#');
	var textnode = document.createTextNode(f); 
	nodein.appendChild(textnode);
	node.appendChild(nodein);
	var node2 = document.createElement("br");
	document.getElementById("options").prepend(node2); 
	document.getElementById("options").prepend(node);
	runpage();
  };

$(document).ready(function() {
	runpage();
});

function runpage(){
	
	var mapOptions = {
		disableDefaultUI: true
	};
	var current_gpx = {};
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	var weight = 3,
	opa = 0.8,
	color = '#ff0000';

function render_map() {
	var sw = new google.maps.LatLng(current_gpx.min_lat, current_gpx.min_lon),
		ne = new google.maps.LatLng(current_gpx.max_lat, current_gpx.max_lon),
		bounds = new google.maps.LatLngBounds(sw, ne);

	map.fit(bounds);
	// map.setMapType(G_PHYSICAL_MAP);

	for (var i in current_gpx.lines) {
		map.addOverlay(current_gpx.lines[i]);
	}
}

$('#options a').click(function() {

	if (current_gpx.lines) {
		for (var i in current_gpx.lines) {
			map.removeOverlay(current_gpx.lines[i]);
		}
	}

	$('#options li').removeClass('current');
	$(this).parent().addClass('current');
	
	$.get('../../static/data/' + $(this).text(), null, function(data) {
		var xml = $(data);
		current_gpx.name = xml.find('name').html();
		current_gpx.points = [];
		current_gpx.point_attributes = {};
		current_gpx.lines = [];
		current_gpx.max_lat = current_gpx.max_lon = current_gpx.min_lat = current_gpx.min_lon = undefined;
		var run = 0, jog = 0, walk = 0, firstval, lastval, count = 0, totalspeed = 0, totaldistance = 0;
		first = true;
		xml.find('trk trkseg trkpt').each(function() {
			var $t = $(this),
				p = new google.maps.LatLng(parseFloat($t.attr('lat'), 10), parseFloat($t.attr('lon'), 10)),

				point_attributes = {
					time: $t.find('time').text(),
					elevation: parseFloat($t.find('ele').text(), 10)
				},
				first_p = current_gpx.points[0],
				first_pa = current_gpx.point_attributes[first_p],
				last_point_index = current_gpx.points.length - 1,
				last_p = current_gpx.points[last_point_index],
				last_pa = current_gpx.point_attributes[last_p],
				last = last_pa,
				line, distance, time_difference, color_value, green, blue;
				
				while(first){
					firstval = point_attributes.time;
					first = false;
				}

				lastval = point_attributes.time;
			current_gpx.points.push(p);
			current_gpx.point_attributes[p] = point_attributes;

			//window.console.log($t.find('time').text());

			if (last_point_index >= 0) {
				distance = last_p.distanceFrom(p);
				time_difference = (Date.parseISO8601(point_attributes.time) - Date.parseISO8601(last_pa.time)) / 1000;
				if (time_difference != 0){
					totalspeed = totalspeed + (distance/time_difference);
				}
				totaldistance += distance/1000;
				count++;
				
				//window.console.log("meters per sec", distance, time_difference, distance / time_difference);

				color_value = Math.round(distance / time_difference * 15);
				green = Math.min(255, color_value);
				blue = Math.max(0, 100 - color_value);

				//if they are running (6mp/h+)
				if (distance/time_difference > 2.7){
					color = "#4CAF50";
					run++;
				//if they are jogging (5mp/h - 6mp/h)
				}else if (distance/time_difference > 2.23){
					color = "rgb(0, 188, 212)";
					jog++;
				//if they are walking (- 5mp/h)
				}else{
					color = "#FF5252";
					walk++;
				}
				
				// color = "#" + decimalToHex(Math.round(distance / time_difference * 1500), 6);
				// window.console.log(color);
				line = new GPolyline([last_p, p], color, weight, opa);
				current_gpx.lines.push(line);
			}

			current_gpx.max_lat = current_gpx.max_lat > p.lat() ? current_gpx.max_lat : p.lat();
			current_gpx.max_lon = current_gpx.max_lon > p.lng() ? current_gpx.max_lon : p.lng();
			current_gpx.min_lat = current_gpx.min_lat < p.lat() ? current_gpx.min_lat : p.lat();
			current_gpx.min_lon = current_gpx.min_lon < p.lng() ? current_gpx.min_lon : p.lng();
		});

		//OUTPUTS
		var total = run+jog+walk;
		var runper = Math.round((run/total)*100);
		var jogper = Math.round((jog/total)*100);
		var walkper = Math.round((walk/total)*100);
		var averagespeed = Math.round((totalspeed/count)*20.23694)/10;

		walkdistance += totaldistance;

		//Statistics
		document.getElementById("demo1").innerHTML = "You ran for " + runper + "% of your run.";
		document.getElementById("demo2").innerHTML = "You jogged for " + jogper + "% of your run.";
		document.getElementById("demo3").innerHTML = "You walked for " + walkper + "% of your run.";
		time_difference = Math.round((Date.parseISO8601(lastval) - Date.parseISO8601(firstval))/60000);
		//kmh to mph
		totaldistance *= 0.621371;
		document.getElementById("demo4").innerHTML = "Your total workout lasted " + time_difference + " minutes and " + Math.round((totaldistance)*10)/10 + " miles.";
		document.getElementById("demo5").innerHTML = "Your average speed was " + averagespeed + " mph.";
		//TODO: take weight from profile
		var myWeight = 75 * 2.20462;
		difference = (totaldistance * myWeight) * 0.653;
		document.getElementById("demo6").innerHTML = "You have burned " + Math.round(difference) + " calories!";
		
		//Achievements
		if (walkdistance/5 <= 100){
			document.getElementById("goal").setAttribute("style", "width:" + walkdistance/5 + "%");
			document.getElementById("goal").innerHTML = Math.round(walkdistance/5) + "%";
		}else{
			document.getElementById("goal").setAttribute("style", "width:" + 100 + "%");
			document.getElementById("goal").innerHTML = "✓";
		}
		

		if (walkper > 90){
			document.getElementById("ac 1").innerHTML = "me too";
			document.getElementById("ai1").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}

		if (totaldistance > 26){
			document.getElementById("ac 2").innerHTML = "Marathon Runner";
			document.getElementById("ai2").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}

		if (averagespeed > 10){
			document.getElementById("ac 3").innerHTML = "Slow Down There";
			document.getElementById("ai3").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}

		if (difference > 106){
			if ((Math.round(difference/106))*2 > maxkit){
				maxkit = (Math.round(difference/106))*2;
			}
			document.getElementById("title4").title = "That's right. You burned off " + maxkit + " Kit Kats.";
			document.getElementById("ac 4").innerHTML =  maxkit + " Kit Kats";
			document.getElementById("ai4").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}
		
		if (runper > 25){
			document.getElementById("ac 5").innerHTML = "WOAAHH";
			document.getElementById("ai5").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}

		if (runper > 50){
			document.getElementById("ac 6").innerHTML = "We're Half Way There";
			document.getElementById("ai6").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}

		if (runper > 75){
			document.getElementById("ac 7").innerHTML = "WOAWAHHOO";
			document.getElementById("ai7").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}

		if (runper == 100){
			document.getElementById("ac 8").innerHTML = "Livin on a Prayer";
			document.getElementById("ai8").setAttribute("style", "-webkit-filter: grayscale(0%)");
		}

		render_map();
	}, 'text');
	return false;
}).filter(':first').click();

function AlertIt() {
	var answer = confirm ("Please click on OK to continue.")
	if (answer)
	window.location="http://www.continue.com";
	}

}

var icons = {
  parking: {
	name: 'Running',
	icon: '../../static/images/running.jpg'
  },
  library: {
	name: 'Jogging',
	icon: '../../static/images/jogging.jpg'
  },
  info: {
	name: 'Walking',
	icon: '../../static/images/walking.jpg'
  }
};

var legend = document.getElementById('legend');
for (var key in icons) {
  var type = icons[key];
  var name = type.name;
  var icon = type.icon;
  var div = document.createElement('div');
  div.innerHTML = '<img src="' + icon + '"> ' + name;
  legend.appendChild(div);
}