/*
* @Author: Brian Cherinka
* @Date:   2016-04-29 09:29:24
* @Last Modified by:   Brian
* @Last Modified time: 2016-04-29 09:45:04
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Carousel = function () {

    // Constructor
    function Carousel(cardiv, thumbs) {
        _classCallCheck(this, Carousel);

        this.carouseldiv = $(cardiv);
        this.thumbsdiv = thumbs !== undefined ? $(thumbs) : $('[id^=carousel-selector-]');

        // init the carousel
        this.carouseldiv.carousel({
            interval: 5000
        });

        // Event handlers
        this.thumbsdiv.on('click', this, this.handleThumbs);
        this.carouseldiv.on('slid.bs.carousel', this, this.updateText);
    }

    // Print


    _createClass(Carousel, [{
        key: 'print',
        value: function print() {
            console.log('I am Carousel!');
        }

        // Handle the carousel thumbnails

    }, {
        key: 'handleThumbs',
        value: function handleThumbs(event) {
            var _this = event.data;
            var id_selector = $(this).attr("id");
            try {
                var id = /-(\d+)$/.exec(id_selector)[1];
                //console.log(id_selector, id);
                _this.carouseldiv.carousel(parseInt(id));
            } catch (e) {
                console.log('MyCarousel: Regex failed!', e);
            }
        }

        // When carousel slides, auto update the text

    }, {
        key: 'updateText',
        value: function updateText(event) {
            var _this = event.data;
            var id = $('.item.active').data('slide-number');
            $('#carousel-text').html($('#slide-content-' + id).html());
        }
    }]);

    return Carousel;
}();
;/*
* @Author: Brian Cherinka
* @Date:   2016-04-13 16:49:00
* @Last Modified by:   Brian Cherinka
* @Last Modified time: 2016-08-30 14:02:14
*/

