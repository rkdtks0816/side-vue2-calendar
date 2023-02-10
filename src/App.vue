<template>
    <div class="LeftBox"> 
        <div class="ScheduleListBox">
            <!-- 제목 -->
            <header>
                <h3>Schedule📅</h3>
            </header>
            <!-- 출력 -->
            <div class="MainScheduleBox" @click="AddScheduleBt(nowdata.date, nowdata.time)">
                <TransitionGroup name="list" tag="ul">
                    <template v-for="(Schedule, index) in ScheduleList" :key="Schedule.id">
                        <li 
                            class='MainSchedulelist' 
                            v-if="(
                                Schedule.EndDate >= (
                                    new Date().getFullYear() + 
                                    ('0' + (new Date().getMonth() + 1)).slice(-2) + 
                                    ('0' + new Date().getDate()).slice(-2)
                                )
                            )"
                            @click="ViewScheduleBt(Schedule.StartTime, Schedule.EndTime, index)"
                        >
                            <template
                                v-if="(
                                    Schedule.StartDate > (
                                        new Date().getFullYear() + 
                                        ('0' + (new Date().getMonth() + 1)).slice(-2) + 
                                        ('0' + new Date().getDate()).slice(-2)
                                    )
                                )"
                            >
                                <span class="Schedule">{{ Schedule.Schedule  }}</span>
                                <span class="ScheduleDate">{{ Schedule.StartDate + ' ~'}}</span>
                            </template>
                            <template v-else>
                                <span class="Schedule">{{ Schedule.Schedule  }}</span>
                                <span class="ScheduleDate">{{ '~ ' + Schedule.EndDate}}</span>
                            </template>
                        </li>
                    </template>
                </TransitionGroup>
            </div>
        </div>
        <div class="TodolistBox">
            <todolist></todolist>
        </div>
    </div>
    <div v-if="nowdata.CalenderType === 'Month'" class="CalendarBox">
        <month :nowdata="nowdata" :ScheduleList="ScheduleList"></month>
    </div>
    <div v-else-if="nowdata.CalenderType === 'Week'" class="CalendarBox">
        <week :nowdata="nowdata" :ScheduleList="ScheduleList"></week>
    </div>
    <div v-else class="CalendarBox">
        <day :nowdata="nowdata" :ScheduleList="ScheduleList"></day>
    </div>
    <div class="ScheduleClickBox" v-if="nowdata.schedule_modal">
        <div class="SchedulePositionBox">
            <schedulelist></schedulelist>
        </div>
    </div>
</template>

<script>
    import todolist from './views/todolist.vue'
    import month from './views/month.vue'
    import week from './views/week.vue'
    import day from './views/day.vue'
    import schedulelist from './views/schedulelist.vue'

    export default {
        name: 'App',
        components: {
            todolist,
            month,
            week,
            day,
            schedulelist
        },
        data() {
            return {
                ScheduleList: [],
                nowdata: {}
            }
        },
        created() {
            $Utils.data.now_data();
            $Utils.data.schedulelist_data();
        },
        methods: {
            AddScheduleList(NewSchedule, NewStartDate, NewStartTime, NewEndDate, NewEndTime) {
                var NewScheduleJson = {};

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

                var saveschedulelist = localStorage.getItem("schedulelist");
                var schedulelist = (saveschedulelist != null) ? JSON.parse(saveschedulelist) : []; 

                NewScheduleJson.id = (schedulelist.length !== 0) ? Number([...schedulelist].sort((a, b) => b['id'] - a['id'] )[0].id) + 1 : 1;
                NewScheduleJson.Schedule = NewSchedule;
                NewScheduleJson.StartDate = NewStartDate;
                NewScheduleJson.StartTime = NewStartTime;
                NewScheduleJson.EndDate = NewEndDate;
                NewScheduleJson.EndTime = NewEndTime;

                schedulelist.push(NewScheduleJson);
                schedulelist.sort((a, b) => a['EndDate'] - b['EndDate'] || a['EndTime'] - b['EndTime'])
                localStorage.setItem("schedulelist", JSON.stringify(schedulelist));
                this.CancelBt();
            },
            ViewScheduleBt(StartTime, EndTime, index) {
                var savedata = localStorage.getItem("nowdata");
                this.nowdata = (savedata != null) ? JSON.parse(savedata) : this.todaydata;
                this.nowdata.StartTime = StartTime.slice(0, 2) + ":" + StartTime.slice(-2);
                this.nowdata.EndTime = EndTime.slice(0, 2) + ":" + EndTime.slice(-2);
                this.nowdata.schedule = "view";
                this.nowdata.scheduleindex = index;
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.BtState = true;
            },
            DeleteSchedule(index) {
                var saveschedulelist = localStorage.getItem("schedulelist");
                var schedulelist = (saveschedulelist != null) ? JSON.parse(saveschedulelist) : []; 
                schedulelist.splice(index, 1);
                localStorage.setItem("schedulelist", JSON.stringify(schedulelist));
                this.CancelBt();
                this.LoadCalendarDate();
            },
            EditScheduleList(NewSchedule, NewStartDate, NewStartTime, NewEndDate, NewEndTime, index) {
                if(NewSchedule == ''){
                    alert('값을 입력해 주세요.');
                    return;
                }

                var saveschedulelist = localStorage.getItem("schedulelist");
                var schedulelist = (saveschedulelist != null) ? JSON.parse(saveschedulelist) : []; 

                schedulelist[index].Schedule = NewSchedule;
                schedulelist[index].StartDate = NewStartDate;
                schedulelist[index].StartTime = NewStartTime;
                schedulelist[index].EndDate = NewEndDate;
                schedulelist[index].EndTime = NewEndTime;

                schedulelist.sort((a, b) => a['EndDate'] - b['EndDate'] || a['EndTime'] - b['EndTime'])
                localStorage.setItem("schedulelist", JSON.stringify(schedulelist));
                this.CancelBt();
            },
        } 
    }
