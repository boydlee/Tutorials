//enumerator of types for the chart
var RAPHAEL_CHART_TYPE = {"PIE" : 0, "LINE" : 1, "BAR" : 3, "DOT" : 4};

//chart properties
var CHART_TITLE = "";
var CHART_TITLE_LEFT = 50;
var CHART_TITLE_TOP = 10;
var CHART_TITLE_FONT_SIZE = "18";
var CHART_TITLE_FONT_FAMILY = "Arial, Verdana, sans-serif";
var CHART_FONT_SIZE = "12";
var CHART_FONT_FAMILY = "Arial, Verdana, sans-serif";
var CHART_WIDTH = 200;
var CHART_HEIGHT = 200;

var generateChart = function(element, chartType, title){
	var thisWindow = Ti.UI.currentWindow;
    var _html = "<html><head><title>RaphaelJS Chart</title> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>  <script src=\"charts/raphael.js.lib\" type=\"text/javascript\" charset=\"utf-8\"></script> <script src=\"charts/g.raphael-min.lib\" type=\"text/javascript\" charset=\"utf-8\"></script> <script src=\"charts/g.pie-min.lib\" type=\"text/javascript\" charset=\"utf-8\"></script> <script src=\"charts/g.bar-min.lib\" type=\"text/javascript\" charset=\"utf-8\"></script> <script src=\"charts/g.line-min.lib\" type=\"text/javascript\" charset=\"utf-8\"></script><script src=\"charts/g.dot-min.lib\" type=\"text/javascript\" charset=\"utf-8\"></script> <script type=\"text/javascript\" charset=\"utf-8\">window.onload = function () { {{raphaelcode}} };</script></head> <body style=\"margin:0px\"> <div id=\"chartDiv\" style=\"width:" + CHART_WIDTH + "px; height: " + CHART_HEIGHT + "px; padding: 0px; margin: 0\"></div> </body></html>";
    
    var _raphaelCode = "var r = Raphael(\"chartDiv\");";
    
    //_raphaelCode = _raphaelCode + "r.g.txtattr.font = \"" + CHART_FONT_SIZE + "px " + CHART_FONT_FAMILY + "\";";
    
    //if(title != '') {
        //_raphaelCode = _raphaelCode + "r.g.text(" + CHART_TITLE_LEFT + ", " + CHART_TITLE_TOP + ", \"" + title + "\").attr({\"font-size\": " + CHART_TITLE_FONT_SIZE + "}).attr({\"font-family\": '" + CHART_TITLE_FONT_FAMILY + "'}); ";
    //}
    
    switch(chartType) {
      case RAPHAEL_CHART_TYPE.PIE:
           _raphaelCode = _raphaelCode + "r.g.piechart(" + (CHART_WIDTH / 2) + ", " + (CHART_HEIGHT / 2) + ", " + (CHART_WIDTH/2)  + ", [27, 10, 13, 32, 5, 1, 2, 10]);";
      break;
      
      case RAPHAEL_CHART_TYPE.BAR:
      break;
      
      case RAPHAEL_CHART_TYPE.LINE:
      break;
      
      case RAPHAEL_CHART_TYPE.DOT:
      break;
    }
    
    
    //
    //add a webview to contain our chart
    //
    var webview = Titanium.UI.createWebView({
       width: element.width,
       height: element.height,
       html: _html.replace("{{raphaelcode}}", _raphaelCode),
       left: -1000,
       top: -1000
    });
    webview.addEventListener('load', function(e){
        //generate and return the blob
        setTimeout(function() {
           var imgblob = e.source.toImage();
           element.image = imgblob;
        }, 250);
    });
    thisWindow.add(webview);
};