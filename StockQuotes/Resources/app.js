//this sets the background color of the master UIView
Titanium.UI.setBackgroundColor('#000');

//this function is called on search button tap, it will query YQL for our stock data
function searchYQL() {
  //do some basic validation to ensure the user has entered a stock code value
  if(txtStockCode.value != '') 
  {
    txtStockCode.blur(); //hides the keyboard
    
    //create the query string using a combination of YQL syntax and the value of the txtStockCode field
    var query = 'select * from yahoo.finance.quotes where symbol = "' + txtStockCode.value + '"';
    
    //execute the query and get the results
    Titanium.Yahoo.yql(query, function(e) {
        var data = e.data;
        
        //if ErrorIndicationreturnedforsymbolchangedinvalid is null then we found a valid stock
        if(data.quote.ErrorIndicationreturnedforsymbolchangedinvalid == null) 
        {
            //we have some data! let's assign it to our labels etc
            lblCompanyName.text = data.quote.Name;
            lblDaysLow.text = 'Days Low: ' + data.quote.DaysLow;
            lblDaysHigh.text = 'Days High: ' + data.quote.DaysHigh;
            lblLastOpen.text = 'Last Open: ' + data.quote.Open;
            lblLastClose.text = 'Last Close: ' + data.quote.PreviousClose;   
            lblVolume.text = 'Volume: ' + data.quote.Volume;          
            lblPercentChange.text = data.quote.PercentChange;
            
            //if the previous close was equal or higher than the opening price, the 
            //stock direction is up... otherwise it went down!
            if(data.quote.PreviousClose >= data.quote.Open)  {
                imgStockDirection.image = 'images/arrow-up.png';
            }
            else  {
                imgStockDirection.image = 'images/arrow-down.png';
            }  
            
                                                                        
        }
        else 
        {
            //show an alert dialog saying nothing could be found
            alert('No stock information could be found for ' + txtStockCode.value + '!');
        }
    });  
    
    
    //get today's date and break that up into month, day and year values
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    
    //now create the two dates formatted in yyyy-mm-dd format for YQL query
    var today = year + '-' + month + '-' + day; //today
    
    //get the date 12 weeks ago.. 1000 milliseconds * seconds in minute * minutes in hour * 2016 hours (12 weeks, 12 * 7 days)
    var currentTimeMinus12Weeks = new Date((new Date()).getTime() - (1000 * 60 * 60 * 2016));
    var month2 = currentTimeMinus12Weeks.getMonth() + 1;
    var day2 = currentTimeMinus12Weeks.getDate();
    var year2 = currentTimeMinus12Weeks.getFullYear();   
    var todayMinus12Weeks = year2 + '-' + month2 + '-' + day2; //today - 12 weeks
    
    //perform a historical query for the stock code for our chart
    var query2 = 'select * from yahoo.finance.historicaldata where symbol = "' + txtStockCode.value + '" and startDate = "' + todayMinus12Weeks + '" and endDate = "' + today + '"';  
    
    //execute the query and get the results
    Titanium.Yahoo.yql(query2, function(e) {
        var data = e.data;  
        var chartData = [];
        
        Ti.API.info(query2);
        Ti.API.info(data.quote.length);
        
        //loop our returned json data for the last 12 weeks
        for(var i = (data.quote.length -1); i >= 0; i--)
        {
            //push this timeframes close value into our chartData array
            chartData.push(parseFloat(data.quote[i].Close)); 
            
            if(i == (data.quote.length - 1)) {  
              twelveWeekStartLabel.text = data.quote[i].Close;
            }
            if(i == 0) {  
              twelveWeekEndLabel.text = data.quote[i].Close;
            }
        }
        
        //raphael expects an array of arrays so lets do that
        var formattedChartData = [chartData];
        
        //fire an event that will pass the chart data across to the chart.html file
        //where it will be rendered by the Raphael JS chart engine
        Ti.App.fireEvent('renderChart', { data: formattedChartData, startDate:  todayMinus12Weeks, endDate: today } );    
    }); 
        
  } 
  else 
  {
    alert('You must provide a stock code to search upon, e.g. AAPL or YHOO');
  }
}

//create the application window
var win1 = Titanium.UI.createWindow({  
    backgroundImage: 'images/background.png'
});

//create the title label for our app
var titleLabel = Titanium.UI.createLabel({
    text: 'Search Quotes',
    color: '#fff',
    height: 20,
    width: 320,
    top: 6,
    textAlign: 'center',
    font: {fontSize: 15, fontFamily: 'Helvetica', fontWeight: 'bold'}
});
win1.add(titleLabel);


//create the scroll area, all our content goes in here
var scrollArea = Titanium.UI.createScrollView({
    top: 40,
    width: 320,
    height: 420,
    contentHeight: 'auto'
});

//create the stock quote search box
var searchBox = Titanium.UI.createView({
    width: 300,
    left: 10,
    top: 10,
    height: 50,
    borderRadius: 5,
    backgroundImage: 'images/gradient-small.png'
});

//this is the input textfield for our stock code
var txtStockCode = Titanium.UI.createTextField({
    hintText: 'Stock code, e.g. APPL',
    borderWidth: 0,
    width: 200,
    left: 10,
    height: 30,
    font: {fontSize: 14, fontColor: '#262626', fontFamily: 'Helvetica'},
    autoCorrect: false,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_ALL
});
searchBox.add(txtStockCode);

