<section class="scrollable wrapper">
    
	<div class="row">
	    <div class="col-lg-4">
            <h4>$scope.fecha = {{ date | json }}</h4>
            
	        <input type="text" class="form-control" data-show-format="yyyy/mm/dd" data-format="YYYY-MM-DD" data-model="date" date-picker="datePickerOpts">
	    </div>
    </div>
	<div class="row">
	    <div class="col-lg-4">
	    	<h4>date-range-picker</h4>
	    	<input
	    		type="text"
	    		class="form-control"
	    		date-range-picker="dateRangeOpts"
	    		data-model="dateRange"
	    		data-show-format="DD/MM, YYYY"
	    		data-format="YYYY-MM-DD"
	    		data-on-change="onChangeRange"
	    	>
	    </div>
	    <div class="col-lg-8">
	    	<h5>Descripción</h5>
	    	<pre>data-model es un array que almacena 2 valores (el inicio y el final)</pre>
	    	<h5>data-model</h5>
	    	<pre>{{ dateRange }}</pre>
	    </div>
    </div>
    
</section>

<script>
	angularScope(function ($scope) {
		//$scope.dateRange = ['2016-04-05', '2016-04-30'];
	});
</script>