//
// Javascript Galaxy object handling JS things for a single galaxy
//

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Galaxy = function () {

    // Constructor
    function Galaxy(plateifu) {
        _classCallCheck(this, Galaxy);

        this.setPlateIfu(plateifu);
        this.maindiv = $('#' + this.plateifu);
        this.metadiv = this.maindiv.find('#metadata');
        this.specdiv = this.maindiv.find('#specview');
        this.imagediv = this.specdiv.find('#imagediv');
        this.mapsdiv = this.specdiv.find('#mapsdiv');
        this.mapdiv = this.specdiv.find('#mapdiv1');
        this.graphdiv = this.specdiv.find('#graphdiv');
        this.specmsg = this.specdiv.find('#specmsg');
        this.webspec = null;
        this.staticdiv = this.specdiv.find('#staticdiv');
        this.dynamicdiv = this.specdiv.find('#dynamicdiv');
        this.togglediv = $('#toggleinteract');
        this.qualpop = $('#qualitypopover');
        this.targpops = $('.targpopovers');

        // init some stuff
        this.initFlagPopovers();
    }

    // Test print


    _createClass(Galaxy, [{
        key: 'print',
        value: function print() {
            console.log('We are now printing galaxy', this.plateifu, this.plate, this.ifu);
        }

        // Set the plateifu

    }, {
        key: 'setPlateIfu',
        value: function setPlateIfu(plateifu) {
            if (plateifu === undefined) {
                this.plateifu = $('.singlegalaxy').attr('id');
            } else {
                this.plateifu = plateifu;
            }

            var _plateifu$split = this.plateifu.split('-');

            var _plateifu$split2 = _slicedToArray(_plateifu$split, 2);

            this.plate = _plateifu$split2[0];
            this.ifu = _plateifu$split2[1];
        }

        // Initialize and Load a DyGraph spectrum

    }, {
        key: 'loadSpaxel',
        value: function loadSpaxel(spaxel, title) {
            this.webspec = new Dygraph(this.graphdiv[0], spaxel, {
                title: title,
                labels: ['Wavelength', 'Flux'],
                errorBars: true, // TODO DyGraph shows 2-sigma error bars FIX THIS
                ylabel: 'Flux [10<sup>-17</sup> erg/cm<sup>2</sup>/s/Å]',
                xlabel: 'Wavelength [Ångströms]'
            });
        }
    }, {
        key: 'updateSpecMsg',


        // Update the spectrum message div for errors only
        value: function updateSpecMsg(specmsg, status) {
            this.specmsg.hide();
            if (status !== undefined && status === -1) {
                this.specmsg.show();
            }
            var newmsg = '<strong>' + specmsg + '</strong>';
            this.specmsg.empty();
            this.specmsg.html(newmsg);
        }

        // Update a DyGraph spectrum

    }, {
        key: 'updateSpaxel',
        value: function updateSpaxel(spaxel, specmsg) {
            this.updateSpecMsg(specmsg);
            this.webspec.updateOptions({ 'file': spaxel, 'title': specmsg });
        }
    }, {
        key: 'initOpenLayers',


        // Initialize OpenLayers Map
        value: function initOpenLayers(image) {
            this.image = image;
            this.olmap = new OLMap(image);
            // add click event handler on map to get spaxel
            this.olmap.map.on('singleclick', this.getSpaxel, this);
        }
    }, {
        key: 'initHeatmap',
        value: function initHeatmap(maps) {
            console.log('initHeatmap', this.mapsdiv);
            var mapchildren = this.mapsdiv.children('div');
            var _this = this;
            $.each(mapchildren, function (index, child) {
                var mapdiv = $(child).find('div').first();
                this.heatmap = new HeatMap(mapdiv, maps[index].data, maps[index].msg, _this);
            });
        }
    }, {
        key: 'getSpaxel',


        // Retrieves a new Spaxel from the server based on a given mouse position or xy spaxel coord.
        value: function getSpaxel(event) {
            var mousecoords = event.coordinate === undefined ? null : event.coordinate;
            var divid = $(event.target).parents('div').first().attr('id');
            var maptype = divid !== undefined && divid.search('highcharts') !== -1 ? 'heatmap' : 'optical';
            var x = event.point === undefined ? null : event.point.x;
            var y = event.point === undefined ? null : event.point.y;
            var keys = ['plateifu', 'image', 'imwidth', 'imheight', 'mousecoords', 'type', 'x', 'y'];
            var form = m.utils.buildForm(keys, this.plateifu, this.image, this.olmap.imwidth, this.olmap.imheight, mousecoords, maptype, x, y);
            var _this = this;

            // send the form data
            $.post(Flask.url_for('galaxy_page.getspaxel'), form, 'json').done(function (data) {
                if (data.result.status !== -1) {
                    _this.updateSpaxel(data.result.spectra, data.result.specmsg);
                } else {
                    _this.updateSpecMsg('Error: ' + data.result.specmsg, data.result.status);
                }
            }).fail(function (data) {
                _this.updateSpecMsg('Error: ' + data.result.specmsg, data.result.status);
            });
        }
    }, {
        key: 'toggleInteract',


        // Toggle the interactive OpenLayers map and Dygraph spectra
        value: function toggleInteract(image, maps, spaxel, spectitle) {
            if (this.togglediv.hasClass('active')) {
                // Turning Off
                this.togglediv.toggleClass('btn-danger').toggleClass('btn-success');
                this.togglediv.button('reset');
                this.dynamicdiv.hide();
                this.staticdiv.show();
            } else {
                // Turning On
                this.togglediv.toggleClass('btn-danger').toggleClass('btn-success');
                this.togglediv.button('complete');
                this.staticdiv.hide();
                this.dynamicdiv.show();

                // check for empty divs
                var specempty = this.graphdiv.is(':empty');
                var imageempty = this.imagediv.is(':empty');
                var mapempty = this.mapdiv.is(':empty');
                // load the spaxel if the div is initially empty;
                if (this.graphdiv !== undefined && specempty) {
                    this.loadSpaxel(spaxel, spectitle);
                }
                // load the image if div is empty
                if (imageempty) {
                    this.initOpenLayers(image);
                }
                // load the map if div is empty
                if (mapempty) {
                    this.initHeatmap(maps);
                }
            }
        }
    }, {
        key: 'initFlagPopovers',


        //  Initialize the Quality and Target Popovers
        value: function initFlagPopovers() {
            // DRP Quality Popovers
            this.qualpop.popover({ html: true, content: $('#list_drp3quality').html() });
            // MaNGA Target Popovers
            $.each(this.targpops, function (index, value) {
                // get id of flag link
                var popid = value.id;
                // split id and grab the mngtarg

                var _popid$split = popid.split('_');

                var _popid$split2 = _slicedToArray(_popid$split, 2);

                var base = _popid$split2[0];
                var targ = _popid$split2[1];
                // build the label list id

                var listid = '#list_' + targ;
                // init the specific popover
                $('#' + popid).popover({ html: true, content: $(listid).html() });
            });
        }
    }]);

    return Galaxy;
}();
;/*
* @Author: Brian Cherinka
* @Date:   2016-04-26 21:47:05
* @Last Modified by:   Brian
* @Last Modified time: 2016-05-13 11:19:07
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Header = function () {

    // Constructor
    function Header() {
        _classCallCheck(this, Header);

        this.navbar = $('.navbar');
        this.galidform = $('#headform');
        this.typeahead = $('#headform .typeahead');
        this.mplform = $('#mplform');
        this.mplselect = $('#mplselect');

        this.initTypeahead();

        //Event Handlers
        this.mplselect.on('change', this, this.selectMPL);
    }

    // Print


    _createClass(Header, [{
        key: 'print',
        value: function print() {
            console.log('I am Header!');
        }

        // Initialize the Typeahead

    }, {
        key: 'initTypeahead',
        value: function initTypeahead(typediv, formdiv, url, fxn) {

            var _this = this;
            var typediv = typediv === undefined ? this.typeahead : $(typediv);
            var formdiv = formdiv === undefined ? this.galidform : $(formdiv);
            var typeurl = url === undefined ? Flask.url_for('index_page.getgalidlist') : url;
            var afterfxn = fxn === undefined ? null : fxn;

            // create the bloodhound engine
            this.galids = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                //local:  ["(A)labama","Alaska","Arizona","Arkansas","Arkansas2","Barkansas", 'hello'],
                prefetch: typeurl,
                remote: {
                    url: typeurl,
                    filter: function filter(galids) {
                        return galids;
                    }
                }
            });

            // initialize the bloodhound suggestion engine
            this.galids.initialize();

            typediv.typeahead('destroy');
            typediv.typeahead({
                showHintOnFocus: true,
                source: this.galids.ttAdapter(),
                afterSelect: function afterSelect() {
                    formdiv.submit();
                }
            });
        }

        // Select the MPL version on the web

    }, {
        key: 'selectMPL',
        value: function selectMPL(event) {
            var _this = event.data;
            var url = 'index_page.selectmpl';
            var verform = m.utils.serializeForm('#mplform');
            console.log('setting new mpl', verform);
            _this.sendAjax(verform, url, _this.reloadPage);
        }

        // Reload the Current Page

    }, {
        key: 'reloadPage',
        value: function reloadPage() {
            location.reload(true);
        }

        // Send an AJAX request

    }, {
        key: 'sendAjax',
        value: function sendAjax(form, url, fxn) {
            var _this = this;
            $.post(Flask.url_for(url), form, 'json').done(function (data) {
                // reload the current page, this re-instantiates a new Header with new version info from session
                if (data.result.status == 1) {
                    fxn();
                } else {
                    alert('Failed to set the versions! ' + data.result.msg);
                }
            }).fail(function (data) {
                alert('Failed to set the versions! Problem with Flask setversion. ' + data.result.msg);
            });
        }
    }]);

    return Header;
}();
;/*
* @Author: Brian Cherinka
* @Date:   2016-08-30 11:28:26
* @Last Modified by:   Brian Cherinka
* @Last Modified time: 2016-08-30 13:59:35
*/

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HeatMap = function () {

    // Constructor
    function HeatMap(mapdiv, data, title, galthis) {
        _classCallCheck(this, HeatMap);

        if (data === undefined) {
            console.error('Must specify input map data to initialize a HeatMap!');
        } else if (mapdiv === undefined) {
            console.error('Must specify an input mapdiv to initialize a HeatMap');
        } else {
            this.mapdiv = mapdiv; // div element for map
            this.data = data; // map data
            this.title = title; // map title
            this.galthis = galthis; //the self of the Galaxy class
            this.parseTitle();
            this.initMap();
            // this.colorNoData(Highcharts);
        }
    }

    _createClass(HeatMap, [{
        key: 'print',


        // test print
        value: function print() {
            console.log('We are now printing heatmap for ', this.title);
        }
    }, {
        key: 'parseTitle',


        // Parse the heatmap title into category, parameter, channel
        // e.g. 7443-1901: emline_gflux_ha-6564
        value: function parseTitle() {
            var _title$split = this.title.split(':');

            var _title$split2 = _slicedToArray(_title$split, 2);

            var plateifu = _title$split2[0];
            var newtitle = _title$split2[1];

            var _newtitle$split = newtitle.split('_');

            var _newtitle$split2 = _slicedToArray(_newtitle$split, 3);

            this.category = _newtitle$split2[0];
            this.parameter = _newtitle$split2[1];
            this.channel = _newtitle$split2[2];
        }

        // Get a slice of the mapdata array

    }, {
        key: 'getRange',
        value: function getRange(axis) {
            var axis = axis === undefined ? 0 : axis;
            var range = this.data.map(function (elt) {
                return elt[axis];
            });
            return range;
        }

        // return the min and max of a range

    }, {
        key: 'getMinMax',
        value: function getMinMax(range) {
            var range = range === undefined ? this.getRange() : range;
            var min = Math.min.apply(null, range);
            var max = Math.max.apply(null, range);
            return [min, max];
        }
    }, {
        key: 'interpColors',
        value: function interpColors(range) {
            var spread = range[1] - range[0];
            var midpt = (range[0] + range[1]) / 2;
            var f = chroma.scale();
            /*var data = this.data.map(function(el) {return ((el[2] - midpt) / spread) + 0.5});
            //{return ((element[2] - midpt) / spread) + 0.5});
            console.log('this.data', this.data);
            console.log('data', data);
            var colors = data.map(f);
            colors = colors.map(function(x) {return chroma(x).hex()});
            console.log('colors', colors);
            */

            var assignColor = function assignColor(el) {
                var normedVal = (el[2] - midpt) / spread + 0.5;
                var colorRGB = f(normedVal);
                var colorHex = chroma(colorRGB).hex();
                var spaxel = [{
                    x: el[0],
                    y: el[1],
                    value: el[2],
                    color: colorHex
                }];
                return spaxel;
            };
            var data = new Array();
            for (var ii = 0; ii < this.data.length; ii++) {
                data.push(assignColor(this.data[ii]));
            }
            return data;
        }
    }, {
        key: 'addNull',
        value: function addNull(x) {
            x.map(function (el) {
                if (el < 0.01) return null;
            });
            return x;
        }
    }, {
        key: 'colorNoData',
        value: function colorNoData(H) {
            H.wrap(H.ColorAxis.prototype, 'toColor', function (proceed, value, point) {
                if (value < 5) return '#FF00FF'; // My color
                else return proceed.apply(this, Array.prototype.slice.call(arguments, 1)); // Normal coloring
            });
        }

        // initialize the heat map

    }, {
        key: 'initMap',
        value: function initMap() {
            // set the galaxy class self to a variable
            var _galthis = this.galthis;

            // get the ranges
            var range = this.getRange(0);
            var zscale = this.getRange(2);

            // get the min and max of the ranges
            var xmin, xmax, zmin, zmax;

            var _getMinMax = this.getMinMax(range);

            var _getMinMax2 = _slicedToArray(_getMinMax, 2);

            xmin = _getMinMax2[0];
            xmax = _getMinMax2[1];

            // set the colors of each spaxel
            // var spaxColors = this.interpColors([zmin, zmax]);
            //console.log('spaxColors', spaxColors);
            //console.log('BEFORE this.data', this.data.length, this.data[0].length, this.data[0]);
            //var data = this.interpColors([zmin, zmax]);
            //console.log('AFTER data', data.length, data[0].length, data[0][0]);

            var _getMinMax3 = this.getMinMax(zscale);

            var _getMinMax4 = _slicedToArray(_getMinMax3, 2);

            zmin = _getMinMax4[0];
            zmax = _getMinMax4[1];
            var data = this.addNull(this.data);

            this.mapdiv.highcharts({
                chart: {
                    type: 'heatmap',
                    marginTop: 40,
                    marginBottom: 80,
                    plotBorderWidth: 1
                },
                credits: { enabled: false },
                title: { text: this.title },
                navigation: {
                    buttonOptions: {
                        theme: { fill: null }
                    }
                },
                xAxis: {
                    title: { text: 'Spaxel X' },
                    minorGridLineWidth: 0,
                    min: xmin,
                    max: xmax,
                    tickInterval: 1
                },
                yAxis: {
                    title: { text: 'Spaxel Y' },
                    min: xmin,
                    max: xmax,
                    tickInterval: 1,
                    endontick: false
                },
                colorAxis: {
                    min: Math.floor(zmin),
                    max: Math.ceil(zmax),
                    minColor: '#00BFFF',
                    maxColor: '#000080',
                    labels: { align: 'right' },
                    reversed: false
                },
                plotOptions: {
                    nullColor: '#FF00FF'
                },
                // colors: spaxColors,
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    verticalAlign: 'middle',
                    title: { text: this.parameter }
                },
                tooltip: {
                    formatter: function formatter() {
                        return '<br>(' + this.point.x + ', ' + this.point.y + '): <b>' + this.point.value + '</b><br>';
                    }
                },
                series: [{
                    type: "heatmap",
                    name: "halphas",
                    data: data,
                    dataLabels: { enabled: false },
                    events: {
                        click: function click(event) {
                            _galthis.getSpaxel(event);
                        }
                    }
                }]
            });
        }
    }]);

    return HeatMap;
}();
;/*
* @Author: Brian Cherinka
* @Date:   2016-04-13 11:24:07
* @Last Modified by:   Brian
* @Last Modified time: 2016-05-18 09:50:10
*/

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Marvin = function Marvin(options) {
    _classCallCheck(this, Marvin);

    // set options
    //_.defaults(options, {fruit: "strawberry"})
    this.options = options;

    // set up utility functions
    this.utils = new Utils();
    this.utils.print();
    //this.utils.initPopOvers();
    this.utils.initToolTips();

    // load the header
    this.header = new Header();
    this.header.print();
};
;/*
* @Author: Brian Cherinka
* @Date:   2016-04-13 17:38:25
* @Last Modified by:   Brian
* @Last Modified time: 2016-04-26 18:12:18
*/

