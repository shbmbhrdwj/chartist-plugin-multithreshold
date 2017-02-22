
/* chartist-plugin-multithreshold 0.0.1
 * Copyright © 2017 Shubham Bhardwaj
 * Free to use under the WTFPL license.
 * http://www.wtfpl.net/
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.returnExportsGlobal = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root['Chartist.plugins.ctMultiThreshold'] = factory();
    }
}(this, function () {

    /**
     * Chartist.js plugin to display a chart with changing line colors for multiple thresholds.
     *
     */
    /* global Chartist */
    (function (window, document, Chartist) {
        'use strict';

        var defaultOptions = {
            threshold: []
        };

        function createMasks(data, options) {
            // Select the defs element within the chart or create a new one
            var defs = data.svg.querySelector('defs') || data.svg.elem('defs');

            var width = data.svg.width();
            var height = data.svg.height();

            // Project the threshold value on the chart Y axis
            var projectedThresholds = [];
            for(var i=0; i<options.threshold.length; i++){
                projectedThresholds.push(data.chartRect.height() - data.axisY.projectValue(options.threshold[i]) + data.chartRect.y2);
            }

            for(var j=projectedThresholds.length-1; j>=0; j--){
                var lineHeight;
                if(j>0){
                    lineHeight = projectedThresholds[j-1] - projectedThresholds [j];
                }
                else{
                    lineHeight = projectedThresholds[j];
                }
                defs
                    .elem('mask', {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                        id: 'ct-threshold-mask-' + j
                    })
                    .elem('rect', {
                        x: 0,
                        y: projectedThresholds[j],
                        width: width,
                        height: lineHeight,
                        fill: 'white'
                    });
            }

            // Create mask for upper part above max threshold
            defs
                .elem('mask', {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    id: 'ct-threshold-' + options.threshold.length
                })
                .elem('rect', {
                    x: 0,
                    y: 0,
                    width: width,
                    height: projectedThresholds[projectedThresholds.length-1],
                    fill: 'white'
                });

            return defs;
        }

        Chartist.plugins = Chartist.plugins || {};
        Chartist.plugins.ctMultiThreshold = function (options) {

            options = Chartist.extend({}, defaultOptions, options);

            return function ctThreshold(chart) {
                if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
                    chart.on('draw', function (data) {
                        if (data.type === 'point') {
                            // For points we can just use the data value and compare against the threshold in order to determine
                            // the appropriate class
                            var getPointClass = function () {
                                for(var i=0; i<options.threshold.length; i++){
                                    if(data.value.y <= options.threshold[0]){
                                        return 'ct-threshold-'+0;
                                    } else if(data.value.y > options.threshold[options.threshold.length-1]){
                                        return 'ct-threshold-'+(options.threshold.length);
                                    } else if(data.value.y <= options.threshold[i+1] && data.value.y > options.threshold[i]){
                                        return 'ct-threshold-'+ (i+1);
                                    }
                                }
                            };
                            data.element.addClass( getPointClass() );
                        } else if (data.type === 'line' || data.type === 'bar' || data.type === 'area') {
                            //Cloning the original line path and masking
                            for(var i=0; i<options.threshold.length; i++){
                                data.element
                                    .parent()
                                    .elem(data.element._node.cloneNode(true))
                                    .attr({
                                        mask: 'url(#ct-threshold-mask-'+ i + ')'
                                    })
                                    .addClass('ct-threshold-'+i);
                            }

                            data.element
                                .attr({
                                    mask: 'url(#ct-threshold-mask-' + options.threshold.length + ')'
                                })
                                .addClass('ct-threshold-'+options.threshold.length);
                        }
                    });

                    // On the created event, create the mask definitions used to mask the line graphs
                    chart.on('created', function (data) {
                        createMasks(data, options);
                    });
                }
            };
        }
    }(window, document, Chartist));

    return Chartist.plugins.ctMultiThreshold;

}));