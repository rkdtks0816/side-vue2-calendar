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
    schedule_modal: false
};

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
function now_data(key, value) {
    let savedata = localStorage.getItem("nowdata");
    let nowdata = (savedata != null) ? JSON.parse(savedata) : this.todaydatajson;

    nowdata[key] = value;

    localStorage.setItem("nowdata", JSON.stringify(nowdata));
}

// Todo
function add_todo(NewTodo) {
    var NewTodoJson = {};

    if(NewTodo == ''){
        alert('값을 입력해 주세요.');
        return;
    }

    var savetodolist = localStorage.getItem("todolist");
    var todolist = (savetodolist != null) ? JSON.parse(savetodolist) : []; 

    NewTodoJson.id = (todolist.length !== 0) ? Number([...todolist].sort((a, b) => b['id'] - a['id'] )[0].id) + 1 : 1;
    NewTodoJson.Todo = NewTodo;

    todolist.push(NewTodoJson);
    todolist.sort((a, b) => a['checkstate'] - b['checkstate'] )
    localStorage.setItem("todolist", JSON.stringify(todolist));
}
function delect_todo(index) {
    var savetodolist = localStorage.getItem("todolist");
    var todolist = (savetodolist != null) ? JSON.parse(savetodolist) : []; 
    todolist.splice(index, 1);
    localStorage.setItem("todolist", JSON.stringify(todolist));
}

// Schedule
function schedulelist_data(key, value) {
    let savedata = localStorage.getItem("schedulelist");
    let schedulelistdata = (savedata != null) ? JSON.parse(savedata) : [];

    schedulelistdata[key] = value;

    localStorage.setItem("schedulelist", JSON.stringify(schedulelistdata));
}