</script>

<style>
    body {
        margin: 0;
        height: 100%;
        overflow: "hidden";
    }
    #app {
        display: flex;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    .LeftBox {
        width: 18%;
        height: 1000px;
        margin: 0.5% 0.25% 0.5% 0.5%;
        background-color: rgb(240, 240, 240);
    }
    .ScheduleListBox {
        height: 495px;
        padding: 0% 1% 0.5% 1%;
    }
    h3 {
        color: #2F3B52;
        font-weight: 900;
        padding: 2.5rem 0 1.5rem;
        margin: 0;
    }
    .MainSchedulelist {
        display: flex;
        min-height: 35px;
        height: 35px;
        line-height: 35px;
        margin: 0.5rem 0;
        padding: 0 0.9rem;
        background: white;
        border-radius: 5px;
        z-index: 500;
    }
    .Schedule {
        font-family: "NotoSansBold";
        margin-right: auto;
    }
    .ScheduleDate {
        font-size: 12px;
        padding-top: 3px;
    }
    .TodolistBox {
        height: 500px;
        padding: 1% 3% 0% 3%;
        border-top: 5px dotted rgb(150, 150, 150);
    }
    .CalendarBox {
        width: 80%;
        height: 1000px;
        margin: 0.5% 0.5% 0.5% 0.25%;
        background-color: rgb(240, 240, 240);

    }
    /* CalendarNav */
    .CalendarNav {
        height: 9.5%;
        padding: 0% 1% 0.5% 1%;
        display: flex;
        justify-content: space-between;
    }
    .CalendarTitleBox {
        width: 22%;
        margin: auto 0 auto 0;
        display: flex;
    }
    .CalendarTitle {
        width: 70%;
        font-family: "NotoSansBold";
        font-size: 35px;
        font-weight: 900;
        margin-right: 15px;
        white-space:nowrap;
    }
    .PreTodayNextBt {
        width: 15%;
        margin: auto 0 auto 0;
        font-family: "NotoSansBold";
        font-size: 18px;
        font-weight: normal;
        display: flex;
        background-color: rgb(225, 225, 225);
        border-radius: 7px;
        cursor: pointer;
    }
    .PreBt {
        width: 33%;
        font-family: "NotoSansBold";
        font-size: 20px;
        font-weight: 900;
        border-right: 2px dotted rgb(150, 150, 150);
        padding-bottom: 5px;
        cursor: pointer;
    }
    .TodayBt {
        width: 33%;
        font-family: "NotoSansBold";
        font-size: 17px;
        font-weight: normal;
        border-right: 2px dotted rgb(150, 150, 150);
        padding: 4.5px 3px 0 3px;
        cursor: pointer;
    }
    .NextBt {
        width: 33%;
        font-family: "NotoSansBold";
        font-size: 20px;
        font-weight: 900;
        padding-bottom: 5px;
        cursor: pointer;
    }
    .CalendarToday {
        margin: auto 0 auto 0;
        padding: 5px;
        font-family: "NotoSansBold";
        font-size: 18px;
        font-weight: normal;
        background-color: rgb(225, 225, 225);
        border-radius: 7px;
        cursor: pointer;
    }
    .MonthWeekDayBt {
        width: 20%;
        margin: auto 0 auto 0;
        font-family: "NotoSansBold";
        font-size: 18px;
        font-weight: normal;
        display: flex;
        background-color: rgb(225, 225, 225);
        border-radius: 7px;
        cursor: pointer;
    }
    .MonthBt {
        width: 33%;
        font-family: "NotoSansBold";
        padding: 5px;
        font-size: 18px;
        font-weight: normal;
        border-right: 2px solid rgb(150, 150, 150);
        border-radius: 7px 0 0 7px;
        cursor: pointer;
    }
    .WeekBt {
        width: 33%;
        font-family: "NotoSansBold";
        padding: 5px;
        font-size: 18px;
        font-weight: normal;
        border-right: 2px solid rgb(150, 150, 150);
        cursor: pointer;
    }
    .DayBt {
        width: 33%;
        font-family: "NotoSansBold";
        padding: 5px;
        font-size: 18px;
        font-weight: normal;
        border-radius: 0 7px 7px 0;
    }
    .Select {
        color: rgb(250, 250, 250);
        background-color:  rgb(150, 150, 150);
    }
    .ScheduleClickBox {
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    }
    .SchedulePositionBox {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        width: 100%;
        height: 100%;
        background-color: transparent;
        padding: 0 0.5% 0 9%;
    }
    .MainScheduleBox {
        height: 350px;
        overflow: scroll;
    }
    .MainScheduleBox::-webkit-scrollbar {
        display:none;
    }
</style>
