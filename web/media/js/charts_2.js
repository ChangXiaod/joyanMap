var Charts = function() {
return {
//main function to initiate the module
init: function() {
App.addResponsiveHandler(function() {
Charts.initPieCharts();
});
},
        initCharts: function() {
        if (!jQuery.plot) {
        return;
        }
        //Interactive Chart
        function chart2() {
                var pageviews = [
                    [2015-3-20, 19],
                    [2015-3-24, 10]


                ];
                //plot方法进行画图
                var plot = $.plot($("#chart_2"), [{ 
                            data: pageviews,
                            label: "折线图" //label是说明这一个数据序列的含义,一个序列的话就没有必要设置这个属性
                        }
                    ], {
                series: {
                lines: {
                show: true,
                        lineWidth: 2,
                        fill: true,
                        fillColor: {
                        colors: [{
                        opacity: 0.05 //透明度
                        }, {
                        opacity: 0.01 //透明度
                        }
                        ]
                        }
                },
                        points: {
                        show: true
                        },
                        shadowSize: 2
                },
                        grid: //网格设置
                {
                        hoverable: true,
                        clickable: true,
                        tickColor: "#eee",
                        borderWidth: 0
                },
                        colors: ["#d12610", "#37b7f3", "#52e136"],
                        axesDefaults:{
                                tickOptions: {
                                formatString:'%Y %b %#d  '
                                }
                        }
                });
                //鼠标停滞处显示当前的坐标信息
                        function showTooltip(x, y, contents) {
                        $('<div id="tooltip">' + contents + '</div>').css({
                        position: 'absolute',
                                display: 'none',
                                top: y + 5,
                                left: x + 15,
                                border: '1px solid #333',
                                padding: '4px',
                                color: '#fff',
                                'border-radius': '3px',
                                'background-color': '#333',
                                opacity: 0.80
                        }).appendTo("body").fadeIn(200);
                        }

                var previousPoint = null;
                        $("#chart_2").bind("plothover", function(event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                        $("#tooltip").remove();
                        var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                        showTooltip(item.pageX, item.pageY, item.series.label);
                }
                } else {
                $("#tooltip").remove();
                        previousPoint = null;
                }
                });
                }
        chart2();
        }
        };
        }();