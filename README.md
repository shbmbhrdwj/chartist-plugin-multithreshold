# Multiple Threshold Plugin For Chartist

This Chartist plugin can be used to divide your Line or Bar chart with multiple threshold points. Everything above and below the 
threshold will be tagged with a special class, in order for you to apply different styling where appropriate.

## Usage example

You can use the Plugin for bar and line charts. Chartist will split the relevant elements so that they get divided into
multiple parts. All elements will receive classes that allow you to style the parts above and below the thresholds differently.

Threshold points can only be given as an array. The array values divide the resultant chart in regions whose classes are numbered
from {0} to {Threshold array length}. Using these classes custom styling can be done.

```javascript
new Chartist.Line('.ct-chart', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]
        ]
    }, {
        showArea: true,
        axisY: {
            onlyInteger: true
        },
        plugins: [
            Chartist.plugins.ctMultiThreshold({
                threshold: [20, 40, 60, 80]
            })
        ]
});
```
Use the following CSS to style the chart parts

```css
.ct-series-a .ct-line {
    stroke: red;
    stroke-width: 2px;
}

.ct-line.ct-threshold-0, .ct-point.ct-threshold-0, .ct-bar.ct-threshold-0 {
    stroke: #59922b;
}

.ct-line.ct-threshold-1, .ct-point.ct-threshold-1, .ct-bar.ct-threshold-1 {
    stroke: #f05b4f;
}

.ct-line.ct-threshold-2, .ct-point.ct-threshold-2, .ct-bar.ct-threshold-2 {
    stroke: #bbbbbb;
}

.ct-line.ct-threshold-3, .ct-point.ct-threshold-3, .ct-bar.ct-threshold-3 {
    stroke: #b55b5b;
}

.ct-line.ct-threshold-4, .ct-point.ct-threshold-4, .ct-bar.ct-threshold-4 {
    stroke: #000000;
}

```

You can, of course, also split multiple series with the threshold plugin. Just make sure you modify the CSS selectors 
with the necessary parent series class.

```css
.ct-series-a .ct-bar.ct-threshold-0 {
  stroke: #f05b4f;
}

.ct-series-a .ct-bar.ct-threshold-1 {
  stroke: #59922b;
}
```

## Default options

These are the default options of the threshold plugin. All options can be customized within the plugin factory function.

```
var defaultOptions = {
  threshold: []
};
```