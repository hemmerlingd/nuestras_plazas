var map;
var verticesPoligono = [{lng:-64.17064259760082,lat: -31.35286273859986},
{lng:-64.1709269117564,lat:-31.35335291514141}, 
{lng:-64.17072306387126,lat: -31.35330252327834},
{lng:-64.17071233503519,lat: -31.353407888052157},
{lng:-64.17097519151866,lat: -31.353467442002525},
{lng:-64.17118440382183,lat: -31.353614036181213},
{lng:-64.17138825170696,lat: -31.35367817106253},
{lng:-64.17138825170696,lat: -31.35383392702075},
{lng:-64.1714848112315,lat:-31.353815602803767},
{lng:-64.17147408239543,lat: -31.353701076366683},
{lng:-64.17190860025585,lat: -31.353824764912705},
{lng:-64.17172621004283,lat: -31.35384308912791},
{lng:-64.17147944681346,lat: -31.353948453296045},
{lng:-64.1714848112315,lat:-31.35384308912791}, 
{lng:-64.17139361612499,lat: -31.353856832286965},
{lng:-64.17139898054302,lat: -31.353980520628134},
{lng:-64.17109857313335,lat: -31.35413169504638},
{lng:-64.17086253874004,lat: -31.354200410610705},
{lng:-64.17071233503519,lat: -31.354195829574643},
{lng:-64.17070697061718,lat: -31.354292031285013},
{lng:-64.17088399641216,lat: -31.35428745025342},
{lng:-64.17102883569896,lat: -31.35424163992518},
{lng:-64.1709269117564,lat:-31.354365327760185},
{lng:-64.17073915712535,lat: -31.354773038360584},
{lng:-64.17069087736309,lat: -31.355020412469926},
{lng:-64.17060504667461,lat: -31.35459437887688},
{lng:-64.17032609693706,lat: -31.35425080199262},
{lng:-64.17043447494507,lat: -31.354282869221596},
{lng:-64.170674784109, lat:-31.354292031285013},
{lng:-64.170674784109, lat:-31.354200410610705},
{lng:-64.17043874971569,lat: -31.354182086465126},
{lng:-64.17023490183055,lat: -31.35413627608557},
{lng:-64.16987012140453,lat: -31.35396219643971},
{lng:-64.16987012140453,lat: -31.35384308912791},
{lng:-64.16980574838816,lat: -31.35384308912791},
{lng:-64.16980574838816,lat: -31.353934710150373},
{lng:-64.16943023912609,lat: -31.35382018385835},
{lng:-64.16980038397014,lat: -31.35373314378313},
{lng:-64.16980038397014,lat: -31.353815602803767},
{lng:-64.16987548582256,lat: -31.353811021748967},
{lng:-64.1698647569865,lat:-31.3537148195465},  
{lng:-64.17041729204357,lat: -31.353453698786552},
{lng:-64.17059431783855,lat: -31.35341705020083},
{lng:-64.17068014852703,lat: -31.353412469126603},
{lng:-64.17068551294506,lat: -31.353307104357924},
{lng:-64.17040656320751,lat: -31.353362077295436},
{lng:-64.17033146135509,lat: -31.353389563752145},
{lng:-64.17062650434673,lat: -31.35288564410263} ];

function mapaPlazas()
{
	map = new google.maps.Map(document.getElementById('map'), {
		  center: { lat: -31.4228241, lng: -64.1688174 },
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      });

	
}
	


function marcaespacio(lista,nombre,contratista,color)
{
	console.log(map);
	var plantilla="<div class='info'><div class='cabecera'><div class='icono'><img src='https://www.cordoba.gob.ar/wp-content/uploads/2019/07/arbol.png'></div><div class='titulo'>NUESTRAS PLAZAS Y PASESO</div></div><hr><div class='nombre'>PLAZA COLÓN</div><div class='foto'><img src='https://gobiernoabierto.cordoba.gob.ar/media/__sized__/imagenes/obras/IMG_7346-thumbnail-500x500-70.JPG'></div><div class='contratista'>JUAN PEREZ</div><a href=''><span>Ver más info</span></a></div>";
	var poligono = new google.maps.Polygon({
        path: verticesPoligono,
        map: map,
        strokeColor: color,
        fillColor: color,
        strokeWeight: 2,
    });
    var popup = new google.maps.InfoWindow();

    poligono.addListener('click', function (e) {
	    popup.setContent(plantilla);
	    popup.setPosition(e.latLng);
	    popup.open(map);
	});

}	
function filtra()
{
	marcaespacio(verticesPoligono,"Plaza Colón","Juan Perez","rgb(0,0,0)");
}


