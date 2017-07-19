$(function () {

  /* initialize the external events
   -----------------------------------------------------------------*/
  function ini_events(ele) {
    ele.each(function () {

      // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
      // it doesn't need to have a start or end
      var eventObject = {
        title: $.trim($(this).text()) // use the element's text as the event title
      };

      // store the Event Object in the DOM element so we can get to it later
      $(this).data('eventObject', eventObject);

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 1070,
        revert: true, // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });
  }

  ini_events($('#external-events div.external-event'));

  /* initialize the calendar
   -----------------------------------------------------------------*/
  //Date for the calendar events (dummy data)
  var date = new Date();
  var newEvent = [];
  $('#calendar').fullCalendar({
    defaultView: 'agendaWeek',
    allDaySlot: false,
    minTime: "08:00:00",
    maxTime: "22:00:00",
    header: {
      left: 'title',
      center: '',
      right: 'prev,next,today'
    },
    buttonText: {
      today: '今天',
    },
    editable: true,
    droppable: true,
    drop: function (start) { // this function is called when something is dropped
      start = Date.parse(start);
      var end = start + 1000*3600*2;
      
      var type = $(this).data('type');
      var eventObj = {
        title: expTypes[$(this).data('type')]+ '实验：' + $(this).text()+'  申请人: 刘耀楷',
        start: start,
        end: end,
        backgroundColor: bgColors[$(this).data('type')],
        borderColor: bgColors[$(this).data('type')],
        type: $(this).data('type')
      }
      newEvent.push(eventObj);
      // render the event on the calendar
      $('#calendar').fullCalendar('renderEvent', eventObj, true);

    },
    eventResize: function(event) {
        for(var item of newEvent) {
          if(item.start == event.start._i){
            item.end = Date.parse(event.end._d);// resize时更新对应的eventObject
          }
        }
    }
  });
  
  var bgColors = ['rgb(0, 115, 183)', 'rgb(0, 166, 90)', 'rgb(221, 75, 57)'];
  var expTypes = ['过程流体机械', '过程设备设计', '过程控制技术'];
  /* ADDING EVENTS */
  var type = 0;
  //Color chooser button
  var colorChooser = $("#color-chooser-btn");
  $("#color-chooser > li > a").click(function (e) {
    e.preventDefault();
    type = $(this).data("type");
    //Add color effect to button
    $('#add-new-event').css({"background-color": bgColors[type], "border-color": bgColors[type]});
  });
  function initEvents() {// 加载时获取events数据,只显示两周
    var time = new Date().getTime()/1000;
    var todaySec = time-(time+8*3600)%86400; //获取今日0点时间戳
    var todayDay = new Date().getDay();
    var monday = todayDay === 0 ? todaySec - 6*86400 : todaySec - (todayDay-1)*86400; //周一的getDay为1，周日为0
    var nextSunday = monday + 14*86400;
    var oldEvents = [];
    $.get('/api/events?start='+(monday*1000)+'&end='+(nextSunday*1000), function(res) {
      if(!res.data.length) return;
      res.data.forEach(function(event) {
        oldEvents.push({
          start: event.start,
          end: event.end,
          title: event.title,
          backgroundColor: bgColors[event.type],
          borderColor: bgColors[event.type],
          editable: false
        });
      });
      $('#calendar').fullCalendar('renderEvents', oldEvents, true);
    });
  }
  initEvents();
  // 表单添加event
  $("#add-new-event").click(function (e) {
    e.preventDefault();
    //Get value and make sure it is not null
    var val = $("#new-event").val();
    var start = Date.parse($('#startTime').val())+8*3600*1000;// 时间戳考虑中国所处时区
    var end = $('#endTime').val() ? Date.parse($('#endTime').val())+8*3600*1000 : start+3600*1000*2;
    // 默认时长两个小时
    if (val.length == 0||!start) {
      return alert('请检查表单是否填写完整！');
    }
    var eventObject = {
      title: expTypes[type] + '实验：' + val+'  申请人：刘耀楷',
      start: start,
      end: end,
      user: '刘耀楷',
      type: type
    }
    var newObj = {
      title: eventObject.title,
      start: start,
      end: end,
      backgroundColor: bgColors[type],
      borderColor: bgColors[type],
      editable: false
    }
    $.post('/api/events', JSON.stringify(eventObject), function(data) {
       if(data.code == 200) {
        $('#calendar').fullCalendar('renderEvent', newObj, true);
        alert(data.msg);
      }else{
        alert('错误：'+data.msg);
      }
    });
  });
  // timetable直接添加，每次添加完需要将newEvents清空
  $('#add-all-event').click(function() {
    if(!newEvent.length) return alert('还没有预约任何实验哦');
    var arr = [];
    newEvent.forEach(function(event) {
      arr.push({
        title: event.title,
        start: event.start,
        end: event.end,
        type: event.type,
        user: '刘耀楷'
      });
    })
    $.post('/api/events', JSON.stringify(arr), function(data) {
      if(data.code == 200) {
        $('#calendar').fullCalendar('removeEvents');
        initEvents();
        newEvent = [];
        alert(data.msg);
      }else{
        alert('错误：'+JSON.stringify(data.msg));
      }
    });
  });
});