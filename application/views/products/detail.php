<section id="app-detail">
    <div class="row m-t">
		<div class="col-sm-12">
			<p class="pull-left">
				<!--  <a ng-href="#/subcategories/edit/{{selected[0].id}}" class="btn btn-default" ng-disabled="selected.length !== 1">
					<i class="fa fa-pencil text"></i>
					<span class="text">&nbsp;Editar</span>
				</a> -->
				<!-- <button type="button" class="btn btn-default">
					<i class="fa fa-trash-o text"></i>
					<span class="text">
						&nbsp;Enviar a papelera
						<span >(2)</span>
					</span>
				</button> -->
			</p>
			<p class="pull-right">
				<!-- <a href="#/subcategories/add" class="btn btn-success">
					<i class="fa fa-plus text"></i>
					<span class="text">&nbsp;Agregar</span>
				</a> -->
				<a href="#" class="btn btn-default" @click.prevent="editMode=!editMode">
					<i class="fa fa-pencil text"></i>
					<span class="text">&nbsp;Editar</span>
				</a>
			</p>
		</div>
    </div>
    <div class="row">
      <section class="panel panel-default">
        <header class="panel-heading bg-light">
          <ul class="nav nav-tabs nav-justified">
            <li class="active"><a href="#home" data-toggle="tab" @click.prevent="setTab(1)">Ficha</a></li>
            <li class=""><a href="#profile" data-toggle="tab" @click.prevent="setTab(2)">Costos</a></li>
            <li class=""><a href="#messages" data-toggle="tab" @click.prevent="setTab(3)">Tallas</a></li>
            <li class=""><a href="#web" data-toggle="tab" @click.prevent="setTab(4)">Web</a></li>
          </ul> 
        </header>
        <div class="panel-body"> 
          <div class="tab-content">
            <div :class="['tab-pane', activeTab == 1 ? 'active' : '']" id="home" >
				<erp-ficha :data=product.details[0] :imgdefecto=imagen :edit=editMode></erp-ficha>
            </div> 
            <div :class="['tab-pane', activeTab == 1 ? 'activeTab' : '']" id="profile">
				<erp-ficha-empresa :data=costDetail></erp-ficha-empresa>
			</div>
            <div :class="['tab-pane', activeTab == 1 ? 'activeTab' : '']" id="messages">
				<erp-tallas :data=sizeDetails></erp-tallas>
			</div>
            <div :class="['tab-pane', activeTab == 1 ? 'activeTab' : '']" id="web">
			</div>
          </div>
        </div> 
      </section>
    </div>
