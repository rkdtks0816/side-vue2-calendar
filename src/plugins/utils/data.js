function today_data() {
    const today = new Date();

    const todaydatajson = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate(),
        time: change_time(today),
        start_time: change_time(today),
        end_time: change_time(today),
        calender_type : "Month",
        schedule: "add",
        schedule_index: 0,
        schedule_edit: false
    };

    return todaydatajson;
}

// 형식변경
function date_to_datejson(inputdate) {
    let datejson = {};

    datejson.year = inputdate.getFullYear();
    datejson.month = inputdate.getMonth() + 1;
    datejson.date = inputdate.getDate();
    datejson.time = ('0' + inputdate.getHours()).slice(-2) + ":" + ('0' + inputdate.getMinutes()).slice(-2);

    return datejson;
}
function datejson_to_datestr(datejson) {
    let datestr = `${datejson.year}-${datejson.month}-${datejson.date} ${datejson.time}`

    return datestr;
}
function datestr_to_datejson(datestr) {
    let datejson = {};

    datejson.year = datestr.slice(0, 4);
    datejson.month = datestr.slice(5, 7);
    datejson.date = datestr.slice(8, 10);
    datejson.time = datestr.slice(11);

    return datejson;
}



// 로컬 스토리지
function now_data(key, value, todaydatajson) {
    let savedata = localStorage.getItem("nowdata");
    let nowdata = (savedata != null) ? JSON.parse(savedata) : todaydatajson;

    nowdata[key] = value;

    localStorage.setItem("nowdata", JSON.stringify(nowdata));
}

// Todo
function add_todo(NewTodo) {
    let NewTodoJson = {};

    if(NewTodo == ''){
        alert('값을 입력해 주세요.');
        return;
    }

    let savetodolist = localStorage.getItem("todolist");
    let todolist = (savetodolist != null) ? JSON.parse(savetodolist) : []; 

    NewTodoJson.id = (todolist.length !== 0) ? Number([...todolist].sort((a, b) => b['id'] - a['id'] )[0].id) + 1 : 1;
    NewTodoJson.Todo = NewTodo;

    todolist.push(NewTodoJson);
    todolist.sort((a, b) => a['checkstate'] - b['checkstate'] )
    localStorage.setItem("todolist", JSON.stringify(todolist));
}
function delect_todo(index) {
    let savetodolist = localStorage.getItem("todolist");
    let todolist = (savetodolist != null) ? JSON.parse(savetodolist) : []; 
    todolist.splice(index, 1);
    localStorage.setItem("todolist", JSON.stringify(todolist));
}

// Schedule
function data_schedulelist(key, value) {
    let savedata = localStorage.getItem("schedulelist");
    let schedulelistdata = (savedata != null) ? JSON.parse(savedata) : [];

    schedulelistdata[key] = value;

    localStorage.setItem("schedulelist", JSON.stringify(schedulelistdata));
}
function add_scheduleList(NewSchedule, NewStartDate, NewStartTime, NewEndDate, NewEndTime) {
    let NewScheduleJson = {};

    if(NewSchedule == ''){
        alert('값을 입력해 주세요.');
        return;
    } else if(NewStartDate > NewEndDate){
        alert('시작날짜가 종료날짜보다 빨라야 합니다.');
        return;
    } else if(NewStartDate === NewEndDate && NewStartTime > NewEndTime){
        alert('시작시간이 종료시간보다 빨라야 합니다.');
        return;
    }

    let saveschedulelist = localStorage.getItem("schedulelist");
    let schedulelist = (saveschedulelist != null) ? JSON.parse(saveschedulelist) : []; 

    NewScheduleJson.id = (schedulelist.length !== 0) ? Number([...schedulelist].sort((a, b) => b['id'] - a['id'] )[0].id) + 1 : 1;
    NewScheduleJson.Schedule = NewSchedule;
    NewScheduleJson.StartDate = NewStartDate;
    NewScheduleJson.StartTime = NewStartTime;
    NewScheduleJson.EndDate = NewEndDate;
    NewScheduleJson.EndTime = NewEndTime;

    schedulelist.push(NewScheduleJson);
    schedulelist.sort((a, b) => a['EndDate'] - b['EndDate'] || a['EndTime'] - b['EndTime'])
    localStorage.setItem("schedulelist", JSON.stringify(schedulelist));
}
function edit_scheduleList(NewSchedule, NewStartDate, NewStartTime, NewEndDate, NewEndTime, index) {
    if(NewSchedule == ''){
        alert('값을 입력해 주세요.');
        return;
    }

    let saveschedulelist = localStorage.getItem("schedulelist");
    let schedulelist = (saveschedulelist != null) ? JSON.parse(saveschedulelist) : []; 

    schedulelist[index].Schedule = NewSchedule;
    schedulelist[index].StartDate = NewStartDate;
    schedulelist[index].StartTime = NewStartTime;
    schedulelist[index].EndDate = NewEndDate;
    schedulelist[index].EndTime = NewEndTime;

    schedulelist.sort((a, b) => a['EndDate'] - b['EndDate'] || a['EndTime'] - b['EndTime'])
    localStorage.setItem("schedulelist", JSON.stringify(schedulelist));
}
function delete_schedule(index) {
    var saveschedulelist = localStorage.getItem("schedulelist");
    var schedulelist = (saveschedulelist != null) ? JSON.parse(saveschedulelist) : []; 
    schedulelist.splice(index, 1);
    localStorage.setItem("schedulelist", JSON.stringify(schedulelist));
}

// Month Week Day
function pre() {

}


