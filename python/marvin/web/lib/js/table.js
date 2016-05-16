/*
* @Author: Brian Cherinka
* @Date:   2016-04-25 13:56:19
* @Last Modified by:   Brian
* @Last Modified time: 2016-05-11 14:47:29
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {

    // Constructor

    function Table(tablediv) {
        _classCallCheck(this, Table);

        this.setTable(tablediv);
    }

    // Print


    _createClass(Table, [{
        key: 'print',
        value: function print() {
            console.log('I am Table!');
        }

        // Set the initial Table

    }, {
        key: 'setTable',
        value: function setTable(tablediv) {
            if (tablediv !== undefined) {
                console.log('setting the table');
                this.table = tablediv;
            }
        }

        // initialize a table

    }, {
        key: 'initTable',
        value: function initTable(url, data) {
            this.url = url;

            // if data
            if (data.columns !== null) {
                var cols = this.makeColumns(data.columns);
            }

            // init the Bootstrap table
            this.table.bootstrapTable({
                classes: 'table table-bordered table-condensed table-hover',
                toggle: 'table',
                pagination: true,
                pageSize: 10,
                pageList: '[10, 20, 50]',
                sidePagination: 'server',
                method: 'post',
                contentType: "application/x-www-form-urlencoded",
                data: data.rows,
                columns: cols,
                url: url,
                search: true,
                showColumns: true,
                showToggle: true,
                sortName: 'cube.mangaid',
                sortOrder: 'asc',
                formatNoMatches: function formatNoMatches() {
                    return "This table is empty...";
                }
            });
        }

        // make the Table Columns

    }, {
        key: 'makeColumns',
        value: function makeColumns(columns) {
            var cols = [];
            columns.forEach(function (name, index) {
                var colmap = {};
                colmap['field'] = name;
                colmap['title'] = name;
                colmap['sortable'] = true;
                cols.push(colmap);
            });
            return cols;
        }

        // Handle the Bootstrap table JSON response

    }, {
        key: 'handleResponse',
        value: function handleResponse(results) {
            // load the bootstrap table div
            //console.log(this.table, this.table===null, this);
            if (this.table === null) {
                this.setTable();
            }
            this.table = $('#table');
            //console.log('after', this.table, this.table===null, $('#table'));
            // Get new columns
            var cols = results.columns;
            var cols = [];
            results.columns.forEach(function (name, index) {
                var colmap = {};
                colmap['field'] = name;
                colmap['title'] = name;
                colmap['sortable'] = true;
                cols.push(colmap);
            });

            // Load new options
            this.table.bootstrapTable('refreshOptions', { 'columns': cols });

            return results;
        }
    }]);

    return Table;
}();