</section>
<script> 
var EventBus = new Vue;
Vue.component('erp-ficha', {
  props: ['data', 'imgdefecto', 'edit'],
  template: `
		<section class="wrapper-lg">
			<div class="row" v-show="isLoading"><h3 class="font-bold m-t-none">Guardando...</h3></div>
			<div class="row">
				<div class="col-md-3">
					<div class="text-center"> <img id="foto" v-bind:src="foto" @error="setDefaultImage" style="height: 150px; weight: 150px" alt="..." class="m-b">
						<div class="">
							<div class="progress progress-xs inline m-b-none" style="width:128px">
								<div class="progress-bar bg-info" data-toggle="tooltip" data-original-title="80%"
									style="width: 100%"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="row m-b" v-if="edit">
						<div class="col-md-6"><input class="form-control" type="text" v-model="data.code" /> </div>
						<div class="col-md-6">
						<v-select :selected="brand.id" :label="brand.text" :filterable="false" :options="brands" @search="onSearchBrand" v-model="brand">
							<template v-slot:no-options="{ search, searching }">
								<template v-if="searching">
									No se encontraron resultados para <em>{{ search }}</em>.
								</template>
								<em style="opacity: 0.5;" v-else>Digite el nombre de la marca.</em>
							</template>
							<template slot="option" slot-scope="option">
								<div class="d-center">
									{{ option.id}} - {{ option.text }}
								</div>
							</template>
							<template slot="selected-option" slot-scope="option">
								<div class="selected d-center">
									COD&nbsp;:&nbsp;{{ option.id}} -
									{{ option.text }}
								</div>
							</template>
						</v-select>
						</div>
					</div>
          			<h3 v-else class="font-bold m-b-none m-t-none"> {{ data.code }} - {{ data.brand }}</h3>
					
					<input v-if="edit" type="text" class="form-control" v-model="data.description"/>
					<p v-else>{{ data.description }}</p>

					<p class="m-t"><i class="fa fa-lg fa-circle-o text-primary m-r-sm"></i> <strong> {{ data.regime }} </strong></p>
					<ul v-if="edit" class="nav nav-pills nav-stacked">
						<li class="bg-light m-b">
							<v-select :selected="category.id" :label="category.text" :filterable="false" :options="categories" @search="onSearchCategory" v-model="category">
								<template v-slot:no-options="{ search, searching }">
									<template v-if="searching">
										No se encontraron resultados para <em>{{ search }}</em>.
									</template>
									<em style="opacity: 0.5;" v-else>Digite el nombre de la categoría.</em>
								</template>
								<template slot="option" slot-scope="option">
									<div class="d-center">
										{{ option.id}} - {{ option.text }}
									</div>
								</template>
								<template slot="selected-option" slot-scope="option">
									<div class="selected d-center">
										COD&nbsp;:&nbsp;{{ option.id}} -
										{{ option.text }}
									</div>
								</template>
							</v-select>
						</li>
						<li class="bg-light m-b">
							<v-select :selected="subcategory.id" :label="subcategory.text" :filterable="false" :options="subcategories" @search="onSearchSubcategory" v-model="subcategory">
								<template v-slot:no-options="{ search, searching }">
									<template v-if="searching">
										No se encontraron resultados para <em>{{ search }}</em>.
									</template>
									<em style="opacity: 0.5;" v-else>Digite el nombre de la Sub-Categoría.</em>
								</template>
								<template slot="option" slot-scope="option">
									<div class="d-center">
										{{ option.id}} - {{ option.text }}
									</div>
								</template>
								<template slot="selected-option" slot-scope="option">
									<div class="selected d-center">
										COD&nbsp;:&nbsp;{{ option.id}} -
										{{ option.text }}
									</div>
								</template>
							</v-select>
						</li>
					</ul>
					<ul v-else class="nav nav-pills nav-stacked">
						<li class="bg-light m-b"><a href="#">Linea {{ data.category }} </a></li>
						<li class="bg-light m-b"><a href="#">Sub Linea {{ data.subcategory }} </a></li>
					</ul>
				</div>
				<div class="col-md-3 m-b">
					<small>Genero</small>
					<select v-if="edit" id="gender" class="form-control" v-model="gender.id">
						<option v-for="gender in genders" :value="gender.id">{{gender.text}}</option>
					</select>
					<div v-else class="text-lt font-bold">{{ data.gender }}</div>
				</div>
				<div class="col-md-3 m-b">
					<small>Edad</small>
					<select v-if="edit" id="age" class="form-control" v-model="age.id">
						<option v-for="age in ages" :value="age.id">{{age.text}}</option>
					</select>
					<div v-else class="text-lt font-bold">{{ data.age }}</div>
				</div>
				<div class="col-md-3 m-b">
					<small>Uso</small>
					<v-select v-if="edit" :selected="use.id" :label="use.text" :filterable="false" :options="uses" @search="onSearchUse" v-model="use">
						<template v-slot:no-options="{ search, searching }">
							<template v-if="searching">
								No se encontraron resultados para <em>{{ search }}</em>.
							</template>
							<em style="opacity: 0.5;" v-else>Digite el uso.</em>
						</template>
						<template slot="option" slot-scope="option">
							<div class="d-center">
								{{ option.id}} - {{ option.text }}
							</div>
						</template>
						<template slot="selected-option" slot-scope="option">
							<div class="selected d-center">
								COD&nbsp;:&nbsp;{{ option.id}} -
								{{ option.text }}
							</div>
						</template>
					</v-select>
					<div v-else class="text-lt font-bold">{{ data.use }}</div>
				</div>
				<div class="col-md-3 m-b">
					<small>Medida</small>
					<select v-if="edit" id="measurement" class="form-control" v-model="measurement.id">
						<option v-for="measurement in measurements" :value="measurement.id">{{measurement.code}}&nbsp;-&nbsp;{{measurement.text}}</option>
					</select>
					<div v-else class="text-lt font-bold">{{ data.measurement }}</div>
				</div>
			</div>
			<div class="line b-b m-t m-b"></div>
			<div class="wrapper m-b">
				<div> <small>Detalle</small>
					<textarea v-if="edit" class="form-control" v-model="data.description2"></textarea>
					<div v-else class="text-lt">{{ data.description2 }}</div>
				</div>
			</div>
			<div class="row" v-if="edit">
				<div class="col-sm-12">
					<div class="pull-right">
					<a href="#" class="btn btn-success" @click.prevent="save">
						<i class="fa fa-save text"></i>
						<span class="text">&nbsp;Guardar</span>
					</a>
					</div>
				</div>
			</div>
		</section>
  `,
  data() {
		return {
			foto: 'http://a518098c1a67.sn.mynetname.net/leon/img/sistema/' + this.data.code + '.jpg',
			url: 'http://localhost:8080/erp/index.php/',
			brands: [],
			categories: [],
			subcategories: [],
			genders: [],
			ages: [],
			uses: [],
			measurements: [],
			brand: {
				id: this.data.brand_id,
				text: this.data.brand
			},
			category: {
				id: this.data.category_id,
				text: this.data.category
			},
			subcategory: {
				id: this.data.subcategory_id,
				text: this.data.subcategory
			},
			gender: {
				id: this.data.gender_id,
				text: this.data.gender
			},
			age: {
				id: this.data.age_id,
				text: this.data.age
			},
			use: {
				id: this.data.use_id,
				text: this.data.use
			},
			measurement: {
				id: this.data.measurement_id,
				code: this.data.measurement_code,
				text: this.data.measurement
			},
			isLoading: false
		}
  },
  async created() {
	await this.getGenders();
	await this.getAges();
	await this.getMeasurements();
  },
  methods:{
		setDefaultImage(event) {
			event.target.src = this.imgdefecto
		},
		async onSearchBrand(search, loading) {
			await loading(true);
			const rawResponse = await fetch(siteUrl("brands/simple_list?terms="+search));
			const content = await rawResponse.json();
			this.brands = await content;  
			EventBus.$emit('setBrand', this.brand)   
			await loading(false);
		},
		async onSearchCategory(search, loading) {
			await loading(true);
			const rawResponse = await fetch(siteUrl("categories/simple_list?terms="+search));
			const content = await rawResponse.json();
			this.categories = await content;  
			EventBus.$emit('setCategory', this.category)   
			await loading(false);
		},
		async onSearchSubcategory(search, loading) {
			await loading(true);
			const rawResponse = await fetch(siteUrl("subcategories/simple_list?terms="+search));
			const content = await rawResponse.json();
			this.subcategories = await content;  
			EventBus.$emit('setSubcategory', this.subcategory)   
			await loading(false);
		},
		async getGenders() {
			const rawResponse = await fetch(siteUrl("genders/simple_list"));
			const content = await rawResponse.json();
			this.genders = await content;  
			EventBus.$emit('setSubcategory', this.gender)   
		},
		async getAges() {
			const rawResponse = await fetch(siteUrl("ages/simple_list"));
			const content = await rawResponse.json();
			this.ages = await content;  
			EventBus.$emit('setAges', this.age)   
		},
		async onSearchUse(search, loading) {
			await loading(true);
			const rawResponse = await fetch(siteUrl("uses/simple_list?terms="+search));
			const content = await rawResponse.json();
			this.uses = await content;  
			EventBus.$emit('setSubcategory', this.subcategory)   
			await loading(false);
		},
		async getMeasurements() {
			const rawResponse = await fetch(siteUrl("measurements/simple_list"));
			const content = await rawResponse.json();
			this.measurements = await content;  
			EventBus.$emit('setMeasurements', this.measurement)   
		},
		async save() {
			var bootbox = window.bootbox;
			this.isLoading = await true;
			let updateproduct = {
				"code": this.data.code,
				"description": this.data.description,
				"brand_id" : this.brand.id,
				"category_id": this.category.id,
				"subcategory_id": this.subcategory.id,
				"description2": this.data.description2,
				"gender_id": this.gender.id,
				"ages_id": this.age.id,
				"uses_id": this.use.id,
				"measurement_id": this.measurement.id
			}
			let product = { "id": this.data.id, "data": updateproduct }
			const rawResponse = await fetch(siteUrl("products/update", {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(product)
			}));
			const response = await rawResponse.json();
			if(response==200) {
				bootbox.alert({
					title: 'Registro exitoso',
					message: 'El producto se actualizó.'
				});
				this.data.age = this.ages.filter(x => x.id == this.age.id)[0].text 
				this.data.use = this.uses.length != 0 ? this.uses.filter(x => x.id == this.use.id)[0].text : this.use.text
				this.data.brand = this.brands.length != 0 ? this.brands.filter(x => x.id == this.brand.id)[0].text : this.brand.text
				this.data.category = this.categories.length != 0 ? this.categories.filter(x => x.id == this.category.id)[0].text : this.category.text
				this.data.subcategory = this.subcategories.length != 0 ? this.subcategories.filter(x => x.id == this.subcategory.id)[0].text : this.subcategory.text
				//this.data.description = this.ages.filter(x => x.id == this.description.id)[0].text 
				this.data.measurement = this.measurements.filter(x => x.id == this.measurement.id)[0].text 
			} else {
				bootbox.alert({
					title: 'Ocurrió un error',
					message: 'No se pudo actualizar el producto.'
				});
			}
			console.log("respuesta", response);

			this.isLoading = await false;
			this.edit = await false;
		}
  }
})

