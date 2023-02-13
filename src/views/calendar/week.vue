<template>
    <!-- CalendarNav -->
    <div class="CalendarNav">
        <div class="CalendarTitleBox">
            <div class="CalendarTitle">
                {{ nowdata.year + "년 " + nowdata.month + "월 " + nowWeek[7] + "주"}}
            </div>
        </div>
        <div class="PreTodayNextBt">
            <div class="PreBt" v-on:click="PreWeek()">
                &lt;
            </div>
            <div class="TodayBt" v-on:click="TodayWeek()">
                오늘
            </div>
            <div class="NextBt" v-on:click="NextWeek()">
                &gt;
            </div>
        </div>
        <div class="MonthWeekDayBt">
            <div class="MonthBt" v-on:click="MonthBt()">
                월간
            </div>
            <div class="WeekBt Select">
                주간
            </div>
            <div class="DayBt" v-on:click="DayBt()">
                일간
            </div>
        </div>
    </div>
    <!-- CalendarBody -->
    <div class="CalendarBody">   
        <div class="DayOfTheWeekBox">
            <div class="WeekDay">
                시간
            </div>
            <div class="WeekDay">
                <div class="WeekDatebox" @click="WeekDate(nowdata.year, nowdata.month, nowWeek[0])">
                    {{ nowWeek[0] + " 일"}}
                </div>
            </div>
            <div class="WeekDay">
                <div class="WeekDatebox" @click="WeekDate(nowdata.year, nowdata.month, nowWeek[1])">
                    {{ nowWeek[1] + " 월"}}
                </div>
            </div>
            <div class="WeekDay">
                <div class="WeekDatebox" @click="WeekDate(nowdata.year, nowdata.month, nowWeek[2])">
                    {{ nowWeek[2] + " 화"}}
                </div>
            </div>
            <div class="WeekDay">
                <div class="WeekDatebox" @click="WeekDate(nowdata.year, nowdata.month, nowWeek[3])">
                    {{ nowWeek[3] + " 수"}}
                </div>
            </div>
            <div class="WeekDay">
                <div class="WeekDatebox" @click="WeekDate(nowdata.year, nowdata.month, nowWeek[4])">
                    {{ nowWeek[4] + " 목"}}
                </div>
            </div>
            <div class="WeekDay">
                <div class="WeekDatebox" @click="WeekDate(nowdata.year, nowdata.month, nowWeek[5])">
                    {{ nowWeek[5] + " 금"}}
                </div>
            </div>
            <div class="WeekDay">
                <div class="WeekDatebox" @click="WeekDate(nowdata.year, nowdata.month, nowWeek[6])">
                    {{ nowWeek[6] + " 토"}}
                </div>
            </div>
        </div>
        <div class="WeekBox">
            <div class="WeekCol">
                <div class="WeekRow" v-for="DateLabel in DateLabels">
                    {{ DateLabel.type12 }}
                </div>
            </div>
            <div class="WeekCol" v-for="DateRows in DateCols">
                <div class="WeekRow" v-for="DateRow in DateRows">
                    <div class="WeekScheduleBox" @click="AddSchedule(nowWeek[DateRow.Day], DateRow.type24.slice(0, 2) + ':' + DateRow.type24.slice(-2))">
                        <template v-for="(Schedule, index) in ScheduleList" :key="Schedule.id">
                            <div 
                                class="WeekSchedule" 
                                v-if="(
                                    Schedule.StartDate + String(Number(Schedule.StartTime) - 15) <= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowWeek[DateRow.Day]).slice(-2) + DateRow.type24) &&
                                    Schedule.EndDate + String(Number(Schedule.EndTime) - 15) >= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowWeek[DateRow.Day]).slice(-2) + DateRow.type24)
                                )"
                                @click="ViewSchedule(Schedule.StartTime, Schedule.EndTime, index)"
                            >
                                <div 
                                    class="WeekScheduleText"
                                    v-if="(
                                        Schedule.StartDate + String(Number(Schedule.StartTime) - 15) <= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowWeek[DateRow.Day]).slice(-2) + DateRow.type24) &&
                                        Schedule.StartDate + String(Number(Schedule.StartTime) + 15) >= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowWeek[DateRow.Day]).slice(-2) + DateRow.type24)
                                    )"
                                >
                                    {{ Schedule.Schedule}}
                                </div>
                            </div>
                            <div 
                                class="WeekSchedule" 
                                v-else-if="(
                                    Schedule.StartDate <= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowWeek[DateRow.Day]).slice(-2)) &&
                                    Schedule.EndDate >= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowWeek[DateRow.Day]).slice(-2)) &&
                                    Schedule.StartTime === DateRow.type24 &&
                                    Schedule.EndTime === DateRow.type24
                                )"
                                @click="ViewSchedule(StartTime, EndTime,  index)"
                            >
                                {{ Schedule.Schedule}}
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'ScheduleList'
        ],
        emits: [
            'MonthBt',
            'DayBt',
            'ViewScheduleBt',
            'AddScheduleBt'
        ],
        data() {
            return {
                nowdata: {},
                nowWeek: [],
                DateCols: [],
                DateLabels: []
            }
        },
        mounted() {
            this.LoadCalendarDate();
        },
        methods: {
            LoadCalendarDate() {
                // 날짜
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);
                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month - 1);
                date.setDate(this.nowdata.date);

                var predate = new Date(date);
                var firstDay = predate.getDay();
                for (var j = firstDay; j != 0; j--) {

                    predate.setDate(predate.getDate() - 1);
                    this.nowWeek.push(predate.getDate());
                }                
                this.nowWeek.reverse()

                this.nowWeek.push(date.getDate());

                var nextdate = new Date(date);                
                var lastDay = nextdate.getDay();
                for (var k = lastDay; k != 6; k++) {

                    nextdate.setDate(nextdate.getDate() + 1);
                    this.nowWeek.push(nextdate.getDate());
                }
                var Daydate = this.nowWeek[4];
                
                // 주차
                var WeekNum = 0;
                var firstDate = new Date(date);
                firstDate.setDate(Daydate);

                var preMonth = firstDate.getMonth();
                var nextMonth = firstDate.getMonth(); 
                for(var n = 1; preMonth === nextMonth; n++) {
                    firstDate.setDate(firstDate.getDate() - 7);
                    nextMonth = firstDate.getMonth();
                    WeekNum = n;
                }
                this.nowWeek.push(WeekNum);


                // 시간
                this.DateLabels.push({
                    type24: "AllDay",
                    type12: "하루종일"
                },{
                    type24: "00",
                    type12: "오전 0시"
                });
                var timejson = {};
                for (var i = 1; i < 24; i++) {
                    timejson.type24 = ('0' + i).slice(-2);
                    timejson.type12 = (i < 12) ? '오전 ' + i + '시' : (i === 12) ? '오후 ' + 12 + '시' : '오후 ' + (i - 12) + '시';
                    this.DateLabels.push(timejson);
                    timejson = {};
                }

                var DataRows = [];
                var planjson = {};
                for (var k = 0; k < 7; k++) {
                    DataRows = [];
                    DataRows.push({
                        Day: k,
                        type24: "AllDay",
                    },{
                        Day: k,
                        type24: "0000",
                    },{
                        Day: k,
                        type24: "0030",
                    });
                    for (var j = 1; j < 24; j++) {
                        planjson.Day = k;
                        planjson.type24 = ('0' + j).slice(-2) + "00";
                        DataRows.push(planjson);
                        planjson = {};

                        planjson.Day = k;
                        planjson.type24 = ('0' + j).slice(-2) + "30";
                        DataRows.push(planjson);
                        planjson = {};
                    }
                    this.DateCols.push(DataRows);
                }
            },
            PreWeek() {
                this.DateCols = [];
                this.DateLabels = [];
                this.nowWeek = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month - 1);
                date.setDate(this.nowdata.date - 7);
                this.nowdata.year = date.getFullYear();
                this.nowdata.month = date.getMonth() + 1;
                this.nowdata.date = date.getDate();
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            TodayWeek() {
                this.DateCols = [];
                this.DateLabels = [];
                this.nowWeek = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);
                
                this.nowdata.year = new Date().getFullYear();
                this.nowdata.month = new Date().getMonth() + 1;
                this.nowdata.date = new Date().getDate();
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            NextWeek() {
                this.DateCols = [];
                this.DateLabels = [];
                this.nowWeek = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month - 1);
                date.setDate(this.nowdata.date + 7);
                this.nowdata.year = date.getFullYear();
                this.nowdata.month = date.getMonth() + 1;
                this.nowdata.date = date.getDate();
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            MonthBt() {
                this.$emit("MonthBt");
                this.LoadCalendarDate();
            },
            DayBt() {
                this.$emit("DayBt");
                this.LoadCalendarDate();
            },
            WeekDate(year, month, date) {
                this.nowdata.year = year;
                this.nowdata.month = month;
                this.nowdata.date = date;
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.DayBt();
            },
            AddSchedule(date, time) {
                this.DateCols = [];
                this.DateLabels = [];
                this.nowWeek = [];
                this.$emit("AddScheduleBt", date, time);
                this.LoadCalendarDate();
            },
            ViewSchedule(StartTime, EndTime, index) {
                this.DateCols = [];
                this.DateLabels = [];
                this.nowWeek = [];
                this.$emit("ViewScheduleBt", StartTime, EndTime, index);
                this.LoadCalendarDate();
            }
        }
    }
