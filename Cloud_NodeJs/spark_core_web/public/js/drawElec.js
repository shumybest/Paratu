/**
 * Created by pdli on 14-5-6.
 */


function drawColumn(containerId)
{
    //var chart = new Highcharts.Chart
    //$(containerId).highcharts
    var chart = new Highcharts.Chart({
        title: {
            text: 'Combination chart'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
        },
        labels: {
            items: [{
                html: 'Total fruit consumption',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Jane',
            data: [3, 2, 1, 3, 4]
        }, {
            type: 'column',
            name: 'John',
            data: [2, 3, 5, 7, 6]
        }, {
            type: 'column',
            name: 'Joe',
            data: [4, 3, 3, 9, 0]
        }, {
            type: 'spline',
            name: 'Average',
            data: [3, 2.67, 3, 6.33, 3.33],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }, {
            type: 'pie',
            name: 'Total consumption',
            data: [{
                name: 'Jane',
                y: 13,
                color: Highcharts.getOptions().colors[0] // Jane's color
            }, {
                name: 'John',
                y: 23,
                color: Highcharts.getOptions().colors[1] // John's color
            }, {
                name: 'Joe',
                y: 19,
                color: Highcharts.getOptions().colors[2] // Joe's color
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }],
        chart: {
            zoomType: 'x',
            renderTo: containerId
        }
    });
}
//
//function drawChart(data,containerId)
//{
//    //alert("Welcome to test JSON!!!");
//    /*alert( data.xaxisValue);
//     alert( data.xaxisType);
//     alert( data.yaxisValue[0].name);
//     alert( data.yaxisValue[1].marker);
//     alert( data.yaxisValue[0].data);*/
//
//    //alert("show data: " + data[0]);
//    //alert("show data: " + data[1]);
//    var chart = new Highcharts.Chart({
//        //配置chart选项
//        chart: {
//            zoomType: 'x',
//            renderTo: containerId,  //容器名，和body部分的div id要一致
//            type: 'spline'			//图表类型，这里选择折线图
//        },
//        legend:{
//            align: 'right',
//            floating: 'true',
//            verticalAlign: 'top',
//            x:90,
//            y:45,
//            layout: 'vertical'
//        },
//        //配置链接及名称选项
//        credits: {
//            enabled : true,
//            href : "",
//            text : ""
//        },
//        //配置标题
//        title: {
//            text: '实时电量统计图',
//            y:10  //默认对齐是顶部，所以这里代表距离顶部10px
//        },
//        //配置副标题
//        subtitle: {
//            //text: '数据来源：Paratu Co.,Ltd ',
//            // y:30
//        },
//        //配置x轴
//        xAxis: {
//            categories: data.xaxisValue,
//            title: {
//                align: 'high',
//                text:"数据来源：Paratu Co.,Ltd    \t"+ "统计单位： ("+ data.xaxisType + ")"
//            },
//            tickInterval: 5,
//            startOnTick: true,
//            endOnTick: true,
//            showLastLabel: true,
//            events:{
//                afterSetExtremes:function(){
//
//                    if (!this.chart.options.chart.isZoomed)
//                    {
//                        var xMin = this.chart.xAxis[0].min;
//                        var xMax = this.chart.xAxis[0].max;
//                        var zmRange = computeTickInterval(xMin, xMax);
//                        chart1.xAxis[0].options.tickInterval =zmRange;
//                        chart1.xAxis[0].isDirty = true;
//                        chart2.xAxis[0].options.tickInterval = zmRange;
//                        chart2.xAxis[0].isDirty = true;
//
//                        chart2.options.chart.isZoomed = true;
//                        chart2.xAxis[0].setExtremes(xMin, xMax, true);
//                        chart2.options.chart.isZoomed = false;
//                    }
//                }
//
//
//            }
//        },
//        // 配置y轴
//        yAxis:
//        {
//            title: {
//                text: '用电量（度）'
//            },
//            labels: {
//                formatter: function() {
//                    return this.value +'度'
//                }
//            }
//        },
//        //配置数据点提示框
//        tooltip: {
//            crosshairs: true,
//            shared: true
//        },
//        //配置数据使其点显示信息
//        plotOptions: {
//            spline : {
//                dataLabels: {
//                    enabled: true
//                },
//                enableMouseTracking: true
//            }
//        },
//        //配置数据列
//        series: data.yaxisValue
//    });
//    return chart;
//}

function drawBlankChart(chartName){
    chartName.series.hide();
}
function drawCombineChart(data)
{

    var chart1, chart2;
    var controllingChart;
    var defaultTickInterval = 5;
    var currentTickInterval = defaultTickInterval;

    //compute a reasonable tick interval given the zoom range -
    //have to compute this since we set the tickIntervals in order
    //to get predictable synchronization between 3 charts with
    //different data.
    function computeTickInterval(xMin, xMax) {
        var zoomRange = xMax - xMin;
        if (zoomRange <= 2)
            currentTickInterval = 0.5;
        if (zoomRange < 20)
            currentTickInterval = 1;
        else if (zoomRange < 100)
            currentTickInterval = 5;
    }

     //manage pilotLine
    function syncronizeCrossHairs(chart) {
        var container = $(chart.container),
            offset = container.offset(),
            x, y, isInside, report;
        container.mousemove(function(evt) {
            x = evt.clientX - chart.plotLeft - offset.left;
            y = evt.clientY - chart.plotTop - offset.top;

            //var xAxis = chart.xAxis[0];
            //remove old plot line and draw new plot line (crosshair) for this chart
            var xAxis1 = chart1.xAxis[0];
            xAxis1.removePlotLine("myPlotLineId");
            xAxis1.addPlotLine({
                value: chart.xAxis[0].translate(x, true),
                width: 1,
                color: 'red',
                //dashStyle: 'dash',
                id: "myPlotLineId"
            });
            //remove old crosshair and draw new crosshair on chart2
            var xAxis2 = chart2.xAxis[0];
            xAxis2.removePlotLine("myPlotLineId");
            xAxis2.addPlotLine({
                value: chart.xAxis[0].translate(x, true),
                width: 1,
                color: 'red',
                //dashStyle: 'dash',
                id: "myPlotLineId"
            });
            //if you have other charts that need to be syncronized - update their crosshair (plot line) in the same way in this function.
        });
    }

    chart1 = new Highcharts.Chart({
    //chart1 = $('#showElecAccumulate').highcharts({
        //colors: ['#7cb5ec', '#434348'], //, '#90ed7d', '#f7a35c', '#8085e9','#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
        chart: {
            //margin : [0, 0, 0, 100],
            renderTo: 'showElecAccumulate',
            type: 'line',
            zoomType: 'x',
            //x axis only
            //borderColor: '#003399',
            //'#022455',
            //borderWidth: 1,
            isZoomed:false
        },
        title: {
            text: '用户电量统计'
        },
        //配置链接及名称选项
        credits: {
            enabled : true,
            href : "",
            text : ""
        },
        xAxis: {
            categories: data.getDrawAccumXaxis(),
            title: {
                enabled: true,
                align : "high",
                text: "单位：　" + data.getType()
            },
            tickInterval:5,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            events:{
                afterSetExtremes:function(){
                    if (!this.chart.options.chart.isZoomed)
                    {
                        var xMin = this.chart.xAxis[0].min;
                        var xMax = this.chart.xAxis[0].max;
                        var zmRange = computeTickInterval(xMin, xMax);
                        chart1.xAxis[0].options.tickInterval =zmRange;
                        chart1.xAxis[0].isDirty = true;
                        chart2.xAxis[0].options.tickInterval = zmRange;
                        chart2.xAxis[0].isDirty = true;
                        chart2.options.chart.isZoomed = true;
                        chart2.xAxis[0].setExtremes(xMin, xMax, true);
                        chart2.options.chart.isZoomed = false;

                    }
                }
            }
        },
        yAxis: {
            floor: 0,
            title: {
                text: '累计用电量（度）'
            },
            labels: {
                formatter: function() {
                    return this.value +'度'
                }
            }
        },
        tooltip: {
            formatter: function() {
                return '' + '第'+ this.x + data.getType() + ', ' + this.y + ' 度';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
        series:  data.getDrawAccumData()
    }, function(chart) { //add this function to the chart definition to get synchronized crosshairs
        syncronizeCrossHairs( chart);
    });

    chart2 = new Highcharts.Chart({
        colors: ['#7cb5ec', '#434348'],
        chart: {
            height :150,
            renderTo: 'showElecCollection',
            type: 'line',
            zoomType: 'x',
            //x axis only
            //borderColor: '#003399',
            //'#022455',
            //borderWidth: 1,
            isZoomed:false
         },
        //配置链接及名称选项
        credits: {
            enabled : true,
            href : "",
            text : ""
        },
        title: {
            text: ''
        },
        subtitle: {
            //text: 'Source: Notional Test Data'
        },
        xAxis: {
            categories: data.getDrawOnTimeXaxis(),
            title: {
                enabled: true,
                align : "high",
                text: '单位：　' + data.getType()
            },
            tickInterval:5,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            events: {
                afterSetExtremes: function() {
                    if (!this.chart.options.chart.isZoomed)
                    {
                        var xMin = this.chart.xAxis[0].min;
                        var xMax = this.chart.xAxis[0].max;
                        var zmRange = computeTickInterval(xMin, xMax);
                        chart1.xAxis[0].options.tickInterval =zmRange;
                        chart1.xAxis[0].isDirty = true;
                        chart2.xAxis[0].options.tickInterval = zmRange;
                        chart2.xAxis[0].isDirty = true;
                        chart1.options.chart.isZoomed = true;
                        chart1.xAxis[0].setExtremes(xMin, xMax, true);
                        chart1.options.chart.isZoomed = false;
                    }
                }
            }
        },
        yAxis: {
            floor: 0,
            tickInterval:2,
            title: {
                text: '实时电量统计（度）'
            },
            labels: {
                formatter: function() {
                    return this.value +'度'
                }
            }
        },
        tooltip: {
            formatter: function() {
                return '' + '第' + this.x + data.getType() + ', ' + this.y + ' 度';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
        series: data.getDrawOnTimeData()
    }, function(chart) { //add this function to the chart definition to get synchronized crosshairs
        //this function needs to be added to each syncronized chart
        syncronizeCrossHairs( chart);
    });



}




