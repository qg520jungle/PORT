/**
 * Created by ly-zhangxianggeng on 2016/8/17.
 *
 *
 */

;
(function($) {
    $.fn.theDate = function(options) {
        return this.each(function(index, el) {

            // 这里开始写功能需求
            //重写默认值信息
            //状态码代表含义
            //0 未选中
            //1 鼠标选中
            //2 维修范围(不可选)
            //
            var defaultOptions = {
                year: '2016',
                month: '8',
                changpageMethod:'',
                itemClickEvent:'',
                start: {
                	state:false,
                	year:'2016',
                	month:'8',
                	day:'2',
                	morning:true
                },
                end: {
                	state: true,
                	year:'2016',
                	month:'8',
                	day:'8',
                	morning:true
                },
                objP:{
                	/*'20160808':{
                		mprice:100.00,
                		morning:1,
                		afternoon:0
                	}*/
                }

            };
            //默认的返回消息数组
            var obj = $.extend({}, defaultOptions, options);
            var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var year = obj.year;
            var month = obj.month;

            function init(y, m) {

                //获取当前月天数
                var days = _getDays(y, m);
                //获取当前月第一天是星期几
                var no1 = _getNo1(y, m);
                //循环推出当月日历信息
            			console.log(obj.start)
                stateReset();
            			console.log(obj.start)
                //返回当前月的日历图
                var str_rili = _calendars(y, m, no1, days);
                //判断是否为年底
                var y_next, m_next
                m == 12 ? y_next = parseInt(y) + 1 :
                    y_next = y
                m == 12 ? m_next = 1 :
                    m_next = parseInt(m) + 1
                    //console.log(str_rili)
                    //获取下个月的天数
                var days_next = _getDays(y_next, m_next);
                //获取当前月第一天是星期几
                var no1_next = _getNo1(y_next, m_next);
                //
                var str_rili_next = _calendars(y_next, m_next, no1_next, days_next);
                //console.log(str_rili_next)
                var str = ''
                str = fortheCalendars(str_rili, str_rili_next);
                $('.j-cal-box').html(str);

                //alert(str)
                $('.j-cal-box').show();

                //alert(2)
                toNext(y, m);
                toPrve(y, m);
                hoverLeft();
                hoverRight();
                itemClick();

                //console.log(str_rili_next)
            }
            //补偿闰年影响
            function _offset(y) {
                var yearTemp;
                yearTemp = y % 400 == 0 ? true :
                    y % 100 == 0 ? false :
                    y % 4 == 0 ? true : false;
                if (yearTemp) {
                    return true;
                } else {
                    return false;
                }
            }
            //获取当前月天数
            function _getDays(y, m) {
                m = m % 12;
                m == 0 ? m = 12 : '';
                var monthTemp;
                monthTemp = m != 2 ? true :
                    _offset(y) ? false : true;
                if (monthTemp) {
                    return monthDay[m - 1]
                } else {
                    return 29;
                }
            }
            //获取当前月第一天之前到1900年1月1日有多少天
            function _allDays(y, m) {
                var all = 0;
                for (var i = 1900; i < y; i++) {
                    if (_offset(i)) {
                        all += 366;
                    } else {
                        all += 365
                    }
                }
                for (var i = 1; i < m; i++) {
                    if (_offset(y) && i == 2) {
                        all += 29;
                    } else {
                        all += monthDay[i - 1];
                    }
                }
                return all
            }
            //获取当前月第一天是星期几
            function _getNo1(y, m) {
                var date = _allDays(y, m);
                date = (date % 7 + 1);
                date = (date % 7);
                return date;
            }
            //循环输出本月日历
            function _calendars(y, m, no1, days) {
                var str_rili = [];
                var h = _getDays(y, m - 1);
                //h为上个月天数；
                var d = _getNo1(y, m)
                for (var j = 1, k = 1; j <= days;) {
                    //str_rili+=''
                    for (var i = 1; i <= 7 && j <= days; i++) {
                        var w = (d + i - 1) % 7 == 0 ? 7 : (d + i - 1) % 7;
                        //console.log(w);
                        var oneDay = {
                            year: y,
                            month: m,
                            day: j,
                            week: w
                        }
                        str_rili.push(oneDay);
                        j++;
                    }
                    //str_rili+=''

                }
                return str_rili
            }
            //输出测试

            init(year, month);


            function _output(y, m) {
                alert(y + '年' + m + '月第一天为星期' + '' + _getNo1(y, m))

            }

            function fortheCalendars(str_rili, str_rili_next) {
                var amStr = '';
                //日期的外层+背景色部分
                amStr += '<div class="m-calendar">\n\t <div class="m-calendar-bd">'
                    //头部切换
                amStr += '<div class="tab">'
                amStr += '<span class="prve "><i class="u-icon u-icon-toLeft" ></i></span>'
                amStr += '<span class="next "><i class="u-icon u-icon-toRight" ></i></span>'
                amStr += '</div>'

                amStr += foroneMonth(str_rili, str_rili[0].year, str_rili[0].month);

                amStr += foroneMonth(str_rili_next, str_rili_next[0].year, str_rili_next[0].month);

                amStr += '</div></div>'
                amStr += '<span class="calendarMask"></span>'
                amStr += '</div>'
                return amStr
            }
            function makeTwobit(item){
            	var m='';
            	if(parseInt(item)<10){
            		m='0'+parseInt(item)
            	}else{
            		m+=parseInt(item)
            	}
            	return m
            }
            function foroneMonth(str_rili, year, month) {

            	var m=makeTwobit(month);
                var oneM = '';
                //左侧当前月，以及当前月的奇数月
                //更改最初最后的状态~
                var allSpace=makeallSpace(60);
                oneM += '<div class="inner">'
                oneM += '<div>'
                    //月份头
                oneM += '<div class="title">'
                oneM += '<h5>' + year + '年' + m + '月' + '</h5>'
                oneM += '</div>'
                    //星期头
                oneM += '<div class="info"><table><thead><tr>'
                for (var i = 1; i <= 7; i++) {
                    oneM += '<th class="weekday">'
                    oneM += '<span class="week">'
                    i == 1 ? oneM += '一' :
                        i == 2 ? oneM += '二' :
                        i == 3 ? oneM += '三' :
                        i == 4 ? oneM += '四' :
                        i == 5 ? oneM += '五' :
                        i == 6 ? oneM += '六' :
                        i == 7 ? oneM += '日' :
                        oneM += '#'
                    oneM += '</span></th>'
                }
                oneM += '</tr></thead></table></div>'
                    //日期渲染
                oneM += '<div class="info"><table><tbody>';
                //console.log(str_rili.length)
                for (var i = 1; i <= str_rili.length;) {
                    oneM += '<tr>'
                    for (var j = 1; j <= 7; j++) {
                        if (str_rili[i - 1] && str_rili[i - 1].week == j) {
            				var d=makeTwobit(str_rili[i - 1].day);
                        	var temp=year+m+d
                        	var aim=obj.objP[temp];
                        	var am=0,pm=0,price='';
                        	var ssam=stateRange(year,month,str_rili[i - 1].day,true);
                        	var sspm=stateRange(year,month,str_rili[i - 1].day,false);
                        	if(ssam){
                        		am=1
                        	}
                        	if(sspm){
                        		pm=1
                        	}
                        	if(aim){
                        		 am=aim.morning,pm=aim.afternoon,price=aim.mprice
                        		 console.log(aim)
                        	}
							var state='0';
							state=theState(am,pm)
							if(state==0){
								oneM += '<td><a href="javascript:void(0);" class="cur cell  price-calendar  j-cur">'
							}else{
								oneM += '<td><a href="javascript:void(0);" class="cur cell  price-calendar z-act j-cur"'+ssam+'>'
							}
                            if(am){
                            	oneM += '<span class="z-m"></span>'
                            }
                            if(pm){
                            	oneM += '<span class="z-n"></span>'
                            }

                            oneM += '<span class="price-calendar-c"></span>'
                            oneM += '<span class="day" date="'+year+m+d+'">'
                            oneM += str_rili[i - 1].day
                            oneM += '</span><span class="mark"></span>'
                            oneM += '<span class="price">'
                            if(price){
                            	oneM += '<i class="rmb">¥</i><span>'+price+'</span>'
                            }
                            oneM += '</span><span title="" class="left j-left"><div class="f-ie">'+allSpace+'</div></span><span title="" class="right j-right"> <div class="f-ie">'+allSpace+'</div></span>'
                            oneM += '</a></td>'
                            i++
                            //console.log('i :'+i);
                            //console.log(str_rili.length)
                            //console.log(str_rili[i-1].week)
                        } else if (str_rili[i - 1] && str_rili[i - 1].week > j) {
                            oneM += '<td><a class="cur disabled ">'
                            oneM += '<span class="day">'
                            oneM += ' '
                            oneM += '</span><span class="mark"></span>'
                                // console.log(str_rili[i-1])
                                // console.log(str_rili[i-1].week);

                            oneM += '<span></span>'
                            oneM += '</a></td>'
                        } else {
                            //console.log('error')
                        }

                    }
                    oneM += '</tr>'
                }
                oneM += '</tbody></table></div>'
                oneM += '</div></div>'
                return oneM
            }
            function makeallSpace(num){
                var space='&nbsp;'
                var str=''
                for(var i=0;i<num;i++){
                    str+=space
                }
                return str
            }
            //判断增加月份后，返回正确的年份和月份
            function addMonth(y, m, add) {
                var obj = {
                    year: y,
                    month: m
                }
                var newM = 0,
                    newY = 0;
                var addY = 0;
                newM = parseInt(m) + parseInt(add);

                addY = newM % 12 == 0 ? parseInt(newM / 12) - 1 : parseInt(newM / 12);
                newM = newM % 12 == 0 ? 12 : newM % 12
                obj.year = parseInt(y) + parseInt(addY);
                obj.month = newM;
                return obj
            }

            function toNext(y, m) {
                $('.next').on('click', function() {
                    $('.j-cal-box').html('')
                    var newD = addMonth(y, m, 2)
                    init(newD.year, newD.month);
                    if(obj.changpageMethod){
                    	obj.changpageMethod(newD.year, newD.month);
                    }
                })
            }

            function toPrve(y, m) {
                $('.prve').on('click', function() {
                    $('.j-cal-box').html('')
                    var newD = addMonth(y, m, -2)
                    init(newD.year, newD.month);
                    if(obj.changpageMethod){
                    	obj.changpageMethod(newD.year, newD.month);
                    }
                })
            }

            function hoverLeft() {
                $('.price-calendar .j-left').on('mouseover', function() {

                    var $cal = $(this).parent();
                    if ($cal.hasClass('z-act')) {
                    }else if(disClick($cal.find('.z-m'))){

                    } else {
                    	$cal.prepend('<span class="z-m"></span>')
                    }
                }).on('mouseout', function() {
                    var $cal = $(this).parent();
                    if ($cal.hasClass('z-act')) {

                    }else if(disClick($cal.find('.z-m'))){
                    }  else {
                        $cal.find('.z-m').remove()
                    }
                })
            }

            function hoverRight() {
                $('.price-calendar .j-right').on('mouseover', function() {
                    var $cal = $(this).parent();
                    if ($cal.hasClass('z-act')) {

                    } else if(disClick($cal.find('.z-n'))){

                    } else {
						$cal.prepend('<span class="z-n"></span>')
                    }
                }).on('mouseout', function() {
                    var $cal = $(this).parent();
                    if ($cal.hasClass('z-act')) {

                    }else if(disClick($cal.find('.z-n'))){

                    }  else {
            			$cal.find('.z-n').remove()
                    }
                })
            }

            function itemClick() {
                $('.j-left').on('click', function() {

                	//alert('我是左边')
                    var $cal = $(this).parent();
                    var str = $cal.find('.day').attr('date');
                    if($cal.find('.z-m').length>=1){
			         if(disClick($cal.find('.z-m'))){
			           return
			         }
			       }
                    var flag = judgeRange($cal);
                   // console.log(flag)
                    if (flag == 0) {
                        if ($cal.find('.z-m').length>=1) {
                        	cancelRange($cal)

                        } else {
                            $cal.addClass('z-act')
            				$cal.prepend('<span class="z-m"></span>');
            				//itemClick()
            				setState(str,true)
                        }
                    } else if (flag == 1) {
                    	if(!obj.start.state&&!obj.end.state){
                    		if ($cal.find('.z-m').length>=1) {
	                            cancelRange($cal)
	                        } else {
	                            $cal.addClass('z-act')
	            				$cal.prepend('<span class="z-m"></span>')
	            				setState(str,true)
	                        }
                    	}else if(obj.start.state||obj.end.state){
                    		if ($cal.find('.z-m').length>=1) {
	                            cancelRange($cal)
	                        } else {
	                            $cal.addClass('z-act')
	            				$cal.prepend('<span class="z-m"></span>')
	            				setState(str,true)
	                        }
                    	}

                    } else if (flag == 2) {
                        $cal.addClass('z-act')
        				$cal.prepend('<span class="z-m"></span>')
            				setState(str,true)
                        addRangeCss($cal)
                    } else if (flag == 3) {
                        $cal.addClass('z-act')
        				$cal.prepend('<span class="z-m"></span>')
            				setState(str,true)
                        addRangeCss($cal)
                    } else if (flag == 4) {
                    	//console.log('我是第4')
                    	//console.log(outputDate())
                    	if(!obj.start.state&&!obj.end.state){
	                        $cal.addClass('z-act')
	        				$cal.prepend('<span class="z-m"></span>')
            				setState(str,true)
            			}else if(obj.start.state||obj.end.state){
            				$cal.addClass('z-act')
	        				$cal.prepend('<span class="z-m"></span>')
            				setState(str,true)
            				addRangeCss($cal)
            			}
                    } else {
                        console.log('error')
                    }

			        //console.log(outputDate())
			        if(obj.itemClickEvent){
                    	obj.itemClickEvent(obj.start,obj.end);
                    }
                })
                $('.j-right').on('click', function() {
                	//alert('我是右边')
                    var $cal = $(this).parent();
                    var str = $cal.find('.day').attr('date');
                    if($cal.find('.z-n').length>=1){
			         if(disClick($cal.find('.z-n'))){
			           return
			         }
			       }
			       var flag=judgeRange($cal);
			      // console.log(flag)
			        if(flag==0){
			          if($cal.find('.z-n').length>=1){
			          	cancelRange($cal)
			          }else{
			          	$cal.addClass('z-act')
			            $cal.prepend('<span class="z-n"></span>')
			            setState(str,false)
			          }
			        }else if(flag==1){
			          if($cal.find('.z-n').length>=1){
			          	cancelRange($cal)
			          }else{
			          	$cal.addClass('z-act')
			            $cal.prepend('<span class="z-n"></span>')
			            setState(str,false);

			          }
			        }else if(flag==2){
			          $cal.addClass('z-act')
			          $cal.prepend('<span class="z-n"></span>')
			            setState(str,false)
			          addRangeCss($cal)
			        }else if(flag==3){
			          $cal.addClass('z-act')
			          $cal.prepend('<span class="z-n"></span>')
			            setState(str,false)
			          addRangeCss($cal)
			        }else if(flag==4){
			          if(!obj.start.state&&!obj.end.state){
	                        $cal.addClass('z-act')
	        				$cal.prepend('<span class="z-n"></span>')
            				setState(str,false)
            			}else if(obj.start.state||obj.end.state){
            				$cal.addClass('z-act')
	        				$cal.prepend('<span class="z-n"></span>')
            				setState(str,false)
            				addRangeCss($cal)
            			}
			        }else{
			          console.log('error')
			        };
			       // console.log(outputDate());
			        if(obj.itemClickEvent){
                    	obj.itemClickEvent(obj.start,obj.end);
                    }
                })
            }
            //返回选中日期
            function outputDate(){
            	var str=''
            	str+='是否有开始值:'
            	str+=obj.start.state
            	str+=';\n年份:';
            	str+=obj.start.year;
            	str+=';\n月份:';
            	str+=obj.start.month;
            	str+=';\n日期:';
            	str+=obj.start.day;
            	str+=';\n早上:';
            	str+=obj.start.morning;
            	str+='。\n是否有结束始值:'
            	str+=obj.end.state
            	str+=';\n年份:';
            	str+=obj.end.year;
            	str+=';\n月份:';
            	str+=obj.end.month;
            	str+=';\n日期:';
            	str+=obj.end.day;
            	str+=';\n早上:';
            	str+=obj.end.morning;
            	return str
            }
             //判断是否可以点击
		     function disClick($item){
		       if(($item.hasClass('z-special'))||$item.hasClass('z-problem')||$item.hasClass('z-repairing')||$item.hasClass('z-rented')||$item.hasClass('z-planned')||$item.hasClass('z-overtime')||$item.hasClass('z-ordered')){
		        // console.log(true)
		         return true
		       }else{
		         //console.log(false)
		         return false
		       }
		     }
            //判断范围
            function judgeRange($this) {
                var $slantAll = $this.parents('.m-calendar').find('.price-calendar');
                var $act = $this.parents('.m-calendar').find('.z-act');
                if (($this.hasClass('z-act') && $act.length >= 2)) {
                    return 0
                } else if ($this.hasClass('z-act') && $act.length == 1){
                    return 1
                } else if ($act.length >= 2) {
                    return 2
                } else if ($act.length == 1) {
                    return 3
                } else if ($act.length == 0) {
                    return 4
                } else {
                    return false
                }
            }

            function addRangeCss($this) {
                var $act = $this.find('.z-act');

                var str = $this.find('.day').attr('date');
                var all=parseInt(str);
            	var d=all%100;
            	var m=parseInt(all/100)%100;
            	var y=parseInt(all/10000);
                //console.log('我是双月渲染')
                //stateReset()
                //console.log(outputDate())
                var $slantAll = $this.parents('.m-calendar').find('.price-calendar');
                var n1 = [];
               // console.log('n1: ' + n1);
                $slantAll.each(function(index, el) {
                    if ($(el).hasClass('z-act')) {
                       // console.log('n1: ' + index);
                        n1.push(index)
                    }
                })
                var actL=n1.length
                var mstart=false,mend=false;
                if(actL==1){
                	//console.log('actL是1')
                	if(obj.start.state&&obj.end.state){
                		//console.log('前后状态都有')
                		var ms=isBigerSize(obj.end.year,obj.end.month,obj.end.day,true,obj.start.year,obj.start.month,obj.start.day,true);
                		if(ms===1){

                		}else{
                			//console.log('前后状态不在同一格子')
                			mstart=isBigerSize(y,m,d,true,obj.start.year,obj.start.month,obj.start.day,true);
                			mend=isBigerSize(obj.end.year,obj.end.month,obj.end.day,true,y,m,d,true);
                			if(mstart===1){
                				n1.push(63)
                			}else if(mend===1){
                				n1.unshift(-1)
                			}
                		}
                	}
                }
                /*console.log(''+y+m+d+true)
                console.log(obj.start.year+obj.start.month+obj.start.day+obj.start.morning)
                console.log(obj.end.year+obj.end.month+obj.end.day+obj.end.morning)
                if(actL==1&&obj.start.state){
                	mstart=isBigerSize(y,m,d,true,obj.start.year,obj.start.month,obj.start.day,obj.start.morning);
            	}
            	if(actL==1&&obj.end.state){
            	 mend=isBigerSize(obj.end.year,obj.end.month,obj.end.day,obj.end.morning,y,m,d,false);
            	}
            	console.log('mstart'+mstart)
            	console.log('actL'+actL)
                if(mstart){
                	console.log('mstart'+mstart)
                	console.log('mend'+mend)
                	if(mstart===1||mend){}else{
                		console.log('in ?what?')
                		n1.unshift(-1)
                	}
                }
                console.log('n1'+n1)
                if(mend){
                	console.log('mend'+mend)
                	if(mend===1||mstart){
                		console.log('what?')
                	}else{
                		n1.push(63)
                		console.log('mend'+mend)
                	}

                }*/
               // console.log('n1: ' + n1);
                $slantAll.each(function(index, el) {
                    if (index > n1[0] && index < n1[n1.length - 1]) {
                    	$(el).addClass('z-act')
			            if($(el).find('.z-m').length==0){
			             $(el).prepend('<span class="z-m"></span>')
			           }
			             if($(el).find('.z-n').length==0){
			             $(el).prepend('<span class="z-n"></span>')
			           }
                    } else if (index == n1[0] && $(el).find('.z-m').length>=1) {
                    	$(el).addClass('z-act')
			            if($(el).find('.z-n').length==0){
			             $(el).prepend('<span class="z-n"></span>')
			           }
                    } else if (index == n1[n1.length - 1] && $(el).find('.z-n').length>=1) {
                    	$(el).addClass('z-act')
			            if($(el).find('.z-m').length==0){
			             $(el).prepend('<span class="z-m"></span>')
			           }
                    }
                });

            }
            //范围判断
            function theState(m,n){
            	var state='0';
            	if(m==1&&n==0){
            		state='10'
            	}else if(m==0&&n==1){
					state='01'
            	}else if(m==1&&n==1){
            		state='11'
            	}else{
            		state='0'
            	}
            	return state
            }
            //取消选择
            function cancelRange($cal){
            	var $slantAll=$cal.parents('.m-calendar').find('.price-calendar');
            	$slantAll.each(function(index,el){
		         var $itemM=$(el).find('.z-m');
		         var $itemN=$(el).find('.z-n');
		         var tempM=disClick($itemM)
		         var tempN=disClick($itemN)
		         if(!tempM){
		           $(el).find('.z-m').remove()
		         }
		         if(!tempN){
		           $(el).find('.z-n').remove()
		         }
		       })
		        $slantAll.removeClass('z-act')
		        stToZero(obj.start);
		        stToZero(obj.end);

            }
            //标记清零
            function stToZero(s){
            	s.state=false;
            	s.year='';
            	s.month='';
            	s.day=''
            }
            //标记赋值
            function stToPoint(s,y,m,d,am){
            	s.state=true;
            	s.year=''+y;
            	s.month=''+m;
            	s.day=''+d;
            	s.morning=am
            }
            //选中 标记赋值
            function setState(str,bam){
            	var all=parseInt(str);
            	var day=all%100;
            	var month=parseInt(all/100)%100;
            	var year=parseInt(all/10000);
            	var bef=isBigerSize(obj.start.year,obj.start.month,obj.start.day,obj.start.morning,year,month,day,bam)
            	var aft=isBigerSize(obj.end.year,obj.end.month,obj.end.day,obj.end.morning,year,month,day,bam)
            	if(!obj.start.state||(obj.end.state&&bef)){
            		stToPoint(obj.start,year,month,day,bam);
            		stateReset()
            	}else if(!obj.end.state||(obj.start.state&&!aft)){
            		stToPoint(obj.end,year,month,day,bam);
					stateReset()
            	}
            }
            //选中 更改初始化状态~

            function changeState(y,m,d){
            	var st=0;
            	stateReset()

	            	if(obj.start.state){
	            		if(parseInt(obj.start.year)<parseInt(y)||(parseInt(obj.start.year)==parseInt(y)&&parseInt(obj.start.month)<parseInt(m))){
	            			st=(-1);

		            	}
		            	/*else{
		            		stToPoint(obj.start,y,m,d)
		            	}*/
	            	}
	            	if(obj.end.state){
		            	if(parseInt(obj.end.year)>parseInt(y)||(parseInt(obj.end.year)==parseInt(y)&&parseInt(obj.end.month)>parseInt(m))){
		            		st+=2;

		            	}
		            	/*else{
		            		stToPoint(obj.end,y,n,d)
		            	}*/
	            	}
            	return st
            }
             //判断日期大小
            function isBigerSize(ay,am,ad,aam,by,bm,bd,bam){
            	var sy=parseInt(ay)
            	var sm=makeTwobit(parseInt(am))
            	var sd=makeTwobit(parseInt(ad))
            	var sam=aam
            	var st=''+sy+sm+sd
            	var ey=parseInt(by)
            	var em=makeTwobit(parseInt(bm))
            	var edd=makeTwobit(parseInt(bd))
            	var eam=bam
            	var ed=''+ey+em+edd
            	if(st>ed){
            		return true
            	}else if(st==ed&&!((!sam)^(eam))){
            		return true
            	}else if(st==ed&&(!(sam^eam))){
					return 1
            	}else{
            		return false
            	}
            }
            //判断日期范围
            function stateRange(y,m,d,am){
            	stateReset();
            	var sy,sm,sd,sam,st;
            	var ey,em,edd,eam,ed;
            	var amy,amm,amd,amam;
            	if(obj.start.state){
            	 sy=parseInt(obj.start.year)
            	 sm=makeTwobit(parseInt(obj.start.month))
            	 sd=makeTwobit(parseInt(obj.start.day))
            	 sam=obj.start.morning
            	 st=''+sy+sm+sd
            	}else{
            		st=0
            	}
            	if(obj.end.state){
            	 ey=parseInt(obj.end.year)
            	 em=makeTwobit(parseInt(obj.end.month))
            	 edd=makeTwobit(parseInt(obj.end.day))
            	 eam=obj.end.morning
            	 ed=''+ey+em+edd
            	}else{
            		ed=0
            	}
            	 amy=parseInt(y)
            	 amm=makeTwobit(parseInt(m))
            	 amd=makeTwobit(parseInt(d))
            	 amam=am
            	 a=''+amy+amm+amd
            	//console.log('st:'+st)
            	//console.log('ed:'+ed)
            	//console.log('a:'+a)
            	if(st==0||ed==0){
            		if(st==a&&(sam&&amam)){
            			//console.log(st)
            			//console.log(obj.start)
            			return true
            		}else if(st==0&&ed==a&&(eam&&amam)){
            			return true
            		}else{
            			return false
            		}

            	}else if(a<st||a>ed){
            		return false
            	}else if(a==st&&(!sam)&&amam){
					return false
            	}else if(a==ed&&eam&&(!amam)){
					return false
            	}else{
            		return true
            	}
            }
            //前后转换
            function stateReset(){
            	var temp={
            		year:obj.end.year,
            		month:obj.end.month,
            		day:obj.end.day,
            		morning:obj.end.morning
            	}
            	var styear=obj.start.year,
            		stmonth=obj.start.month,
            		stday=obj.start.day,
            		stmorning=obj.start.morning;
            	if(!obj.start.state&&obj.end.state){
            		obj.start.state=true;
            		obj.end.state=false;
            		obj.end.year=styear;
            		obj.end.month=stmonth;
            		obj.end.day=stday;
            		obj.end.morning=stmorning;
            		obj.start.year=temp.year;
            		obj.start.month=temp.month;
            		obj.start.day=temp.day;
            		obj.start.morning=temp.morning;
            		return
            	}
            	if(obj.start.state&&!obj.end.state){
            		return
            	}
            	if(parseInt(obj.start.year)>parseInt(obj.end.year)){
            		obj.end.year=obj.start.year;
            		obj.end.month=obj.start.month;
            		obj.end.day=obj.start.day;
            		obj.end.morning=obj.start.morning;
            		obj.start.year=temp.year;
            		obj.start.month=temp.month;
            		obj.start.day=temp.day;
            		obj.start.morning=temp.morning;
            	}else if(parseInt(obj.start.year)==parseInt(obj.end.year)&&parseInt(obj.start.month)>parseInt(obj.end.month)){
            		obj.end.year=obj.start.year;
            		obj.end.month=obj.start.month;
            		obj.end.day=obj.start.day;
            		obj.end.morning=obj.start.morning;
            		obj.start.year=temp.year;
            		obj.start.month=temp.month;
            		obj.start.day=temp.day;
            		obj.start.morning=temp.morning;
            	}else if(parseInt(obj.start.year)==parseInt(obj.end.year)&&parseInt(obj.start.month)==parseInt(obj.end.month)&&parseInt(obj.start.day)>parseInt(obj.end.day)){
            		obj.end.year=obj.start.year;
            		obj.end.month=obj.start.month;
            		obj.end.day=obj.start.day;
            		obj.end.morning=obj.start.morning;
            		obj.start.year=temp.year;
            		obj.start.month=temp.month;
            		obj.start.day=temp.day;
            		obj.start.morning=temp.morning;
            	}else if(parseInt(obj.start.year)==parseInt(obj.end.year)&&parseInt(obj.start.month)==parseInt(obj.end.month)&&parseInt(obj.start.day)==parseInt(obj.end.day)&&obj.end.morning){
            		obj.end.year=obj.start.year;
            		obj.end.month=obj.start.month;
            		obj.end.day=obj.start.day;
            		obj.end.morning=obj.start.morning;
            		obj.start.year=temp.year;
            		obj.start.month=temp.month;
            		obj.start.day=temp.day;
            		obj.start.morning=temp.morning;
            	}
            	if(parseInt(obj.start.year)==parseInt(obj.end.year)&&parseInt(obj.start.month)==parseInt(obj.end.month)&&parseInt(obj.start.day)==parseInt(obj.end.day)&&obj.start.morning&&obj.end.morning){
            		obj.end.state=false
            		obj.end.year='';
            		obj.end.month='';
            		obj.end.day='';
            		obj.end.morning='';

            	}
            }

        })
    };
})(jQuery);
