<?php

/*

Plugin Name:Plugin para avance de obra de espacios verdes

Plugin URI: https://github.com/ModernizacionMuniCBA/plugin-wordpress-nuestras_plazas

Description: Este plugin genera una plantilla para incluir en una p&aacute;gina un buscador de espacios verdes y poder visualizar el avance de obra.

Version: 1.5.3

Author: David Hemmerling & Ignacio Perlo 

Author URI: https://github.com/perloignacio/

*/



setlocale(LC_ALL,"es_ES");

date_default_timezone_set('America/Argentina/Cordoba');

add_action('plugins_loaded', array('nuestras_plazas', 'get_instancia'));




	


class nuestras_plazas

{

	public static $instancia = null;



	public static function get_instancia() {

		if (null == self::$instancia) {

			self::$instancia = new nuestras_plazas();

		} 

		return self::$instancia;

	}

	

	

	private function __construct()	

	{

		

		

		add_shortcode('nuestras_plazas', array($this, 'render_shortcode_nuestras_plazas'));

		add_action('wp_enqueue_scripts', array($this, 'cargar_assets'));

		//add_action('init', array($this, 'boton_shortcode_repecticiones'));

	}

	

	public function cargar_assets()

	{

		$urlCSSShortcode = $this->cargar_url_asset('/css/shortcode_nuestras_plazas.css');

		 wp_register_style('plugin_nuestras_plazas_css', $urlCSSShortcode);

		 wp_enqueue_style('plugin_nuestras_plazas_css', $urlCSSShortcode);

		 

		 $urlJSNuestrasPlazas = $this->cargar_url_asset('/js/plugin_nuestras_plazas.js');

		 

		 wp_register_script('carga-plugin-nuestras_plazas', $urlJSNuestrasPlazas,null,false,false);



	}

	private function cargar_url_asset($ruta_archivo)

	{

		return plugins_url($ruta_archivo, __FILE__);

	}

	

	public function chequear_respuesta($api_response, $tipoObjeto, $nombre_transient)

	{

		if (is_null($api_response)) {

			return [ 'results' => [] ];

		} else if (is_wp_error($api_response)) {

			return [ 'results' => [], 'error' => 'Ocurri&oacute; un error al cargar '.$tipoObjeto.'.'.$mensaje];

		} else {

			$respuesta = json_decode(wp_remote_retrieve_body($api_response), true);

			return $respuesta;

		}

	}

	public function cargalistas($url,$lista_zonas,$lista_contratistas)
	{
		
		$data = file_get_contents($url);
		$resultado = json_decode($data);
		foreach ($resultado->results as $zona) {
			$objzona=['id' => $zona->id, 'nombre'=>$zona->nombre];
			array_push($lista_zonas,(array)$objzona );

			$objorg=array('CUIT' => $zona->CUIT, 'organizacion'=>$zona->organizacion);
			array_push($lista_contratistas, (array)$objorg);
		}
		$listas=["zonas"=>$lista_zonas,"contratistas"=>$lista_contratistas];
		if(!empty($resultado->next))
		{

			return $this->cargalistas($resultado->next,$lista_zonas,$lista_contratistas);
		}else{
			return $listas;
		}
	}

	public function cargamapa($url,$plazas)
	{
		$context = stream_context_create(array(
        'http' => array(
            'timeout' => 1000   // Timeout in seconds
        )
    	));
		$data = file_get_contents($url);
		$resultado = json_decode($data);
			//var_dump($resultado->results);
		foreach ($resultado->results->features as $zona) {
			//var_dump($zona);
			$objzona=['id'=> $zona->id, 'nombre' => $zona->properties->obra, 'foto'=>$zona->properties->adjuntos[0]->foto->thumbnail_500, 'coordenadas'=> $zona->geometry->coordinates];
			array_push($plazas,(array)$objzona );

		}
		//$listas=["zonas"=>$lista_zonas,"contratistas"=>$lista_contratistas];
		if(!empty($resultado->next))
		{

			return $this->cargamapa($resultado->next,$plazas);
		}else{
			//var_dump($plazas);
			return $plazas;
		}
		
		

	}


