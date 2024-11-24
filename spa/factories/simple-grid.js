window.angular.module('ERP').factory('SimpleGrid', function () {
    var SimpleGrid = {};
    var data = {};

    SimpleGrid.set = function (id) {
        data[id] = {
            startIndex: 0,
            limitPerPage: 10,
            filteredData: []
        };
    };

    SimpleGrid.startIndex = function (id, value) {
        if (id in data) {
            if (value !== undefined) {
                data[id].startIndex = value;
                return value;
            } else {
                return data[id].startIndex;
            }
        } else {
            return 0;
        }
    };
    
    SimpleGrid.limitPerPage = function (id, value) {
        if (id in data) {
            if (value) {
                data[id].limitPerPage = value;
                return value;
            } else {
                return data[id].limitPerPage;
            }
        } else {
            return 0;
        }
    };

    SimpleGrid.filteredData = function (id, value) {
        if (id in data) {
            if (value) {
                data[id].filteredData = value;
                return value;
            } else {
                return data[id].filteredData;
            }
        } else {
            return 0;
        }
    };

    return SimpleGrid;
});