//
// Javascript object handling all things related to OpenLayers Map
//

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OLMap = function () {

    // Constructor
    function OLMap(image) {
        _classCallCheck(this, OLMap);

        if (image === undefined) {
            console.error('Must specify an input image to initialize a Map!');
        } else {
            this.image = image;
            this.staticimdiv = $('#staticimage')[0];
            this.mapdiv = $('#imagediv')[0];
            this.getImageSize();
            this.setProjection();
            this.setView();
            this.initMap();
            this.addDrawInteraction();
        }
    }

    _createClass(OLMap, [{
        key: 'print',


        // test print
        value: function print() {
            console.log('We are now printing openlayers map');
        }
    }, {
        key: 'getImageSize',


        // Get the natural size of the input static image
        value: function getImageSize() {
            if (this.staticimdiv !== undefined) {
                this.imwidth = this.staticimdiv.naturalWidth;
                this.imheight = this.staticimdiv.naturalHeight;
            }
        }
    }, {
        key: 'setMouseControl',


        // Set the mouse position control
        value: function setMouseControl() {
            var mousePositionControl = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                // comment the following two lines to have the mouse position be placed within the map.
                //className: 'custom-mouse-position',
                //target: document.getElementById('mouse-position'),
                undefinedHTML: '&nbsp;'
            });
            return mousePositionControl;
        }
    }, {
        key: 'setProjection',


        // Set the image Projection
        value: function setProjection() {
            this.extent = [0, 0, this.imwidth, this.imheight];
            this.projection = new ol.proj.Projection({
                code: 'ifu',
                units: 'pixels',
                extent: this.extent
            });
        }
    }, {
        key: 'setBaseImageLayer',


        // Set the base image Layer
        value: function setBaseImageLayer() {
            var imagelayer = new ol.layer.Image({
                source: new ol.source.ImageStatic({
                    url: this.image,
                    projection: this.projection,
                    imageExtent: this.extent
                })
            });
            return imagelayer;
        }
    }, {
        key: 'setView',


        // Set the image View
        value: function setView() {
            this.view = new ol.View({
                projection: this.projection,
                center: ol.extent.getCenter(this.extent),
                zoom: 1,
                maxZoom: 8,
                maxResolution: 1.4
            });
        }
    }, {
        key: 'initMap',


        // Initialize the Map
        value: function initMap() {
            var mousePositionControl = this.setMouseControl();
            var baseimage = this.setBaseImageLayer();
            this.map = new ol.Map({
                controls: ol.control.defaults({
                    attributionOptions: /** @type {olx.control.AttributionOptions} */{
                        collapsible: false
                    }
                }).extend([mousePositionControl]),
                layers: [baseimage],
                target: this.mapdiv,
                view: this.view
            });
        }
    }, {
        key: 'addDrawInteraction',


        // Add a Draw Interaction
        value: function addDrawInteraction() {
            // set up variable for last saved feature & vector source for point
            var lastFeature;
            var drawsource = new ol.source.Vector({ wrapX: false });
            // create new point vectorLayer
            var pointVector = this.newVectorLayer(drawsource);
            // add the layer to the map
            this.map.addLayer(pointVector);

            // New draw event ; default to Point
            var value = 'Point';
            var geometryFunction, maxPoints;
            this.draw = new ol.interaction.Draw({
                source: drawsource,
                type: /** @type {ol.geom.GeometryType} */value,
                geometryFunction: geometryFunction,
                maxPoints: maxPoints
            });

            // On draw end, remove the last saved feature (point)
            this.draw.on('drawend', function (e) {
                if (lastFeature) {
                    drawsource.removeFeature(lastFeature);
                }
                lastFeature = e.feature;
            });

            // add draw interaction onto the map
            this.map.addInteraction(this.draw);
        }
    }, {
        key: 'newVectorLayer',


        // New Vector Layer
        value: function newVectorLayer(source) {
            // default set to Point, but eventually expand this to different vector layer types
            var vector = new ol.layer.Vector({
                source: source,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#FF0808',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 3,
                        fill: new ol.style.Fill({
                            color: '#FF0808'
                        })
                    })
                })
            });
            return vector;
        }
    }]);

    return OLMap;
}();
;/*
* @Author: Brian Cherinka
* @Date:   2016-05-13 13:26:21
* @Last Modified by:   Brian
* @Last Modified time: 2016-05-16 10:51:44
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Search = function () {

    // Constructor
    function Search() {
        _classCallCheck(this, Search);

        this.searchform = $('#searchform');
        this.typeahead = $('#searchform .typeahead');
        this.returnparams = $('#returnparams');
        this.parambox = $('#parambox');
        this.searchbox = $("#searchbox");
    }

    // Print


    _createClass(Search, [{
        key: 'print',
        value: function print() {
            console.log('I am Search!');
        }

        // Extract

    }, {
        key: 'extractor',
        value: function extractor(input) {
            var regexp = new RegExp('([^,]+)$');
            // parse input for newly typed text
            var result = regexp.exec(input);
            // select last entry after comma
            if (result && result[1]) {
                return result[1].trim();
            }
            return '';
        }

        // Initialize Query Param Typeahead

    }, {
        key: 'initTypeahead',
        value: function initTypeahead(typediv, formdiv, url, fxn) {

            var _this = this;
            var typediv = typediv === undefined ? this.typeahead : $(typediv);
            var formdiv = formdiv === undefined ? this.searchform : $(formdiv);
            var typeurl = url === undefined ? Flask.url_for('search_page.getparams') : url;
            var afterfxn = fxn === undefined ? null : fxn;

            function customQueryTokenizer(str) {
                var newstr = str.toString();
                return [_this.extractor(newstr)];
            };

            // create the bloodhound engine
            this.queryparams = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                //queryTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: customQueryTokenizer,
                prefetch: typeurl,
                remote: {
                    url: typeurl,
                    filter: function filter(qpars) {
                        return qpars;
                    }
                }
            });

            // initialize the bloodhound suggestion engine
            this.queryparams.initialize();

            // init the search typeahead
            typediv.typeahead('destroy');
            typediv.typeahead({
                showHintOnFocus: true,
                source: this.queryparams.ttAdapter(),
                updater: function updater(item) {
                    // used to updated the input box with selected option
                    // item = selected item from dropdown
                    var currenttext = this.$element.val();
                    var removedtemptype = currenttext.replace(/[^,]*$/, '');
                    var newtext = removedtemptype + item + ', ';
                    return newtext;
                },
                matcher: function matcher(item) {
                    // used to determined if a query matches an item
                    var tquery = _this.extractor(this.query);
                    if (!tquery) return false;
                    return ~item.toLowerCase().indexOf(tquery.toLowerCase());
                },
                highlighter: function highlighter(item) {
                    // used to highlight autocomplete results ; returns html
                    var oquery = _this.extractor(this.query);
                    var query = oquery.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                        return '<strong>' + match + '</strong>';
                    });
                }
            });
        }
    }]);

    return Search;
}();
;/*
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
;/*
* @Author: Brian Cherinka
* @Date:   2016-04-12 00:10:26
* @Last Modified by:   Brian
* @Last Modified time: 2016-05-18 09:49:24
*/