</script>

<style>
    /* CalendarBody */
    .CalendarBody {
        height: 86.5%;
        margin: 0.5% 1% 1% 1%;
        border-top: 1px dotted rgb(150, 150, 150);
        border-left: 1px dotted rgb(150, 150, 150);
    }
    .DayOfTheWeekBox {
        height: 40px;
        display: flex;
        background-color: rgb(225, 225, 225);
    }
    .WeekDay:first-child {
        width: 5%;
        cursor: default;
    }
    .WeekDay:nth-child(2) {
        color: red;
    }
    .WeekDay {
        width: calc(95% / 7);
        padding-top: 9px;
        border-bottom: 1px dotted rgb(150, 150, 150);
        border-right: 1px dotted rgb(150, 150, 150);
        cursor: pointer;
    }
    .WeekDay:last-child {
        color: blue;
    }
    .WeekBox {
        height: calc( 100% - 40px );
        display: flex;
        overflow: scroll;
    }
    .WeekBox::-webkit-scrollbar {
        display:none;
    }
    .WeekCol:first-child {
        width: 5%;
    }
    .WeekCol {
        width: calc(95% / 7);
    }
    .WeekCol:first-child .WeekRow{
        height: calc(100% / 15);
        font-size: 13px;
    }
    .WeekRow:first-child {
        height: calc(100% / 15);
        position: sticky;
        top: 0;
    }
    .WeekRow {
        height: calc(100% / 30);
        text-align: right;
        border-bottom: 1px dotted rgb(150, 150, 150);
        border-right: 1px dotted rgb(150, 150, 150);
        box-sizing: border-box;
        background-color: rgb(250, 250, 250);
    }
    .WeekScheduleBox {
        display: flex;
        height: 100%;
        cursor: pointer;
    }
    .WeekSchedule {
        height: 100%;
        width: calc(100% / 1);
        background-color: rgb(150, 150, 150);
        color: rgb(250, 250, 250);
        border: 1px solid rgb(150, 150, 150);
        border-right-color: rgb(100, 100, 100);
        text-align: left;
        padding: 5px 0 0 5px;
    }
    .WeekSchedule:last-child {
        height: 100%;
        width: calc(100% / 1);
        background-color: rgb(150, 150, 150);
        color: rgb(250, 250, 250);
        border: 1px solid rgb(150, 150, 150);
        text-align: left;
        padding: 5px 0 0 5px;
    }
</style>