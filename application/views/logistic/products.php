<section class="scrollable wrapper" id="app">
    <div class="row">
        <div class="col-sm-6">
            <a href="#" class="btn btn-primary">
                <i class="fa fa-plus text"></i>
                <span class="text">&nbsp;Agregar</span>
            </a>
        </div>
        <div class="col-sm-6 text-right">
            <a href="#" class="btn btn-default m-b">Reporte de productos por stock</a>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-offset-9 col-lg-3">
            <v-searchbox placeholder="Buscar por"></v-searchbox>
        </div>
    </div>
    <div class="row m-t">
        <div class="col-lg-12">
            <v-table :data="productos" :total="total" :page=page></v-table>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-6">
            {{ total }} registros
        </div>
        <div class="col-lg-6">
            <v-paginator 
              :total=total
              :display=15>
            </v-paginator>
        </div>
    </div>
      
</section>

<script>
  var EventBus = new Vue;
  Vue.component('v-searchbox', {
    props: ['placeholder'],
    template: 
      `<input type="search" class="form-control" v-model="query" :placeholder=placeholder @keyup.enter="setQuery"/>`,
    data() {
      return {
        query: ''
      }
    },
    methods: {
      setQuery() {
        EventBus.$emit('search', this.query)
      }
    }
  });

  Vue.component('v-paginator', {
    props: ['total', 'display'],
    template: `
              <nav>
                <a href="#" class="btn btn-sm btn-default" data-first @click="firstPage">«</a>
                <a href="#" class="btn btn-sm btn-default" @click="prevPage">←</a>
                  
                <span v-if="!numPages">
                  <a href="#" :class=className(1)>
                    1
                  </a>
                </span>
                
                <span v-if="numPages > 0 && numPages < 8">
                  <a v-for="n in pages" href="#" :class=className(n) @click="setPage(n)">
                    {{ n }}
                  </a>
                </span>
                
                <span v-if="numPages > 7">
                  <a href="#" :class="className(1)" @click="setPage(1)">1</a>

                  <span v-if="currentPage < 5">
                    <a href="#" :class="className(2)" @click="setPage(2)">2</a>
                    <a href="#" :class="className(3)" @click="setPage(3)">3</a>
                    <a href="#" :class="className(4)" @click="setPage(4)">4</a>
                    <a href="#" :class="className(5)" @click="setPage(5)">5</a>
                  </span>

                  <span v-if="(currentPage > 4) && currentPage < (numPages - 3)">
                    <label>...</label>
                    <a href="#" :class="[className(currentPage - 1), 'after-label']" @click="setPage(currentPage - 1)">{{ currentPage - 1 }}</a>
                    <a href="#" :class="className(currentPage)" @click="setPage(currentPage)">{{ currentPage }}</a>
                    <a href="#" :class="className(currentPage + 1)" @click="setPage(currentPage + 1)">{{ currentPage + 1 }}</a>
                  </span>

                  <span if="currentPage > (numPages - 4)">
                    <label>...</label>
                    <a href="#" :class="[className(numPages - 3), 'after-label']" @click="setPage(numPages - 3)">{{ numPages - 3 }}</a>
                    <a href="#" :class="className(numPages - 2)" @click="setPage(numPages - 2)">{{ numPages - 2 }}</a>
                    <a href="#" :class="className(numPages - 1)" @click="setPage(numPages - 1)">{{ numPages - 1 }}</a>
                  </span>

                  <span v-if="currentPage < (numPages - 3)">
                    <label>...</label>
                  </span>

                  <a href="#" :class="[className(numPages), 'after-label']" @click="setPage(numPages)">{{ numPages }}</a>
                </span>

                <a href="#" class="btn btn-sm btn-default" @click="nextPage">→</a>
                <a href="#" class="btn btn-sm btn-default" @click="lastPage" data-last>»</a>
              </nav>
    `,
    data() {
        return {
            currentPage: 1
        }
    },
    computed: {
        numPages: function () {
            return Math.floor(this.total / this.display) + ((this.total % this.display > 0) ? 1 : 0)
        },
        pages: function () {
          var paginas = [];
          for (var i = 0; i < this.numPages; i++) {
              paginas.push(i + 1);
          }
          return paginas;
        }
    },
    methods: {
        className(itemPage) {
            if ( itemPage === this.currentPage ) {
                return "btn btn-sm btn-primary" || ''
            } else {
                return "btn btn-sm btn-default" || ''
            }
        },
        firstPage() {
          this.setPage(1)
          console.log("firstPage");
        },
        prevPage() {
          if ( this.currentPage > 1 ) {
              this.setPage(this.currentPage - 1)
          }
          console.log("prevPage");
        },
        setPage(e) {
          console.log(e);
          if (e !== this.currentPage) {
              this.currentPage = e;
              EventBus.$emit('setPage', this.currentPage)
              //console.log('page',this.display * (this.currentPage - 1))
          }
          console.log("setPage");
        },
        nextPage() {
          if ( this.currentPage < this.numPages ) {
            this.setPage(this.currentPage + 1)
          }
          console.log("nextPage");
        },
        lastPage() {
          this.setPage(this.numPages)
          console.log("lastPage");
        }
    }

  });

  Vue.component('v-table', {
    props: ['data','total','page'],
    template: `
            <div class="table-responsive">
              <table class="table table-bordered table-hover bg-white">
                <thead>
                  <tr>
                    <th class="text-center">N°</th>
                    <th class="text-center">Código</th>
                    <th class="text-center">Marca</th>
                    <th class="text-center">Descripción</th>
                    <th class="text-center">Activo</th>
                    <th class="text-center" colspan="2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(reg, index) in data">
                    <td width="60px" class="text-center v-middle">{{ (index + 1) + ((page - 1) * 15)}}</td>
                    <td class="v-middle">
                      <a :href="'#/products/detail/' + reg.id">{{ reg.code }}</a>
                   </td>
                    <td class="v-middle">{{ reg.description || '-' }}</td>
                    <td width="150px" class="text-center v-middle">
                      {{ reg.regime }}
                    </td>
                    <td width="120px" class="text-center v-middle">
                      <a :href="'#/products/edit/'+ reg.id">Editar</a>
                    </td>
                    <td width="120px" class="text-center v-middle">
                      <a href="#" >Eliminar</a>
                    </td>
                  </tr>
                  <tr v-if="!data.length">
                    <td class="text-center" colspan="6">
                      No se encontraron registros
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>`,
  });
  var vue = new Vue({
    el: '#app',
    data() {
        return {
            url: 'http://localhost:8080/erp/index.php/',
            page: 1,
            display: 15,
            total: 0,
            query: '',
            productos: [],
        }
    },
    methods: {
        async traerData() {
            const rawResponse = await fetch(siteUrl("products/search?page="+this.codigo));
            const content = await rawResponse.json();
            this.producto = await content.items;      
        },
        async masdata() {
          if( this.query != '') {
            const rawResponse = await fetch(siteUrl("products/search?page="+this.page+"&display="+this.display+"&term="+this.query));
            const content = await rawResponse.json();
          this.productos = await content.items;
          this.total = await content.total_count;  
          } else {
            const rawResponse = await fetch(siteUrl("products/search?page="+this.page+"&display="+this.display));
            const content = await rawResponse.json();
          this.productos = await content.items;
          this.total = await content.total_count;  
          }
        }
    },
      async created() {
          await EventBus.$on('setPage', function(index) {
            this.page = index
            console.log("page", this.page)
            console.log("emiton", index)
            this.$nextTick(() => {
              this.page = index
            })
            this.masdata();
          }.bind(this));

          this.masdata();

          await EventBus.$on('search', function(index) {
            this.query = index
            console.log("buscando", this.page)
            console.log("buscando", index)
            this.$nextTick(() => {
              this.query = index
            })
            this.masdata();
          }.bind(this));
          
      }
  });
</script>