/* global URL, Blob */

window.angular.module("ERP").controller("PurchasesAddCtrl", [
  "$scope",
  "$rootScope",
  "$window",
  "$filter",
  "$location",
  "$timeout",
  "Page",
  "Settings",
  "FileHandler",
  "Ajax",
  "Session",
  "_baseUrl",
  "_siteUrl",
  "_bootbox",
  "_riot",
  "_$",
  "_moment",
  function (
    $scope,
    $rootScope,
    $window,
    $filter,
    $location,
    $timeout,
    Page,
    Settings,
    FileHandler,
    Ajax,
    Session,
    baseUrl,
    siteUrl,
    bootbox,
    riot,
    $,
    moment
  ) {
    Page.title("Nuevo ingreso");

    $scope.stage = "input";

    $scope.description = "";
    $scope.company = "";
    $scope.inputDate = moment().format("YYYY-MM-DD");
    $scope.currency = "PEN";
    $scope.exchangeRate = 3.6;
    $scope.utility = 50;
    $scope.expenses = 0;

    $scope.paymentDate = "";
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.active = true;

    $scope.supplierId = null;
    $scope.showSupplier = true;

    $scope.downloading = false;
    $scope.saving = false;
    $scope.purchaseOrder = "";
    $scope.regime = "";
    $scope.calculatePrices = true;
    $scope.consigned = false;

    $scope.productExistences = {}; // Objeto que tiene como índices los códigos de productos

    $scope.file = {
      name: "",
      blob: null,
    };

    $scope.purchaseOrderSelect2 = {
      placeholder: "- Seleccione -",
      allowClear: true,
      data: [],
      templateResult: function (product) {
        if (!product.id) {
          return product.text;
        } else {
          return $(`
                        <div class="row">
                            <div class="col-md-8">
                                ${product.text}
                            </div>
                            <div class="col-md-4 hidden-sm hidden-xs text-right">
                            	<i>De:</i> ${product.supplier}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8">
                            	Cód. ${product.code}
                            </div>
                            <div class="col-md-4 hidden-sm hidden-xs text-right">
                            	<i>Para:</i> ${product.company}
                            </div>
                        </div>
                    `);
        }
      },
      templateSelection: function (product) {
        if (!product.id) {
          return product.text;
        } else {
          return product.code + " - " + product.text;
        }
      },
    };

    $scope.setCode = function (n) {
      $scope.code = "COM" + (n || "1").zeros(3);
    };

    $scope.getPurchaseTotal = function () {
      if (!$scope.data.length) {
        return 0;
      } else {
        return $scope.data.reduce(function (pre, cur) {
          return (
            pre +
            parseInt(cur["CANT."], 10) * parseFloat(cur["C.U. EN FACTURA"])
          );
        }, 0);
      }
    };

    $scope.getPurchaseQty = function () {
      if (!$scope.data.length) {
        return 0;
      } else {
        return $scope.data.reduce(function (pre, cur) {
          return pre + parseInt(cur["CANT."], 10);
        }, 0);
      }
    };

    $scope.getProductPurchaseQty = function (code) {
      if (!$scope.data.length) {
        return 0;
      } else {
        return $scope.data.reduce(function (pre, cur) {
          if (cur.CODIGO === code) {
            return pre + parseInt(cur["CANT."], 10);
          } else {
            return pre;
          }
        }, 0);
      }
    };

    $scope.getUnitExpenditure = function () {
      return $scope.expenses / $scope.getPurchaseQty();
    };

    $scope.getCost = function (row) {
      var cost,
        unitExpenditure = $scope.getUnitExpenditure();

      if (row.REGIMEN === "ZOFRA") {
        cost = 1.06 * parseFloat(row["C.U. EN FACTURA"]) + unitExpenditure;
      } else {
        cost =
          (1 + Settings.getTaxFor("General")) *
          (parseFloat(row["C.U. EN FACTURA"]) + unitExpenditure);
      }

      if (row.CODIGO in $scope.productExistences) {
        var existence = $scope.productExistences[row.CODIGO],
          purchaseQty = $scope.getProductPurchaseQty(row.CODIGO);

        if (
          $scope.currency === "USD" &&
          existence.cost_currency === "PEN" &&
          $scope.exchangeRate > 0
        ) {
          // Si la moneda actual es DOLARES pero se tenía el costo en SOLES
          cost =
            ((existence.store_stock * existence.cost) / $scope.exchangeRate +
              purchaseQty * cost) /
            (existence.store_stock + purchaseQty);
        } else {
          cost =
            (existence.store_stock * existence.cost + purchaseQty * cost) /
            (existence.store_stock + purchaseQty);
        }
      }

      return cost;
    };

    $scope.getCalcPrice = function (row) {
      return $scope.getCalcOfferPrice(row) + 20;
    };

    $scope.getCalcOfferPrice = function (row) {
      var price,
        cost = $scope.getCost(row);

      if ($scope.utility) {
        price = (1 + $scope.utility / 100) * cost;
      } else {
        price = cost;
      }

      if ($scope.currency === "USD") {
        price = price * $scope.exchangeRate;
      }

      price = Math.round(price).toString();

      if (price.length < 2) {
        return 9;
      } else if (price[price.length - 1] === 9) {
        return parseInt(price, 10);
      } else {
        return parseInt(
          (parseInt(price.substr(0, price.length - 1), 10) - 1).toString() +
            "9",
          10
        );
      }
    };

    $scope.getPrice = function (row) {
      if ($scope.calculatePrices) {
        return $scope.getCalcPrice(row);
      } else {
        return parseFloat(row.PVP);
      }
    };

    $scope.getOfferPrice = function (row) {
      if ($scope.calculatePrices) {
        return $scope.getCalcOfferPrice(row);
      } else {
        return parseFloat(row["P. OFERTA"]);
      }
    };

    $scope.setSingleTable = function (table, records) {
      $scope[table] = records.split(",").map(function (record) {
        return record.split(":").pop().toUpperCase();
      });

      $scope[table + "List"] = records;
    };

    $scope.setSupplier = function (insertId) {
      $scope.showSupplier = false;

      $timeout(function () {
        $scope.showSupplier = true;
        $scope.supplierId = insertId;
      });
    };

    $scope.changeFile = function (file) {
      var workerText = `
				importScripts('${baseUrl("public/js/jszip/jszip.js")}');
				importScripts('${baseUrl("public/js/xmlparser/simplexmlparser.js")}');

				self.onmessage = function (e) {
					if (e.data.constructor.name === 'ArrayBuffer') {
						try {
							var zip = new JSZip(e.data);
							var workbookFile = zip.file('xl/workbook.xml');

							if (workbookFile) {
								var workbook = parseXML(workbookFile.asText());

								if ('workbook.sheets.sheet[]' in workbook) {
									self.postMessage(workbook['workbook.sheets.sheet[]'].map(function (sheet) {
										return {
											id: sheet.sheetId,
											text: sheet.name
										};
									}));
								} else {
									self.postMessage([]);
								}
							} else {
								self.postMessage([]);
							}
						} catch (e) {
							self.postMessage([]);
						}
					}
				};
			`;

      var workerUrl = URL.createObjectURL(
        new Blob([workerText], { type: "text/javascript" })
      );
      var worker = new Worker(workerUrl);

      FileHandler.toArrayBuffer(file).then(function (arraybuffer) {
        worker.postMessage(arraybuffer, [arraybuffer]);
      });

      worker.onmessage = function (e) {
        $scope.$apply(function () {
          $scope.sheets.length = 0;
          $scope.sheetSelected = "";

          if (e.data.length === 1) {
            $timeout(function () {
              $scope.changeSheet(e.data[0].text);
            });
          } else if (e.data.length > 1) {
            $scope.sheets = e.data;
            $scope.stage = "input";
          } else {
            Session.setMessage(
              "El fichero seleccionado no es un archivo de Excel válido.",
              "danger",
              true
            );
          }
        });

        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };
    };

    $scope.sheets = [];
    $scope.sheetSelected = "";
    //$scope.dataSource = [];
    $scope.data = [];

    $scope.changeSheet = function (val) {
      $scope.sheetSelected = val;
    };

    $scope.$watch("sheetSelected", function (val) {
      if (val) {
        $scope.stage = "loading";

        var worker = new Worker(
          baseUrl("bower_components/js-xlsx/xlsxworker2.js")
        );

        worker.onmessage = function (e) {
          switch (e.data.t) {
            case "ready":
              break;
            case "e":
              console.error("Error!!!", e.data.d);
              worker.terminate();
              break;
            default:
              var workbook = JSON.parse(
                $window.xlsxHelpers
                  .ab2str(e.data)
                  .replace(/\n/g, "\\n")
                  .replace(/\r/g, "\\r")
              );
              var sheet = workbook.Sheets[$scope.sheetSelected];
              var rows = $window.XLSX.utils.sheet_to_csv(sheet).split("\n");

              if (rows.length > 3) {
                // Tiene por lo menos 4 filas (a partir de la 4ta inician los datos)
                var headers = rows[2].split(",");

                if (
                  headers.indexOf("CODIGO") > -1 &&
                  headers.indexOf("TALLA") > -1 &&
                  headers.indexOf("CANT.") > -1 &&
                  headers.indexOf("COD. DE BARRAS") > -1 &&
                  headers.indexOf("LINEA") > -1 &&
                  headers.indexOf("GENERO") > -1 &&
                  headers.indexOf("EDAD") > -1 &&
                  headers.indexOf("DEPORTE") > -1 &&
                  headers.indexOf("MARCA") > -1 &&
                  headers.indexOf("TIPO") > -1 &&
                  headers.indexOf("REGIMEN") > -1 &&
                  headers.indexOf("DESCRIPCION") > -1
                ) {
                  // Tiene el encabezado completo
                  var regime = false,
                    currency = false,
                    hasPrices = false;

                  var dataSource = rows
                    .splice(3)
                    .map(function (row) {
                      if (row.split(",").length === headers.length) {
                        // Fila de datos
                        var result = {};

                        row.split(",").forEach(function (v, i) {
                          result[headers[i]] = v;
                        });

                        if (result.CODIGO && result.TALLA && result["CANT."]) {
                          // Si tiene CODIGO y CANT.
                          result.CODIGO = result.CODIGO.trim(); // quitamos espacios en blanco
                          if (regime === false) {
                            // Si regime no está inicializado
                            regime = result.REGIMEN;
                          } else if (
                            regime.length &&
                            result.REGIMEN !== regime
                          ) {
                            // Si tiene un régimen válido
                            regime = ""; // EL ŕegimen no es válido
                          }

                          if (currency === false) {
                            currency = result["MONEDA EN FACTURA"];
                          } else if (
                            currency.length &&
                            result["MONEDA EN FACTURA"] !== currency
                          ) {
                            currency = "";
                          }

                          if (
                            !hasPrices &&
                            (result.PVP || result["P. OFERTA"])
                          ) {
                            hasPrices = true;
                          }

                          return result;
                        } else {
                          return null;
                        }
                      } else {
                        return null;
                      }
                    })
                    .filter(function (v) {
                      return v !== null;
                    });

                  if (dataSource.length) {
                    if (regime && currency) {
                      if (currency === "PEN" || currency === "USD") {
                        if (hasPrices) {
                          bootbox.dialog({
                            title: "Advertencia",
                            message:
                              "Se encontraron precios en la hoja de cálculo, ¿desea importar estos valores?",
                            buttons: {
                              cancel: {
                                label: "No",
                                className: "btn-default",
                                callback: function () {
                                  $scope.loadData(dataSource, regime, currency);
                                },
                              },
                              ok: {
                                label: "Sí",
                                className: "btn-danger",
                                callback: function () {
                                  $scope.loadData(dataSource, regime, currency);
                                },
                              },
                            },
                            backdrop: true,
                            onEscape: true,
                            size: "small",
                            show: true,
                          });
                        } else {
                          $scope.loadData(dataSource, regime, currency);
                        }
                      } else {
                        $scope.$apply(function () {
                          $scope.stage = "input";
                          $scope.sheetSelected = "";
                          Session.setMessage(
                            'La compra figura con una moneda inválida, ingrese "PEN" o "USD".',
                            "danger",
                            true
                          );
                        });
                      }
                    } else if (!regime) {
                      $scope.$apply(function () {
                        $scope.stage = "input";
                        $scope.sheetSelected = "";
                        Session.setMessage(
                          "Todos los productos deben pertenecer al mismo régimen.",
                          "danger",
                          true
                        );
                      });
                    } else if (!currency) {
                      $scope.$apply(function () {
                        $scope.stage = "input";
                        $scope.sheetSelected = "";
                        Session.setMessage(
                          `Toda la compra debe figurar con una sola moneda, "PEN" O "USD".`,
                          "danger",
                          true
                        );
                      });
                    }
                  } else {
                    $scope.$apply(function () {
                      $scope.stage = "input";
                      $scope.sheetSelected = "";
                      Session.setMessage(
                        "La hoja de cálculo no tiene datos para importar.",
                        "danger",
                        true
                      );
                    });
                  }
                } else {
                  $scope.stage = "input";
                  $scope.sheetSelected = "";

                  if (headers.length < 3) {
                    Session.setMessage(
                      "El archivo no tiene el formato correcto. Los encabezados se deben ubicar en la fila 3.",
                      "danger",
                      true
                    );
                  } else {
                    var missingHeaders = [];

                    if (headers.indexOf("CODIGO") < 0)
                      missingHeaders.push("Código");
                    if (headers.indexOf("TALLA") < 0)
                      missingHeaders.push("Talla");
                    if (headers.indexOf("CANT.") < 0)
                      missingHeaders.push("Cantidad");
                    if (headers.indexOf("COD. DE BARRAS") < 0)
                      missingHeaders.push("Código de barras");
                    if (headers.indexOf("LINEA") < 0)
                      missingHeaders.push("Línea");
                    if (headers.indexOf("GENERO") < 0)
                      missingHeaders.push("Género");
                    if (headers.indexOf("EDAD") < 0)
                      missingHeaders.push("Edad");
                    if (headers.indexOf("DEPORTE") < 0)
                      missingHeaders.push("Deporte");
                    if (headers.indexOf("MARCA") < 0)
                      missingHeaders.push("Marca");
                    if (headers.indexOf("TIPO") < 0)
                      missingHeaders.push("Tipo");
                    if (headers.indexOf("REGIMEN") < 0)
                      missingHeaders.push("Régimen");
                    if (headers.indexOf("DESCRIPCION") < 0)
                      missingHeaders.push("Descripción");

                    Session.setMessage(
                      'El archivo no tiene los encabezados completos. No se encontró: "' +
                        missingHeaders.join('", "') +
                        '".',
                      "danger",
                      true
                    );
                  }

                  $scope.$apply();
                }
              } else {
                $scope.$apply(function () {
                  $scope.stage = "input";
                  $scope.sheetSelected = "";
                  Session.setMessage(
                    "La hoja de cálculo no tiene el formato de la plantilla.",
                    "danger",
                    true
                  );
                });
              }

              worker.terminate();
          }
        };

        FileHandler.toBinaryString($scope.file.blob).then(function (binary) {
          var val = $window.xlsxHelpers.s2ab(binary);

          worker.postMessage(val[1], [val[1]]);
        });
      }
    });

    $scope.$watch("expenses", function (newVal, oldVal) {
      if ($scope.dataTags && $scope.dataTags.length) {
        $scope.dataTags[0].update();
      }
    });

    $scope.$watch("exchangeRate", function (newVal, oldVal) {
      if ($scope.dataTags && $scope.dataTags.length) {
        $scope.dataTags[0].update();
      }
    });

    $scope.$watch("calculatePrices", function (val) {
      if (!val) {
        $scope.data.forEach(function (row) {
          row.PRECIO = $scope.getCalcPrice(row);
          row.PRECIO_OFERTA = $scope.getCalcOfferPrice(row);
        });
      }

      if ($scope.dataTags && $scope.dataTags.length) {
        $scope.dataTags[0].opts.calculatePrices = $scope.calculatePrices;
        $scope.dataTags[0].update();
      }
    });

    $scope.editField = function (title, name, row, items, context, applyToAll) {
      var value = row[name] || row;

      if (typeof items === "string") {
        items = items.split(",").map(function (row) {
          return row.split(":").pop();
        });
      }

      items = $filter("orderBy")(items, "toString()");

      var modal = bootbox.dialog({
        title: title,
        message:
          `
					<div class="row">
						<div class="col-lg-12">
							<div class="radio i-checks m-t-none">
								<label>
									<input type="radio" name="opt" value="1" checked>
									<i></i>
									Cambiar valor
								</label>
							</div>
						</div>
						<div class="col-lg-12" style="padding-left:40px">
							<input type="text" class="form-control" value="${value}">
						</div>
						<div class="col-lg-12">
							<div class="radio i-checks">
								<label>
									<input type="radio" name="opt" value="2">
									<i></i>
									Reemplazar por registro
								</label>
							</div>
						</div>
						<div class="col-lg-12" style="padding-left:40px">
							<select class="form-control" disabled>
								<option>${items.join("</option><option>")}</option>
							</select>
						</div>
					</div>
				` +
          (applyToAll !== true
            ? `
					<div class="row">
						<div class="col-lg-12 m-t">
							<div class="checkbox i-checks">
								<label>
									<input type="checkbox" name="all">
									<i></i>
									Aplicar a todas las coincidencias
								</label>
							</div>
						</div>
					</div>
				`
            : ""),
        buttons: {
          cancel: {
            label: "Cancelar",
            className: "btn-default",
          },
          ok: {
            label: "Aceptar",
            className: "btn-primary",
            callback: function () {
              var newVal = "";

              if (modal.find('[name="opt"]:checked').val() === "1") {
                newVal = modal.find('input[type="text"]').val();
              } else {
                newVal = modal.find("select").val();
              }

              if (
                modal.find('[name="all"]').is(":checked") ||
                applyToAll === true
              ) {
                $scope.data = $scope.data.map(function (data) {
                  if (data[name] === value) {
                    data[name] = newVal;
                  }

                  return data;
                });

                (context.parent || context).update({
                  data: $scope.data,
                });
              } else {
                row[name] = newVal;
                context.update();
              }
            },
          },
        },
        backdrop: true,
        onEscape: true,
        size: "small",
        show: false,
      });

      modal
        .on("shown.bs.modal", function () {
          modal
            .find('input[type="text"]')
            .select()
            .focus()
            .on("input", function () {
              if (!this.value.length) {
                modal.find('[data-bb-handler="ok"]').prop("disabled", true);
              } else {
                modal.find('[data-bb-handler="ok"]').prop("disabled", false);
              }
            });
          modal.find('[name="opt"]').change(function () {
            if (this.checked) {
              if (this.value === "1") {
                modal.find('input[type="text"]').prop("disabled", false);
                modal.find("select").prop("disabled", true);
              } else {
                modal.find('input[type="text"]').prop("disabled", true);
                modal.find("select").prop("disabled", false);
              }
            }
          });
        })
        .modal("show");
    };

    $scope.changeCompany = function () {
      // Cuando se cambia la selección de la empresa
      if ($scope.stage === "data") {
        $scope.stage = "loading";
        $scope.loadData();
      }
    };

    $scope.loadData = function (dataSource, regime, currency) {
      if ($scope.company) {
        dataSource = dataSource || $scope.data;

        var codes = [];

        if (regime) {
          // Si se cambia el régimen
          $scope.regime = regime;
        }

        if (currency && $scope.currency !== currency) {
          $scope.currency = currency;
        }

        dataSource.forEach(function (row) {
          if (codes.indexOf(row.CODIGO) < 0) {
            codes.push(row.CODIGO);
          }
        });

        Ajax.post(siteUrl("products/verify_for_purchase/" + $scope.company), {
          codes: codes.join(","),
        }).then(
          function (res) {
            var oldData = $scope.data;

            $scope.productExistences = null; // Elimina el objeto anterior
            $scope.productExistences = {};

            res.data.forEach(function (item) {
              var store_stock = parseInt(item.store_stock || 0, 10);

              if (store_stock > 0) {
                if (item.code in $scope.productExistences) {
                  $scope.productExistences[
                    item.code
                  ].store_stock += store_stock;
                } else {
                  $scope.productExistences[item.code] = {
                    store_stock: store_stock,
                    cost_currency: item.cost_currency === "D" ? "USD" : "PEN",
                    cost: parseFloat(item.cost),
                  };
                }
              }
            });

            $scope.data = dataSource.map(function (row) {
              var found = res.data.find(function (item) {
                return item.code === row.CODIGO && item.size === row.TALLA;
              });

              if (found !== undefined) {
                row.COSTO = parseFloat(found.cost);
                row.COSTO_FACTURA = parseFloat(found.invoice_cost);
                row.STOCK = parseInt(found.store_stock || 0, 10);

                row.stock_id = found.stock_id;
                row.product_barcode_id = found.product_barcode_id;
                row.product_detail_id = found.product_detail_id;
                row.product_id = found.product_id;
                row.size_id = found.size_id;
              } else {
                found = res.data.find(function (item) {
                  return item.code === row.CODIGO;
                });

                if (found !== undefined) {
                  row.COSTO = parseFloat(found.cost); // Se encuentra en product_details
                  row.COSTO_FACTURA = parseFloat(found.invoice_cost); // Se encuentra en product_details
                  row.STOCK = 0;

                  row.stock_id = "";
                  row.product_barcode_id = "";
                  row.product_detail_id = found.product_detail_id;
                  row.product_id = found.product_id;
                  row.size_id = "";
                } else {
                  row.COSTO = 0;
                  row.COSTO_FACTURA = 0;
                  row.STOCK = 0;

                  row.stock_id = "";
                  row.product_barcode_id = "";
                  row.product_detail_id = "";
                  row.product_id = "";
                  row.size_id = "";
                }
              }

              if (row.product_detail_id) {
                // Si se encontró product_detail_id
                if (found.cost_currency === "D") {
                  row.MONEDA_COSTO = "$";
                } else {
                  row.MONEDA_COSTO = "S/";
                }
              } else {
                row.MONEDA_COSTO = "";
              }

              row.REGIMEN =
                row.REGIMEN.toUpperCase() === "ZOFRA" ? "ZOFRA" : "General";

              return row;
            });

            oldData.length = 0;

            $timeout(function () {
              $scope.stage = "data";
              $scope.$apply();

              $scope.dataTags = riot.mount(
                document.querySelector(
                  '[ng-view] [data-stage="data"] riot-table'
                ),
                "riot-table",
                {
                  data: $scope.data,
                  categories: $scope.categories,
                  genders: $scope.genders,
                  ages: $scope.ages,
                  uses: $scope.uses,
                  brands: $scope.brands,
                  subcategories: $scope.subcategories,
                  sizes: $scope.sizes,
                  calculatePrices: $scope.calculatePrices,
                  editCategory: function (e) {
                    $scope.editField(
                      "Línea",
                      "LINEA",
                      e.item.row,
                      $scope.categoriesList,
                      this
                    );
                  },
                  editGender: function (e) {
                    $scope.editField(
                      "Género",
                      "GENERO",
                      e.item.row,
                      $scope.gendersList,
                      this
                    );
                  },
                  editAge: function (e) {
                    $scope.editField(
                      "Edad",
                      "EDAD",
                      e.item.row,
                      $scope.agesList,
                      this
                    );
                  },
                  editUse: function (e) {
                    $scope.editField(
                      "Deporte",
                      "DEPORTE",
                      e.item.row,
                      $scope.usesList,
                      this
                    );
                  },
                  editBrand: function (e) {
                    $scope.editField(
                      "Marca",
                      "MARCA",
                      e.item.row,
                      $scope.brandsList,
                      this
                    );
                  },
                  editSubcategory: function (e) {
                    $scope.editField(
                      "Tipo",
                      "TIPO",
                      e.item.row,
                      $scope.subcategoriesList,
                      this
                    );
                  },
                  editSize: function (e) {
                    $scope.editField(
                      "Talla",
                      "TALLA",
                      e.item.row,
                      $scope.sizesList,
                      this
                    );
                  },
                  setQty: function (e) {
                    e.item.row["CANT."] = e.target.value;

                    $scope.$apply();
                  },
                  setDescription: function (e) {
                    e.item.row.DESCRIPCION = e.target.value;
                  },
                  setInvoiceCost: function (e) {
                    e.item.row["C.U. EN FACTURA"] = e.target.value;

                    $scope.$apply();
                  },
                  setPrice: function (e) {
                    if (!$scope.calculatePrices) {
                      var code = e.item.row.CODIGO;

                      $scope.data.forEach(function (row) {
                        if (row.CODIGO === code) {
                          row.PRECIO = parseFloat(e.target.value) || 0;
                        }
                      });
                    }
                  },
                  setOfferPrice: function (e) {
                    if (!$scope.calculatePrices) {
                      var code = e.item.row.CODIGO;

                      $scope.data.forEach(function (row) {
                        if (row.CODIGO === code) {
                          row.PRECIO_OFERTA = parseFloat(e.target.value) || 0;
                        }
                      });
                    }
                  },
                  deleteItem: function (e) {
                    $scope.$apply(function () {
                      $scope.data.splice($scope.data.indexOf(e.item.row), 1);

                      if ($scope.data.length) {
                        $scope.dataTags[0].update({
                          data: $scope.data,
                        });
                      } else {
                        $scope.sheetSelected = "";
                        $scope.stage = "input";
                      }
                    });
                  },
                  getCurrencyAlias: function () {
                    return $scope.currency === "USD" ? "$" : "S/";
                  },
                  getUnitExpenditure: function () {
                    return $scope.getUnitExpenditure();
                  },
                  getCost: function (item) {
                    return $scope.getCost(item.row);
                  },
                  getPrice: function (item) {
                    return $scope.getPrice(item.row);
                  },
                  getOfferPrice: function (item) {
                    return $scope.getOfferPrice(item.row);
                  },
                }
              );
            }, 1000);
          },
          function (reason) {
            $scope.stage = "input";
            $scope.sheetSelected = "";

            Session.setMessage(
              "Ocurrió un error al verificar el stock de productos",
              "danger",
              true
            );
            console.error("%cAjax error:", "font-weight:bold", reason);
          }
        );
      } else {
        $scope.$apply(function () {
          Session.setMessage("Debe seleccionar una empresa.", "danger", true);
        });
      }
    };

    $scope.getTable = function (items, title, name, group) {
      var records = "";

      items.forEach(function (record, index) {
        records += `
					<tr>
						<td class="text-center">${index + 1}</td>
						<td>${record}</td>
						<td class="text-center">
							<a href="#" data-field-title="${title}" data-field="${name}" data-field-items="${group}">Editar</a>
						</td>
					</tr>
				`;
      });

      return `
				<table class="table">
					<thead>
						<tr>
							<th style="width:80px" class="text-center">N°</th>
							<th class="text-center">Descripción</th>
							<th style="width:120px" class="text-center">Acción</th>
						</tr>
					</thead>
					<tbody>
						${records}
					</tbody>
				</table>
			`;
    };

    $scope.getInvoicesTable = function (items) {
      var records = "";

      items.forEach(function (item, index) {
        records += `
					<tr>
						<td class="text-center">${index + 1}</td>
						<td>N° ${item.number}</td>
						<td class="text-center">${item.date}</td>
						<td class="text-right">${item.amount.toFixed(2)}</td>
					</tr>
				`;
      });

      return `
				<table class="table">
					<thead>
						<tr>
							<th style="width:80px" class="text-center">N°</th>
							<th class="text-center">Serie</th>
							<th style="width:100px" class="text-center">Fecha</th>
							<th style="width:120px" class="text-center">Monto (${
                $scope.currency === "USD" ? "$" : "S/"
              })</th>
						</tr>
					</thead>
					<tbody>
						${records}
					</tbody>
				</table>
			`;
    };

    $scope.getProductsTable = function (items) {
      var records = "";

      items.forEach(function (record, index) {
        records += `
					<tr>
						<td class="text-center">${index + 1}</td>
						<td>${record.code}</td>
						<td>${record.description}</td>
					</tr>
				`;
      });

      return `
				<table class="table">
					<thead>
						<tr>
							<th style="width:80px" class="text-center">N°</th>
							<th style="width:150px" class="text-center">Código</th>
							<th class="text-center">Descripción</th>
						</tr>
					</thead>
					<tbody>
						${records}
					</tbody>
				</table>
			`;
    };

    $scope.downloadData = function () {
      $scope.downloading = true;

      FileHandler.get(
        baseUrl("public/files/templates/purchase_full.xlsx"),
        "arraybuffer"
      ).then(function (file) {
        var template = new XlsxTemplate(file, { autoClose: true });
        var xlsxData = $scope.data.map(function (item) {
          item.unitExpenditure = $scope.getUnitExpenditure(item).toFixed(2);
          item.cost = $scope.getCost(item);
          item.price = $scope.getPrice(item);
          item.offerPrice = $scope.getOfferPrice(item);

          return item;
        });

        template.putData(xlsxData, "A4:X4", function (data) {
          return data.map(function (item, index) {
            var row = [];

            row.push(index + 1); // A
            row.push(item.CODIGO); // B
            row.push(item.TALLA); // C
            row.push(item["CANT."] || 0); // D
            row.push(item["COD. DE BARRAS"] || null); // E
            row.push(item.LINEA || null); // F
            row.push(item.GENERO || null); // G
            row.push(item.EDAD || null); // H
            row.push(item.DEPORTE || null); // I
            row.push(item.MARCA || null); // J
            row.push(item.TIPO || null); // K
            row.push(item.REGIMEN || null); // L
            row.push(item["D. SALIDA"] || null); // M
            row.push(item.DESCRIPCION || null); // N
            row.push(item["N° FACTURA"] || null); // O
            row.push(item["FECHA DE FACTURA"] || null); // P
            row.push(item["MONEDA EN FACTURA"] || null); // Q
            row.push(item["C.U. EN FACTURA"] || 0); // R
            row.push(null); // S
            row.push(item.unitExpenditure); // T
            row.push(item.COSTO.toFixed(2)); // U
            row.push(item.cost); // V
            row.push(item.price); // W
            row.push(item.offerPrice); // X

            return row;
          });
        });

        template.on("build", function (blob) {
          var supplierChooser = $("erp-supplier-chooser select");
          var filename = "pedido_";

          if (supplierChooser.val() && supplierChooser.select2("data").length) {
            filename += supplierChooser
              .select2("data")[0]
              .text.toLowerCase()
              .replace(/\W/gi, "_");
          } else {
            filename += $scope.code.toLowerCase();
          }

          filename += "_" + moment().format("YYYY-MM-DD_HHmmss") + ".xlsx";

          FileHandler.download(blob, filename);

          $scope.$apply(function () {
            $scope.downloading = false;
          });
        });

        template.build();
      });
    };

    $scope.finish = function () {
      if (
        $scope.data.filter(function (value) {
          return (parseInt(value["CANT."], 10) || 0) < 1;
        }).length
      ) {
        bootbox.dialog({
          title: "Se encontraron registros no válidos",
          message: "Algunos registros tienen stock cero.",
          buttons: {
            ok: {
              label: "Aceptar",
              className: "btn-danger",
            },
          },
        });
      } else if (
        $scope.data.filter(function (value) {
          return !value.product_id && !value.DESCRIPCION.length;
        }).length
      ) {
        bootbox.dialog({
          title: "Se encontraron registros no válidos",
          message: "Algunos productos nuevos no tienen descripción.",
          buttons: {
            ok: {
              label: "Aceptar",
              className: "btn-danger",
            },
          },
        });
      } else if (
        $scope.data.filter(function (value) {
          return (parseFloat(value["C.U. EN FACTURA"]) || 0) <= 0;
        }).length
      ) {
        bootbox.dialog({
          title: "Se encontraron datos incorrectos",
          message: "Algunos registros tienen costo según factura no válido.",
          buttons: {
            ok: {
              label: "Aceptar",
              className: "btn-danger",
            },
          },
        });
      } else if (
        !$scope.calculatePrices &&
        $scope.data.filter(function (value) {
          return (
            (parseFloat(value.PVP) || 0) <= 0 ||
            (parseFloat(value["P. OFERTA"]) || 0) <= 0
          );
        }).length
      ) {
        bootbox.dialog({
          title: "Se encontraron datos incorrectos",
          message: "Algunos registros tienen precios no válidos.",
          buttons: {
            ok: {
              label: "Aceptar",
              className: "btn-danger",
            },
          },
        });
      } else if (
        $scope.data.filter(function (value) {
          return !/^\d+\-\d+$/.test(value["N° FACTURA"]);
        }).length
      ) {
        bootbox.dialog({
          title: "Se encontraron datos incorrectos",
          message:
            "Algunos registros no tienen N° de factura en formato válido.",
          buttons: {
            ok: {
              label: "Aceptar",
              className: "btn-danger",
            },
          },
        });
      } else if (
        $scope.data.filter(function (value) {
          return !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value["FECHA DE FACTURA"]);
        }).length
      ) {
        bootbox.dialog({
          title: "Se encontraron datos incorrectos",
          message:
            "Algunas fechas de factura no tienen un formato válido (dd/mm/yyyy).",
          buttons: {
            ok: {
              label: "Aceptar",
              className: "btn-danger",
            },
          },
        });
      } else {
        var newProducts = [];
        var newSizes = [];
        var newCategories = [];
        var newGenders = [];
        var newAges = [];
        var newUses = [];
        var newBrands = [];
        var newSubcategories = [];
        var newInvoices = [];

        $scope.data.forEach(function (item) {
          if (!item.product_id) {
            if (
              !newProducts.find(function (product) {
                return product.code === item.CODIGO;
              })
            ) {
              newProducts.push({
                code: item.CODIGO,
                description: item.DESCRIPCION,
              });
            }
          }

          var invoiceFound = newInvoices.find(function (invoice) {
            return invoice.number === item["N° FACTURA"];
          });

          if (invoiceFound !== undefined) {
            invoiceFound.amount +=
              parseFloat(item["C.U. EN FACTURA"]) * parseInt(item["CANT."], 10);
          } else {
            newInvoices.push({
              number: item["N° FACTURA"],
              date: moment(item["FECHA DE FACTURA"], "DD/MM/YYYY").format(
                "YYYY-MM-DD"
              ),
              amount:
                parseFloat(item["C.U. EN FACTURA"]) *
                parseInt(item["CANT."], 10),
            });
          }

          if (
            item.TALLA &&
            $scope.sizes.indexOf(item.TALLA.toUpperCase()) < 0 &&
            newSizes.indexOf(item.TALLA) < 0
          ) {
            newSizes.push(item.TALLA);
          }

          if (
            item.LINEA &&
            $scope.categories.indexOf(item.LINEA.toUpperCase()) < 0 &&
            newCategories.indexOf(item.LINEA) < 0
          ) {
            newCategories.push(item.LINEA);
          }

          if (
            item.GENERO &&
            $scope.genders.indexOf(item.GENERO.toUpperCase()) < 0 &&
            newGenders.indexOf(item.GENERO) < 0
          ) {
            newGenders.push(item.GENERO);
          }

          if (
            item.EDAD &&
            $scope.ages.indexOf(item.EDAD.toUpperCase()) < 0 &&
            newAges.indexOf(item.EDAD) < 0
          ) {
            newAges.push(item.EDAD);
          }

          if (
            item.DEPORTE &&
            $scope.uses.indexOf(item.DEPORTE.toUpperCase()) < 0 &&
            newUses.indexOf(item.DEPORTE) < 0
          ) {
            newUses.push(item.DEPORTE);
          }

          if (
            item.MARCA &&
            $scope.brands.indexOf(item.MARCA.toUpperCase()) < 0 &&
            newBrands.indexOf(item.MARCA) < 0
          ) {
            newBrands.push(item.MARCA);
          }

          if (
            item.TIPO &&
            $scope.subcategories.indexOf(item.TIPO.toUpperCase()) < 0 &&
            newSubcategories.indexOf(item.TIPO) < 0
          ) {
            newSubcategories.push(item.TIPO);
          }
        });

        if (
          newInvoices.length ||
          newProducts.length ||
          newSizes.length ||
          newCategories.length ||
          newGenders.length ||
          newAges.length ||
          newUses.length ||
          newBrands.length ||
          newSubcategories.length
        ) {
          var panelHeading = "",
            panelBody = "",
            params = {};

          if (newInvoices.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="invoices">Facturas (${
              newInvoices.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="invoices">
								${$scope.getInvoicesTable(newInvoices)}
							</div>
						`;
          }

          if (newProducts.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="products">Productos (${
              newProducts.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="products">
								${$scope.getProductsTable(newProducts)}
							</div>
						`;
          }

          if (newSizes.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="sizes">Tallas (${
              newSizes.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="sizes">
								${$scope.getTable(newSizes, "Talla", "TALLA", "sizes")}
							</div>
						`;

            params.sizes = newSizes;
          }

          if (newCategories.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="category">Líneas (${
              newCategories.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="category">
								${$scope.getTable(newCategories, "Línea", "LINEA", "categories")}
							</div>
						`;

            params.categories = newCategories;
          }

          if (newGenders.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="gender">Géneros (${
              newGenders.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="gender">
								${$scope.getTable(newGenders, "Género", "GENERO", "genders")}
							</div>
						`;

            params.genders = newGenders;
          }

          if (newAges.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="age">Edades (${
              newAges.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="age">
								${$scope.getTable(newAges, "Edad", "EDAD", "ages")}
							</div>
						`;

            params.ages = newAges;
          }

          if (newUses.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="use">Deportes (${
              newUses.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="use">
								${$scope.getTable(newUses, "Deporte", "DEPORTE", "uses")}
							</div>
						`;

            params.uses = newUses;
          }

          if (newBrands.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="brand">Marcas (${
              newBrands.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${!panelBody.length ? "active" : ""}" data-tab="brand">
								${$scope.getTable(newBrands, "Marca", "MARCA", "brands")}
							</div>
						`;

            params.brands = newBrands;
          }

          if (newSubcategories.length) {
            panelHeading += `<li class="${
              !panelHeading.length ? "active" : ""
            }" style="float:none;display:inline-block"><a href="#" data-target="subcategory">Tipos (${
              newSubcategories.length
            })</a></li>`;

            panelBody += `
							<div class="tab-pane ${
                !panelBody.length ? "active" : ""
              }" data-tab="subcategory">
								${$scope.getTable(newSubcategories, "Tipo", "TIPO", "subcategories")}
							</div>
						`;

            params.subcategories = newSubcategories;
          }

          var modal = bootbox.dialog({
            title: "Advertencia",
            message: `
							<div class="row">
								<div class="col-lg-12 m-b">
									Se encontraron registros desconocidos que serán almacenados como nuevos.
								</div>
								<div class="col-lg-12">
									<section class="panel panel-default">
										<header class="panel-heading">
											<ul class="nav nav-tabs" style="white-space:nowrap;overflow-x:auto;overflow-y:hidden">
												${panelHeading}
											</ul>
										</header>
										<div class="panel-body">
											<div class="tab-content">
												${panelBody}
											</div>
										</div>
									</section>
								</div>
							</div>
						`,
            buttons: {
              cancel: {
                label: "Cancelar",
                className: "btn-default",
              },
              ok: {
                label: "Continuar",
                className: "btn-danger",
                callback: function () {
                  if (Object.keys(params).length) {
                    modal.find('[data-bb-handler="ok"]').prop("disabled", true);

                    Ajax.post(siteUrl("products/save_single_tables"), params)
                      .then(
                        function (res) {
                          if (res.data.sizes.length) {
                            $scope.sizesList += "," + res.data.sizes;
                          }

                          if (res.data.categories.length) {
                            $scope.categoriesList += "," + res.data.categories;
                          }

                          if (res.data.genders.length) {
                            $scope.gendersList += "," + res.data.genders;
                          }

                          if (res.data.ages.length) {
                            $scope.agesList += "," + res.data.ages;
                          }

                          if (res.data.uses.length) {
                            $scope.usesList += "," + res.data.uses;
                          }

                          if (res.data.brands.length) {
                            $scope.brandsList += "," + res.data.brands;
                          }

                          if (res.data.subcategories.length) {
                            $scope.subcategoriesList +=
                              "," + res.data.subcategories;
                          }

                          modal.one("hidden.bs.modal", function () {
                            $scope.save(newInvoices);
                          });
                        },
                        function (reason) {
                          Session.setMessage(
                            "Ocurrió un error al guardar los nuevos registros.",
                            "danger",
                            true
                          );
                          console.error(
                            "%cAjax error:",
                            "font-weight:bold",
                            reason
                          );
                        }
                      )
                      .finally(function () {
                        modal.modal("hide");
                      });

                    return false;
                  } else {
                    $scope.save(newInvoices);
                  }
                },
              },
            },
            backdrop: true,
            onEscape: true,
            show: false,
          });

          modal
            .on("show.bs.modal", function () {
              modal.find("[data-target]").mousedown(function (e) {
                e.preventDefault();

                modal
                  .find(".nav > .active, .tab-pane.active")
                  .removeClass("active");
                $(this).parent().addClass("active");
                modal
                  .find('[data-tab="' + $(this).data("target") + '"]')
                  .addClass("active");
              });

              modal.find("[data-field]").click(function () {
                var anchor = $(this);

                modal
                  .one("hidden.bs.modal", function () {
                    if ($scope.dataTags.length) {
                      $scope.editField(
                        anchor.data("fieldTitle"),
                        anchor.data("field"),
                        anchor.parent().prev().text(),
                        $scope[anchor.data("fieldItems")],
                        $scope.dataTags[0],
                        true
                      );
                    }
                  })
                  .modal("hide");
              });
            })
            .modal("show");
        } else {
          $scope.save();
        }
      }
    };

    $scope.save = function (newInvoices) {
      $scope.saving = true;

      var transform = function (item) {
        var parts = item.split(":");

        return {
          id: parts[0] || 0,
          description: parts[1] || "",
        };
      };

      var finder = function (description) {
        return function (item) {
          return item.description.toUpperCase() === description.toUpperCase();
        };
      };

      var categories = $scope.categoriesList.split(",").map(transform);
      var genders = $scope.gendersList.split(",").map(transform);
      var ages = $scope.agesList.split(",").map(transform);
      var uses = $scope.usesList.split(",").map(transform);
      var brands = $scope.brandsList.split(",").map(transform);
      var subcategories = $scope.subcategoriesList.split(",").map(transform);
      var sizes = $scope.sizesList.split(",").map(transform);

      var productDetails = {};

      Ajax.post(siteUrl("purchases/save"), {
        input_date: $scope.inputDate,
        amount: $scope.getPurchaseTotal().toFixed(2),
        supplier_id: $scope.supplierId,
        company_id: $scope.company,
        purchase_order_id: $scope.purchaseOrder,
        utility: $scope.utility,
        currency: $scope.currency === "USD" ? "D" : "S",
        expenses: $scope.expenses,
        igv: Settings.getTaxFor($scope.regime),
        exchange_rate: $scope.exchangeRate,
        automatic_prices: $scope.calculatePrices ? "t" : "f",
        consigned: $scope.consigned ? "t" : "f",
        details: $scope.data.map(function (detail) {
          if (!(detail.CODIGO in productDetails)) {
            productDetails[detail.CODIGO] = {
              product_id: detail.product_id || "",
              invoice_cost: detail["C.U. EN FACTURA"],
              cost: $scope.getCost(detail).toFixed(2),
              price: $scope.getPrice(detail),
              offer_price: $scope.getOfferPrice(detail),
              product_description: detail.DESCRIPCION,
              product_regime: detail.REGIMEN,
              product_output_statement: detail["D. SALIDA"]
                ? detail["D. SALIDA"] + " "
                : "", // Para que sea tratada coo cadena de texto
              product_category_id:
                (categories.find(finder(detail.LINEA)) || {}).id || "",
              product_gender_id:
                (genders.find(finder(detail.GENERO)) || {}).id || "",
              product_age_id: (ages.find(finder(detail.EDAD)) || {}).id || "",
              product_use_id:
                (uses.find(finder(detail.DEPORTE)) || {}).id || "",
              product_brand_id:
                (brands.find(finder(detail.MARCA)) || {}).id || "",
              product_subcategory_id:
                (subcategories.find(finder(detail.TIPO)) || {}).id || "",
            };
          }

          return {
            quantity: detail["CANT."],
            invoice: detail["N° FACTURA"],
            product_code: detail.CODIGO,
            product_size_id: (sizes.find(finder(detail.TALLA)) || {}).id || "",
            product_barcode: detail["COD. DE BARRAS"]
              ? detail["COD. DE BARRAS"] + " "
              : "",
            product_detail_id: detail.product_detail_id || "",
            product_barcode_id: detail.product_barcode_id || "",
            stock_id: detail.stock_id || "",
          };
        }),
        invoices: newInvoices,
        product_details: productDetails,
      })
        .then(
          function (res) {
            if (res.data.ok) {
              Session.setMessage("Se guardó el registro correctamente");
              $location.path("purchases");
            } else {
              Session.setMessage(
                res.data.error || "Ocurrió un error",
                "danger",
                true
              );
            }
          },
          function (reason) {
            Session.setMessage(reason || "Ocurrió un error", "danger", true);
          }
        )
        .finally(function () {
          $scope.saving = false;
        });
    };

    $scope.$on("$viewContentLoaded", function () {
      $('select[ng-model="purchaseOrder"]').on("change", function (e) {
        var data = $(this).select2("data");

        $scope.$apply(function () {
          if (data.length && data[0].id) {
            $scope.company = data[0].company_id;
            $scope.supplierId = data[0].supplier_id;
          } else {
            $scope.company = "2"; // Por defecto es Gafco
            $scope.supplierId = null;
          }
        });
      });
    });
  },
]);