// Javascript code for general things

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {

    // Constructor
    function Utils() {
        _classCallCheck(this, Utils);
    }

    // Print


    _createClass(Utils, [{
        key: 'print',
        value: function print() {
            console.log('I am Utils!');
        }

        // Build a Form

    }, {
        key: 'buildForm',
        value: function buildForm(keys) {
            var args = Array.prototype.slice.call(arguments, 1);
            var form = {};
            keys.forEach(function (key, index) {
                form[key] = args[index];
            });
            return form;
        }

        // Serialize a Form

    }, {
        key: 'serializeForm',
        value: function serializeForm(id) {
            var form = $(id).serializeArray();
            return form;
        }

        // Unique values

    }, {
        key: 'unique',
        value: function unique(data) {
            return new Set(data);
        }

        // Scroll to div

    }, {
        key: 'scrollTo',
        value: function scrollTo(location) {
            if (location !== undefined) {
                var scrolldiv = $(location);
                $('html,body').animate({ scrollTop: scrolldiv.offset().top }, 1500, 'easeInOutExpo');
            } else {
                $('html,body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
            }
        }

        // Initialize Pop-Overs

    }, {
        key: 'initPopOvers',
        value: function initPopOvers() {
            $('[data-toggle="popover"]').popover();
        }
    }, {
        key: 'initToolTips',


        // Initialize tooltips
        value: function initToolTips() {
            $('[data-toggle="tooltip"]').tooltip();
        }
    }]);

    return Utils;
}();
