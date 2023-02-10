<template>
    <!-- CalendarNav -->
    <div class="CalendarNav">
        <div class="CalendarTitleBox">
            <div class="CalendarTitle">
                {{ nowdata.year + "년 " + nowdata.month + "월 " + nowdata.date + "일"}}
            </div>
        </div>
        <div class="PreTodayNextBt">
            <div class="PreBt" v-on:click="PreDay()">
                &lt;
            </div>
            <div class="TodayBt" v-on:click="TodayDay()">
                오늘
            </div>
            <div class="NextBt" v-on:click="NextDay()">
                &gt;
            </div>
        </div>
        <div class="MonthWeekDayBt">
            <div class="MonthBt" v-on:click="MonthBt()">
                월간
            </div>
            <div class="WeekBt" v-on:click="WeekBt()">
                주간
            </div>
            <div class="DayBt Select">
                일간
            </div>
        </div>
    </div>
    <!-- CalendarBody -->
    <div class="CalendarBody">   
        <div class="DayOfTheWeekBox">
            <div class="Day">
                시간
            </div>
            <div :class="[nowday === ' 일' ? 'Sun' : nowday === ' 토' ? 'Sat' : 'Day']">
                {{ nowdata.date + nowday }}
            </div>
        </div>
        <div class="DayBox">
            <div class="DayCol">
                <div class="DayRow" v-for="DateLabel in DateLabels">
                    {{ DateLabel.type12 }}
                </div>
            </div>
            <div class="DayCol">
                <div class="DayRow" v-for="DateRow in DataRows">
                    <div class="DayScheduleBox" @click="AddSchedule(nowdata.date, DateRow.type24.slice(0, 2) + ':' + DateRow.type24.slice(-2))">
                        <template v-for="(Schedule, index) in ScheduleList" :key="Schedule.id">
                            <div 
                                class="DaySchedule" 
                                v-if="(
                                    Schedule.StartDate + String(Number(Schedule.StartTime) - 15) <= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowdata.date).slice(-2) + DateRow.type24) &&
                                    Schedule.EndDate + String(Number(Schedule.EndTime) - 15) >= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowdata.date).slice(-2) + DateRow.type24)
                                )"
                                @click="ViewSchedule(Schedule.StartTime, Schedule.EndTime, index)"
                            >
                                <div 
                                    class="DayScheduleText"
                                    v-if="(
                                        Schedule.StartDate + String(Number(Schedule.StartTime) - 15) <= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowdata.date).slice(-2) + DateRow.type24) &&
                                        Schedule.StartDate + String(Number(Schedule.StartTime) + 15) >= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowdata.date).slice(-2) + DateRow.type24)
                                    )"
                                >
                                    {{ Schedule.Schedule}}
                                </div>
                            </div>
                            <div 
                                class="DaySchedule" 
                                v-else-if="(
                                    Schedule.StartDate <= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowdata.date).slice(-2)) &&
                                    Schedule.EndDate >= (nowdata.year + ('0' + nowdata.month).slice(-2) + ('0' + nowdata.date).slice(-2)) &&
                                    Schedule.StartTime === DateRow.type24 &&
                                    Schedule.EndTime === DateRow.type24
                                )"
                                @click="ViewSchedule(Schedule.StartTime, Schedule.EndTime, index)"
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
            'WeekBt',
            'ViewScheduleBt',
            'AddScheduleBt'
        ],
        data() {
            return {
                nowday: "",
                nowdata: {},
                DataRows: [],
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

                var DayOfTheWeek = [" 일", " 월", " 화", " 수", " 목", " 금", " 토"];
                this.nowday = DayOfTheWeek[date.getDay()];

                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));

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

                var planjson = {};
                this.DataRows.push({
                    type24: "AllDay",
                },{
                    type24: "0000",
                },{
                    type24: "0030",
                });
                for (var j = 1; j < 24; j++) {
                    planjson.type24 = ('0' + j).slice(-2) + "00";
                    this.DataRows.push(planjson);
                    planjson = {};

                    planjson.type24 = ('0' + j).slice(-2) + "30";
                    this.DataRows.push(planjson);
                    planjson = {};
                }
            },
            PreDay() {
                this.DataRows = [];
                this.DateLabels = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month - 1);
                date.setDate(this.nowdata.date - 1);
                this.nowdata.year = date.getFullYear();
                this.nowdata.month = date.getMonth() + 1;
                this.nowdata.date = date.getDate();
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            TodayDay() {
                this.DataRows = [];
                this.DateLabels = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);
                
                this.nowdata.year = new Date().getFullYear();
                this.nowdata.month = new Date().getMonth() + 1;
                this.nowdata.date = new Date().getDate();
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            NextDay() {
                this.DataRows = [];
                this.DateLabels = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month - 1);
                date.setDate(this.nowdata.date + 1);
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
            WeekBt() {
                this.$emit("WeekBt");
                this.LoadCalendarDate();
            },
            AddSchedule(date, time) {
                this.DataRows = [];
                this.DateLabels = [];
                this.$emit("AddScheduleBt", date, time);
                this.LoadCalendarDate();
            },
            ViewSchedule(StartTime, EndTime, index) {
                this.DataRows = [];
                this.DateLabels = [];
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
    .Day:first-child {
        width: 5%;
    }
    .Sat {
        width: 95%;
        padding-top: 9px;
        border-bottom: 1px dotted rgb(150, 150, 150);
        border-right: 1px dotted rgb(150, 150, 150);
        color: blue;
    }
    .Sun {
        width: 95%;
        padding-top: 9px;
        border-bottom: 1px dotted rgb(150, 150, 150);
        border-right: 1px dotted rgb(150, 150, 150);
        color: red;
    }
    .Day {
        width: 95%;
        padding-top: 9px;
        border-bottom: 1px dotted rgb(150, 150, 150);
        border-right: 1px dotted rgb(150, 150, 150);
    }
    .DayBox {
        height: calc( 100% - 40px );
        display: flex;
        overflow: scroll;
    }
    .DayBox::-webkit-scrollbar {
        display:none;
    }
    .DayCol:first-child {
        width: 5%;
    }
    .DayCol {
        width: 95%;
    }
    .DayCol:first-child .DayRow{
        height: calc(100% / 15);
        font-size: 12px;
    }
    .DayRow:first-child {
        height: calc(100% / 15);
        position: sticky;
        top: 0;
    }
    .DayRow {
        height: calc(100% / 30);
        text-align: right;
        border-bottom: 1px dotted rgb(150, 150, 150);
        border-right: 1px dotted rgb(150, 150, 150);
        box-sizing: border-box;
        background-color: rgb(250, 250, 250);
    }
    .DayScheduleBox {
        display: flex;
        height: 100%;
        cursor: pointer;
    }
    .DaySchedule {
        height: 100%;
        width: calc(100% / 1);
        background-color: rgb(150, 150, 150);
        color: rgb(250, 250, 250);
        border: 1px solid rgb(150, 150, 150);
        text-align: left;
        padding: 5px 0 0 5px;
    }
</style>