Vue.component('erp-ficha-empresa', {
	props: ['data'],
	template: `
			<section class="wrapper-lg m-t-n">
				<h4>Empresa y Costos</h4>
				<div class="row">
					<div class="col-lg-12">
						<div class="fixed-table-responsive panel panel-default">
							<table class="table table-striped table-bordered">
                                <thead>
									<tr>
										<th>Empresa</th>
										<th>Costo Factura</th>
										<th>Costo Reposicion</th>
										<th>PVP</th>
										<th>Precio Oferta</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="reg in data">
										<td>{{ reg.company }}</td>
										<td>
											<div class="input-group">
                                                <span class="input-group-addon" v-html="reg.invoice_currency == 'S' ? 'S/.' : 'USD'"></span>
                                                <input type="text" readonly class="form-control text-right" v-model="reg.invoice_cost">
											</div>
										</td>
										<td>
											<div class="input-group">
                                                <span class="input-group-addon" v-html="reg.cost_currency == 'S' ? 'S/.' : 'USD'"></span>
                                                <input type="text" readonly class="form-control text-right" v-model="reg.cost">
											</div>
										</td>
										<td>
											<div class="input-group">
                                                <span class="input-group-addon">S/.</span>
                                                <input type="text" readonly class="form-control text-right" v-model="reg.price">
											</div>
										</td>
										<td>
											<div class="input-group">
                                                <span class="input-group-addon">S/.</span>
                                                <input type="text" readonly class="form-control text-right" v-model="reg.offer_price">
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
			`,
});
Vue.component('erp-tallas', {
	props: ['data'],
	template: `
			<section class="wrapper-lg m-t-n">
				<h4>Empresa y Costos</h4>
				<div class="row">
					<div class="col-lg-12">
						<div class="fixed-table-responsive panel panel-default">
							<table class="table table-striped table-bordered">
                                <thead>
									<tr>
										<th>Empresa</th>
										<th>Almacén</th>
										<th>Talla</th>
										<th>Stock</th>
										<th>Código de Barras</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="reg in data">
										<td>{{ reg.company }}</td>
										<td>
											<div class="input-group">
                                                <input type="text" readonly class="form-control text-right" v-model="reg.almacen">
											</div>
										</td>
										<td>
											<div class="input-group">
                                                <input type="text" readonly class="form-control text-right" v-model="reg.talla">
											</div>
										</td>
										<td>
											<div class="input-group">
                                                <input type="text" readonly class="form-control text-right" v-model="reg.stock">
											</div>
										</td>
										<td>
											<div class="input-group">
                                                <input type="text" readonly class="form-control text-right" v-model="reg.old_barcode">
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
				`
});
Vue.component("v-select", VueSelect.VueSelect);

var vue = new Vue({
	el: "#app-detail",
	data() {
		return {
		gato: 'miaau',
		url: 'http://localhost:8080/erp/index.php/',
		
		editMode: false,
		activeTab: 1,
		product: <?php echo json_encode($detail);?>,
		costDetail: [],
		sizeDetails: [],
		product_id: <?php echo json_encode($id);?>,
		imagen : 'http://localhost:8080/erp/public/images/no-photo.png'
		}
	},
	mounted() {
		this.getCost();
		this.getSizes();
	},
	methods: {
		setTab(tab) {
			this.activeTab = tab;
		},

		async getCost() {
			const rawResponse = await fetch(siteUrl('products/cost_detail/' + this.product_id));
			const response = await rawResponse.json();
			this.costDetail = await response;
		},

		async getSizes() {
			const rawResponse = await fetch(siteUrl('products/size_detail/' + this.product_id));
			const response = await rawResponse.json();
			this.sizeDetails = await response;
		}
	}
});
</script>