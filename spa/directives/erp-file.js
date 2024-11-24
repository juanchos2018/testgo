window.angular.module('ERP').directive('erpFile', [
	'$document',
	function ($document) {
		return {
			restrict : 'E',
			scope: {
				model: '=',
				placeholder: '@',
				accept: '@?',
				callback: '&'
			},
			link: function (scope, element, attrs) {
				var setFile = function (file) {
					var clbk = true;

					if (attrs.accept !== undefined) {
						if (!(new RegExp("\\" + attrs.accept + '$') .test(file.name))) {
							clbk = false;
						}
					}

					element.find('.row').css('display', 'none');
					element.find('.dropfile').removeClass('hover');

					if (clbk) {
						scope.model.name = file.name;
						scope.model.blob = file;

						scope.callback();
						scope.$apply();
					} else {
						alert('El archivo no tiene una extensión válida (' + attrs.accept + ')');
					}
				};

				element.find('input[type="file"]').bind('change', function (event) {
					setFile(event.target.files[0]);
				});

				$document.bind('dragover', function (e) {
					e.preventDefault();

					if (element.find('.row').css('display') === 'none') {
						element.find('.row').css('display', 'block');
					}
				});

				element.find('.dropfile').bind('dragover', function (e) {
					angular.element(this).addClass('hover');
				});

				element.find('.dropfile').bind('dragleave', function (e) {
					element.find('.dropfile').removeClass('hover');
				});

				element.find('.dropfile').get(0).addEventListener('drop', function (event) {
					event.preventDefault();

					if (event.dataTransfer.files.length > 0) {
						setFile(event.dataTransfer.files[0]);
					}
				});
			},
			template: '\
				<div class="row" style="margin-bottom:20px;display:none">\
	                <div class="col-sm-12">\
	                    <div class="dropfile dropfile-single visible-lg">\
	                    </div>\
	                </div>\
	            </div>\
				\
	            <div class="input-group m-b">\
	                <input type="text" ng-model="model.name" class="form-control" data-trigger="change" data-required="true" placeholder="{{placeholder}}" readonly />\
	                <span class="input-group-btn" style="vertical-align:top">\
	                	<label class="btn btn-default" type="button">\
	                		Seleccionar\
	                		<input type="file" style="position:absolute;opacity:0;width:0;height:0" accept="{{accept}}" />\
	                	</label>\
	                </span>\
	            </div>\
	        '
		};
	}
]);