
var map;

(function(window, document, $) {
	const $html = $('html,body');
	const $plazas = $('#plazas');
	const $form = $plazas.find('form');
	let $resultados = $plazas.find('#resultados');
	let $gifCarga = $resultados.find('.cargando');
	let $map = $resultados.find('#map');

$form.submit(function(e) {
	
    e.preventDefault();
    //const datos = $form.serializeArray();
    //console.log(datos);
	 $gifCarga.show();
	 $map.hide();
    $.ajax({
      type: "POST",
      dataType: "JSON",
      url: nuestras_plazas.url,
      data: {
        action: 'nuestras_plazas',
        nonce: nuestras_plazas.nonce,
        zona: document.getElementById("zona").value
      },
      success: function(response) {
        if (response.data) {
	        $map.show();
	        $gifCarga.hide();
	        mapaPlazas();
	        marcaespacio(response.data.data);
        }
      }
    });
  });

})(window, document, jQuery);







function mapaPlazas()
{
	map = new google.maps.Map(document.getElementById('map'), {
		  center: { lat: -31.4228241, lng: -64.1688174 },
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      });

	
}

var slideIndex = 1;


function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("item");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length} ;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  if(typeof x[slideIndex-1].style!==undefined)
  {
  	x[slideIndex-1].style.display = "block";
  }
}


var objmeses;
objmeses=new Array();


function dibujarCalendario(position, lista)
{
	
	var calendar="";
	
	/*calendar+="<div class='owl-carousel owl-theme'>";*/
	calendar+="<div class='info'><div class='mySlides'>";
	var calmes="";
	var estilos="";
	var mes="";
	var anio=""
	for(var i=0; i<=lista[position]['calendarios'].length-1 ;i++)
	{
		mes=lista[position]['calendarios'][i].mes;
		anio=lista[position]['calendarios'][i].anio;
		if(i>0)
		{
			estilos="style='display:none;'";
		}
		calmes+="<div class='item' "+estilos+"><div class='nombremes'>"+getnombremes(mes)+ " - "+ anio +"</div>";
		calmes+=lista[position]['calendarios'][i].calendar;
		calmes+="</div>";
	}
	calendar+=calmes;
	
	return "<div class='cabecera'><div class='icono'><img src='https://www.cordoba.gob.ar/wp-content/uploads/2019/07/arbol.png'></div><div class='titulo'>NUESTRAS PLAZAS Y PASEOS</div></div><hr><div class='nombre'>"+lista[position]['nombre']+"</div><div class='button-mover'><button class='mover izq' onclick='plusDivs(-1)'>&#10094;</button><button class='mover der' onclick='plusDivs(1)'>&#10095;</button></div></div>"+calendar+"</div>";	
}

function getcalendar(fechas,anio,mes)
{
	(function(window, document, $) {
		$.ajax({
	      type: "POST",
	      dataType: "JSON",
	      url: plugindir+"calendario.php",
	      data: {
	        fechas: fechas,
	        anio: anio,
	        mes:mes
	      },
	      success: function(response) {
	      	
	        return response.html;
	      }
	    });
	})(window, document, jQuery);
}

function getnombremes(mes)
{
	switch (mes) {
  		case "01":
    		return "ENERO";
    		break;
    	case "02":
    		return "FEBRERO";
    		break;
    	case "03":
    		return "MARZO";
    		break;
    	case "04":
    		return "ABRIL";
    		break;
    	case "05":
    		return "MAYO";
    		break;
    	case "06":
    		return "JUNIO";
    		break;
    	case "07":
    		return "JULIO";
    		break;
    	case "08":
    		return "AGOSTO";
    		break;
    	case "09":
    		return "SEPTIEMBRE";
    		break;
    	case "10":
    		return "OCTUBRE";
    		break;
    	case "11":
    		return "NOVIEMBRE";
    		break;
    	case "12":
    		return "DICIEMBRE";
    		break;
  
	}	
}

function yaexiste(anio,mes)
{
	var band=false;
	
	for(var i=0; i<=objmeses.length-1 ;i++){
		if(objmeses[i][0]==anio && objmeses[i][1]==mes)
		{
			band=true;
		}
	}
	return band;
}

var calendariodibujado;
function mostrarFotos(id,anio,mes,dia,id_zona){
	var	foto="";
	var fecha;
	var hasta
	var url;
	var diciembre="";
	fecha=dia+"-"+mes+"-"+anio;
    var fecha2 = new Date(anio,mes,dia,0,0,0,0);
	fecha2.setDate(fecha2.getDate() + 1);
	diciembre= fecha2.getMonth();
	if (diciembre == 0){
		diciembre= 12;
	}

	hasta=fecha2.getDate()+"-"+("0" + (diciembre)).slice(-2)+"-"+fecha2.getFullYear();
	/*lista[position]['foto'].length-1*/
	var x=0;
	url = "https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/fotos-frentes-espacios-verdes/?desde="+fecha+"&hasta="+hasta+"&id_trabajo="+id;
	https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/fotos-frentes-espacios-verdes/?id_trabajo=233&desde=17-08-2017&hasta=18-08-2017
	(function(window, document, $) {
		$.ajax({
	      type: "GET",
	      dataType: "JSON",
	      url: url,
	      data: {
	      },
	      success: function(response) {
	      	calendariodibujado = $('.mySlides').html();
	      	$('.mySlides').html("<div class='linkvolver'></div>"+cargarFotos(response,fecha));
	      	//showDivs(1);
	      	$('.linkvolver').html("<div class='volver' onclick='volverCalendario();'>Volver al Calendario</div>");
	      	$('.nombremes').hide();
	      }
	    });
	})(window, document, jQuery);
}