	public function render_shortcode_nuestras_plazas($atributos = [], $content = null, $tag = '')

	{
		//wp_enqueue_script('carga-plugin-nuestras_plazas',$urlJSNuestrasPlazas,null,false,false);
		$atributos = array_change_key_case((array)$atributos, CASE_LOWER);

	    $atr=shortcode_atts([],$atributos, $tag);

	    $lista_zonas=array();
		$lista_contratistas=array();
		$plazas=array();
		$datos=$this->cargalistas("https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/espacios-verdes/",$lista_zonas,$lista_contratistas);
		$dibuja =$this->cargamapa("https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/frentes-espacios-verdes/?id_zona=8",$plazas);
			
			$listaobj =array();
			$vertices = array();
//count($dibuja)-1
			for ($i=0; $i <= 1; $i++) { 
				foreach ($dibuja[$i]['coordenadas'] as $coord) {
					$listadatos = new stdClass();
					$listadatos->lng= floatval(str_replace(',', '.', $coord[0]));
					$listadatos->lat= floatval(str_replace(',', '.', $coord[1]));

					array_push($vertices,$listadatos);

				}
				$obj = new stdClass();
				$obj->obj=$vertices;


				array_push($listaobj,$obj);

			}
			//var_dump($obj);



		$sc="";

		$sc.='
		<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdhknpOExGWhcYbEXKLfnPHqND4ejjqpE"
  type="text/javascript"></script>
		<script src="'. plugin_dir_url( __FILE__ ). 'js/plugin_nuestras_plazas.js"></script>
		<div id="buscador">

				<div class="campo">

					<select id="zonas" onchange="javascript:filtra()">

						<option value="">Seleccione su zona</option>';
						foreach($datos['zonas'] as $zona)
						{

							$sc.="<option value='".$zona['id']."'>".$zona['nombre']."</option>";

						}


			  $sc.='</select>

				</div>

				<div class="campo">

					<select id="tipo" onchange="javascript:filtra()">

						<option value="">Seleccione el contratista</option>';
						foreach($datos['contratistas'] as $contra)
						{

							$sc.="<option value='".$contra['CUIT']."'>".$contra['organizacion']."</option>";

						}

			  $sc.='</select>

				</div>
				
			</div>';


			$sc.='<div id="listado-actividades">

				<!--<div id="loading"><img src="'.plugin_dir_url( __FILE__ ).'images/loading.gif" /></div>-->

				<div id="resultados">

				</div>

			</div>
			<div id="map"></div>
			';


			
			

			$sc.='
	<script>
	var lista = '.json_encode($listaobj).';
	mapaPlazas();
	marcaespacio(lista,"'.$dibuja[1]["coordenadas"].'","Juan Perez","rgb(0,0,0)");</script>

  ';

		return $sc;

	}
//Gob. Abierto Key
//AIzaSyAYw1rqa9mL1-__v8h2CVgsRJmpmP2mP1s
//Nacho
	//AIzaSyAdhknpOExGWhcYbEXKLfnPHqND4ejjqpE


	/*public function boton_shortcode_repecticiones() {

		if (!current_user_can('edit_posts') && !current_user_can('edit_pages') && get_user_option('rich_editing') == 'true')

			return;



		add_filter("mce_external_plugins", array($this, "registrar_tinymce_plugin")); 

		add_filter('mce_buttons', array($this, 'agregar_boton_tinymce_shortcode_repeticiones'));

	}



		public function registrar_tinymce_plugin($plugin_array) {

		$plugin_array['repeticiones_button'] = $this->cargar_url_asset('/js/shortcode_repeticiones.js');

	    return $plugin_array;

	}



	public function agregar_boton_tinymce_shortcode_repeticiones($buttons) {

	    $buttons[] = "repeticiones_button";

	    return $buttons;

	}
	*/
	

	

	

	

}