//create the search button from our search.png image
var btnSearch = Titanium.UI.createButton({  
    backgroundImage: 'images/search.png',
    width: 80,
    height: 30,
    right: 10,
    borderRadius: 3
});
//add the event listener for this button
btnSearch.addEventListener('click', searchYQL);

searchBox.add(btnSearch);

//now add the box to the scrollarea
scrollArea.add(searchBox);


//create the quote information box
var quoteInfoBox = Titanium.UI.createView({
    width: 300,
    left: 10,
    top: 70,
    height: 200,
    borderRadius: 5,
    backgroundImage: 'images/gradient.png'
});

//add the labels and images we need to show some basic stock information
var lblCompanyName = Titanium.UI.createLabel({
    width: 280,
    height: 30,
    left: 10,
    top: 10,
    color: '#003366',
    font: {fontSize: 17, fontWeight: 'bold', fontFamily: 'Helvetica'},
    text: 'No company selected'
});
quoteInfoBox.add(lblCompanyName);

var lblDaysLow = Titanium.UI.createLabel({
    width: 280,
    height: 20,
    left: 10,
    top: 50,
    color: '#000',
    font: {fontSize: 14, fontWeight: 'bold', fontFamily: 'Helvetica'},
    text: 'Days Low: '
});
quoteInfoBox.add(lblDaysLow);

var lblDaysHigh = Titanium.UI.createLabel({
    width: 280,
    height: 20,
    left: 10,
    top: 80,
    color: '#000',
    font: {fontSize: 14, fontWeight: 'bold', fontFamily: 'Helvetica'},
    text: 'Days High: '
});
quoteInfoBox.add(lblDaysHigh);

var lblLastOpen = Titanium.UI.createLabel({
    width: 280,
    height: 20,
    left: 10,
    top: 110,
    color: '#000',
    font: {fontSize: 14, fontWeight: 'bold', fontFamily: 'Helvetica'},
    text: 'Last Open: '
});
quoteInfoBox.add(lblLastOpen);

var lblLastClose = Titanium.UI.createLabel({
    width: 280,
    height: 20,
    left: 10,
    top: 140,
    color: '#000',
    font: {fontSize: 14, fontWeight: 'bold', fontFamily: 'Helvetica'},
    text: 'Last Close: '
});
quoteInfoBox.add(lblLastClose);

var lblVolume = Titanium.UI.createLabel({
    width: 280,
    height: 20,
    left: 10,
    top: 170,
    color: '#000',
    font: {fontSize: 14, fontWeight: 'bold', fontFamily: 'Helvetica'},
    text: 'Volume: '
});
quoteInfoBox.add(lblVolume);




//this will display an up or down arrow depending on direction of stock
var imgStockDirection = Titanium.UI.createImageView({
    image: 'images/arrow-up.png',
    right: 10,
    top: 10,
    width: 36,
    height: 40
});
quoteInfoBox.add(imgStockDirection);

//show the percent change
var lblPercentChange = Titanium.UI.createLabel({
    right: 10,
    top: 55,
    width: 38,
    height: 15,
    color: '#000',
    font: {fontSize: 11, fontFamily: 'Helvetica'},
    textAlign: 'right',
    text: '+0.00%'
});
quoteInfoBox.add(lblPercentChange);

scrollArea.add(quoteInfoBox);


//create the quote chart box
var quoteChartBox = Titanium.UI.createView({
    width: 300,
    left: 10,
    top: 280,
    height: 300,
    borderRadius: 5,
    backgroundImage: 'images/gradient.png'
});

//add the chart label and webview we need to show our raphael chart
var lblChartName = Titanium.UI.createLabel({
    width: 280,
    height: 30,
    left: 10,
    top: 10,
    color: '#003366',
    font: {fontSize: 17, fontWeight: 'bold', fontFamily: 'Helvetica'},
    text: '12 Week Historical Chart'
});
quoteChartBox.add(lblChartName);

var webview = Titanium.UI.createWebView({
    width: 280,
    height: 240,
    left: 10,
    top: 40,
    url: 'chart.html'
});
quoteChartBox.add(webview);

var twelveWeekStartLabel = Titanium.UI.createLabel({
    width: 100,
    left: 10,
    top: 285,
    height: 10,
    textAlign: 'left',
    font: {fontSize: 9, fontFamily: 'Helvetica'},
    color: '#000'
});
quoteChartBox.add(twelveWeekStartLabel);

var twelveWeekEndLabel = Titanium.UI.createLabel({
    width: 100,
    right: 10,
    top: 285,
    height: 10,
    textAlign: 'right',
    font: {fontSize: 9, fontFamily: 'Helvetica'},
    color: '#000'
});
quoteChartBox.add(twelveWeekEndLabel);

scrollArea.add(quoteChartBox);


//this small view just adds 10px of padding to the bottom of 
//our scrollview (scrollArea)
var emptyView = Titanium.UI.createView({
    height: 10,
    top: 580
});
scrollArea.add(emptyView);

//add the scrollview to the window
win1.add(scrollArea);

//open the window
win1.open();