function cargarFotos(lista,fechaformateada){
	var foto="";
	var estilos ="";
	//	console.log(lista);
	var cant=lista['results'].length;
	for (var b=0; b<=lista['results'].length-1 ;b++){
		if(b>0)
		{
			estilos="style='display:none;'";
		}
		var x=b+1;
		foto += "<div class='item' "+estilos+"><div class='content_img'><img src='"+lista['results'][b]['foto'].thumbnail_500+"'><div class='fecha'>[Foto "+x+" de "+cant+"] "+fechaformateada+"</div></div></div>";
		
	}

	return "<div class='foto' id='content_foto'>"+foto+"</div><br>";
}

function volverCalendario(){
	(function(window, document, $) {
	      	$('.mySlides').html(calendariodibujado);
	      	//showDivs(1);
	      	$('.linkvolver').html("");
	      	$('.nombremes').show();
	})(window, document, jQuery);
}
var lbl;
function marcaespacio(lista)
{
	
	//console.log(lista);
	var arr = new Array();
	var poligono =[];
		var foto="";
	for (var i = lista.length - 1; i >= 0; i--) {
		var bounds = new google.maps.LatLngBounds();
		/---------COLOR-----------/
		var a = Math.floor((Math.random() * 255) + 1);
		var b = Math.floor((Math.random() * 255) + 1);
		var c = Math.floor((Math.random() * 255) + 1);
		var color = 'rgb('+a+','+b+','+c+')';
		/-------FIN COLOR---------/
		
			//console.log(lista[i]['coordinates'].length);
		if(lista[i]['tipo']=='cpc')
		{
			for (var a = lista[i]['coordinates'].length - 1; a >= 0; a--) {
				arr.push( new google.maps.LatLng(
		                    parseFloat(lista[i]['coordinates'][a].lat),
		                    parseFloat(lista[i]['coordinates'][a].lng)
		            ));
			}
			

			poligono = new google.maps.Polygon({
	            paths: arr,
	            map: map,
	            strokeColor: color,
	            strokeOpacity: 0.8,
	            strokeWeight: 2,
	            fillColor: color,
	            fillOpacity: 0.35
	        });

				
			for (var pathidx = 0; pathidx < poligono.getPath().getLength(); pathidx++) {
		      bounds.extend(poligono.getPath().getAt(pathidx));
		    }
			lbl = new Label(bounds, lista[i]['nombre'], map);

		    
		
		}else{
			var icon = {
			    url: "https://www.cordoba.gob.ar/wp-content/uploads/2019/08/elliptical-tree-icon-by-vexels.png", // url
			    scaledSize: new google.maps.Size(50, 50), // scaled size
			    origin: new google.maps.Point(0,0), // origin
			    anchor: new google.maps.Point(0, 0) // anchor
			};
			var myLatLng ={lat:lista[i]['coordinates'][1], lng: lista[i]['coordinates'][0]};
			poligono = new google.maps.Marker({
	            position: myLatLng,
	            map: map,
	            icon: icon
	        });
	        bounds.extend(myLatLng);
		}

			poligono.center = bounds.getCenter();
		
		
		var popup = new google.maps.InfoWindow();
		if(lista[i]['tipo']!='cpc')
		{
			poligono.addListener('click', (function(position,lista) {
			  return function() {
			    // set the content
			    //popup.setContent(mostrarfoto(position,lista));
			    popup.setContent(dibujarCalendario(position,lista));
			    // set the position
			    popup.setPosition(this.center);
			    // open it
			    popup.open(map);
			    
			   
			  }
			})(i,lista));
		}


		arr=[];
		poligono=[];

	}
		
}


Label.prototype = new google.maps.OverlayView();
/** @constructor */
function Label(bounds, texto, map) {

    // Initialize all properties.
    this.bounds_ = bounds;
    this.txt_ = texto;
    this.map_ = map;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

Label.prototype.onAdd = function() {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    div.style.fontSize = '15px';
    div.style.fontWeight = '700';
    div.style.width='80px';
    div.style.height='80px';

    div.innerHTML=this.txt_;
    // Create the img element and attach it to the div.
    
    this.div_ = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

Label.prototype.draw = function() {

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var centro = overlayProjection.fromLatLngToDivPixel(this.bounds_.getCenter());

    // Resize the image's div to fit the indicated dimensions.
    var div = this.div_;

    div.style.left = centro.x-40 + 'px';
    div.style.top = centro.y-20 + 'px';
    //div.style.width = (ne.x - sw.x) + 'px';
    //div.style.height = (sw.y - ne.y) + 'px';
};



	
function filtra(lista)
{
	//marcaespacio(lista);
}