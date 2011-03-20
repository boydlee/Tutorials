var win1 = Titanium.UI.currentWindow;

//include the chart library
Titanium.include('charts/chart.js');

var chartImageView = Titanium.UI.createImageView({
        width: 280,
        left: 20,
        top: 85,
        height: 280,
        borderWidth: 1
    });
win1.add(chartImageView);
    
    
var button1 = Titanium.UI.createButton({
   title: 'Pie',
   width: 80,
   height: 30,
   left: 20,
   top: 10
});

button1.addEventListener('click', function(e){
  generateChart(chartImageView, RAPHAEL_CHART_TYPE.PIE, 'Pie Chart');
});

win1.add(button1);


var button2 = Titanium.UI.createButton({
   title: 'Bar',
   width: 80,
   height: 30,
   left: 20,
   top: 45
});

button2.addEventListener('click', function(e){
  generateChart(chartImageView, RAPHAEL_CHART_TYPE.BAR, 'Bar Chart');
});

win1.add(button2);


var button3 = Titanium.UI.createButton({
   title: 'Line',
   width: 80,
   height: 30,
   right: 120,
   top: 10
});

button3.addEventListener('click', function(e){
  generateChart(chartImageView, RAPHAEL_CHART_TYPE.LINE, 'Line Chart');
});

win1.add(button3);


var button4 = Titanium.UI.createButton({
   title: 'Dot',
   width: 80,
   height: 30,
   right: 20,
   top: 10
});

button4.addEventListener('click', function(e){
  generateChart(chartImageView, RAPHAEL_CHART_TYPE.DOT, 'Dot Chart');
});

win1.add(button4);