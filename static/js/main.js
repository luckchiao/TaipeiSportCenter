$(function () {
    var lastRefreshTime = new Date();
    var areaPeople;
    LocationPeopleNum();
    setTimeout(InitView, 500);
    ReloadLocationPeopleNum();
    LoadPie1();
    LoadPie2();
    LoadPeopleChar();

    $(".area").mouseover(function (e) {
        ShowSportCenterPeopleInfo(e);
    }).mouseout(function () {
            $(".follow").html('').removeClass();
        });

    function ShowSportCenterPeopleInfo(e) {
        $(".showArea").text($(e.currentTarget).attr("data-area") + '運動中心');
        // console.log($(e.currentTarget).context.id)
        areaPeople.find(function (item, index, array) {
            if (item.LID == $(e.currentTarget).context.id) {
                $("#gymPeopleNum").text(item.gymPeopleNum + " / " + item.gymMaxPeopleNum);
                $("#swimPeopleNum").text(item.swPeopleNum + " / " + item.swMaxPeopleNum);
                $(".pGym").attr('max', item.gymMaxPeopleNum);
                $(".pGym").val(item.gymPeopleNum);
                $(".pSwim").attr('max', item.swMaxPeopleNum);
                $(".pSwim").val(item.swPeopleNum);
            }
        });
        //cursor show area 
        // $("#follow").addClass("follow");
        // window.onmousemove = function (ev) {
        //     var ev = ev || window.event;
        //     var oLeft = ev.clientX + 40;
        //     var oTop = ev.clientY + 30;
        //     $(".follow").css({
        //         'display': 'block',
        //         'left': oLeft + 'px',
        //         'top': oTop + 'px'
        //     }).text($(e.currentTarget).attr("data-area"));
        // }
    }

    function LocationPeopleNum() {
        fetch('http://127.0.0.1:5000/gym').then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })).then(res => {
                lastRefreshTime = new Date();
                areaPeople = res.data.locationPeopleNums
                // console.log(areaPeople[0].LID)
            }));
    }

    function InitView() {
        areaPeople.find(function (item, index, array) {
            if (item.LID == "BTSC") {
                $("#gymPeopleNum").text(item.gymPeopleNum + " / " + item.gymMaxPeopleNum);
                $("#swimPeopleNum").text(item.swPeopleNum + " / " + item.swMaxPeopleNum);
                $(".pGym").attr('max', item.gymMaxPeopleNum);
                $(".pGym").val(item.gymPeopleNum);
                $(".pSwim").attr('max', item.swMaxPeopleNum);
                $(".pSwim").val(item.swPeopleNum);
            }
        });
    }

    function ReloadLocationPeopleNum() {
        if (new Date().getTime() - lastRefreshTime.getTime() > 10000) { //10 * 1000 = 10000
            LocationPeopleNum();
        }
        setTimeout(ReloadLocationPeopleNum, 1000);
    }

    function formatNum(strNum) {
        if(strNum.length <= 3) {
            return strNum;
        }
        if(!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
            return strNum;
        }
        var a = RegExp.$1,
            b = RegExp.$2,
            c = RegExp.$3;
        var re = new RegExp();
        re.compile("(\\d)(\\d{3})(,|$)");
        while(re.test(b)) {
            b = b.replace(re, "$1,$2$3");
        }
        return a + "" + b + "" + c;
    }

    function LoadPie1() {
        var pie1 = echarts.init(document.getElementById('pie1'), 'dark', {
            renderer: 'svg'
        });
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '區域總人口數',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(data) {
                    return data.seriesName+ "<br/>"+ data.name+ "："+formatNum(data.value);
                }
                // formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            backgroundColor: 'rgba(128, 128, 128, 0)',
            color: ['#D7709F', '#5294E2'],
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['女性', '男性']
            },
            series: [{
                name: '區域人口數',
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                selectedMode: 'single',
                label: {
                    normal: {
                        show: false,
                        position: 'inner'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        },
                        formatter: "{d}%"
                    }
                },
                data: [{value: 1357,name: '女性'},
                       {value: 2468,name: '男性'}
                ]
            }]
        };
        pie1.setOption(option);
        $(".area").mousemove(function (e) {
            setTimeout(function(){
            pie1.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                name:'女性'
            });})
            pie1.setOption({
                series: [{
                    name: $(e.currentTarget).attr("data-area") + '人口數',
                    data: [{value: $(e.currentTarget).attr("data-female"), name: '女性'},
                           {value: $(e.currentTarget).attr("data-man"), name: '男性' }
                    ],
                }]
            });
        })
    }

    function LoadPie2() {
        var pie2 = echarts.init(document.getElementById('pie2'), 'dark', {
            renderer: 'svg'
        });
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '運動總人口數',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            backgroundColor: 'rgba(128, 128, 128, 0)',
            color: ['#D7709F', '#5294E2'],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['女性', '男性']
            },
            series: [{
                name: '運動人口數',
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [{
                        value: 2335,
                        name: '女性'
                    },
                    {
                        value: 1548,
                        name: '男性'
                    }
                ]
            }]
        };
        pie2.setOption(option);
    }

    function LoadPeopleChar() {
        // 基于准备好的dom，初始化echarts实例
        var chart = echarts.init(document.getElementById('chart'), 'dark');
        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            backgroundColor: 'rgba(128, 128, 128, 0)',
            color: ['#D7709F', '#5294E2', '#58c9ce'],
            toolbox: {
                feature: {
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            legend: {
                data: ['女性', '男性', '平均人數']
            },
            xAxis: [{
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisPointer: {
                    type: 'shadow'
                }
            }],
            yAxis: [{
                    type: 'value',
                    name: 'YYY',
                    min: 0,
                    max: 250,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
                {
                    type: 'value',
                    name: 'XXX',
                    min: 0,
                    max: 25,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [{
                    name: '女性',
                    type: 'bar',
                    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name: '男性',
                    type: 'bar',
                    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name: '平均人數',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        chart.setOption(option);
    }
})