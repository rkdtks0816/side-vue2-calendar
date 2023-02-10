<template>
    <!-- CalendarNav -->
    <div class="CalendarNav">
        <div class="CalendarTitleBox">
            <div class="CalendarTitle">
                {{ nowdata.year + "년 " + nowdata.month + "월"}}
            </div>
        </div>
        <div class="PreTodayNextBt">
            <div class="PreBt" @click="PreMonth()">
                &lt;
            </div>
            <div class="TodayBt" @click="TodayMonth()">
                오늘
            </div>
            <div class="NextBt" @click="NextMonth()">
                &gt;
            </div>
        </div>
        <div class="MonthWeekDayBt">
            <div class="MonthBt Select">
                월간
            </div>
            <div class="WeekBt" @click="WeekBt()">
                주간
            </div>
            <div class="DayBt" @click="DayBt()">
                일간
            </div>
        </div>
    </div>
    <!-- CalendarBody -->
    <div class="CalendarBody">   
        <div class="DayOfTheWeekBox">
            <div class="DayOfTheWeek">
                일
            </div>
            <div class="DayOfTheWeek">
                월
            </div>
            <div class="DayOfTheWeek">
                화
            </div>
            <div class="DayOfTheWeek">
                수
            </div>
            <div class="DayOfTheWeek">
                목
            </div>
            <div class="DayOfTheWeek">
                금
            </div>
            <div class="DayOfTheWeek">
                토
            </div>
        </div>
        <div class="CalendarDateBox">
            <div :class="[DateRows.length === 4 ? 'CalendarDateRowFour' : DateRows.length === 5 ? 'CalendarDateRowFive' : 'CalendarDateRowSix']" v-for="DateCols in DateRows">
                <div :class="[DateCol.month === nowdata.month ? 'CalendarNowDateCol' : 'CalendarDateCol']" v-for="DateCol in DateCols">
                    <div class="MonthDatebox" @click="MonthDate(DateCol.year, DateCol.month, DateCol.date)">
                        {{ DateCol.date }}
                    </div>
                    <div class="MonthSchedulebox" @click="AddSchedule(DateCol.date, nowdata.time)">
                        <template v-for="(Schedule, index) in ScheduleList" :key="Schedule.id">
                            <li 
                                class='MonthScheduleList'
                                v-if="(
                                    Schedule.StartDate <= (DateCol.year + ('0' + DateCol.month).slice(-2) + ('0' + DateCol.date).slice(-2)) &&
                                    Schedule.EndDate >= (DateCol.year + ('0' + DateCol.month).slice(-2) + ('0' + DateCol.date).slice(-2))
                                )"
                                @click="ViewSchedule(Schedule.StartTime, Schedule.EndTime, index)"
                            >
                                <span class="Schedule" >{{ Schedule.Schedule }}</span>
                            </li>
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
            'WeekBt',
            'DayBt',
            'AddScheduleBt',
            'ViewScheduleBt'
        ],
        data() {
            return {
                nowdata: {},
                DateRows: []
            }
        },
        mounted() {
            this.LoadCalendarDate();
        },
        methods: {
            LoadCalendarDate() {
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month - 1);
     
                var DateItems = [];

                var predate = new Date(date);
                predate.setDate(1);

                var firstDay = predate.getDay();

                for (var j = firstDay; j != 0; j--) {
                    var DateJson = {};

                    predate.setDate(predate.getDate() - 1);
                    DateJson.year = predate.getFullYear();
                    DateJson.month = predate.getMonth() + 1;
                    DateJson.date = predate.getDate();
                    DateItems.push(DateJson);
                }
                
                var nowdate = new Date(date);
                DateItems.sort((a, b) => a['date'] - b['date'] )

                nowdate.setDate(1);
                var preMonth = nowdate.getMonth();
                var nextMonth = nowdate.getMonth();
                for (var i = 1; preMonth == nextMonth; i++) {
                    var DateJson = {};

                    DateJson.year = nowdate.getFullYear();
                    DateJson.month = nowdate.getMonth() + 1;
                    DateJson.date = nowdate.getDate();
                    DateItems.push(DateJson);
                    nowdate.setDate(nowdate.getDate() + 1);
                    nextMonth = nowdate.getMonth();
                }

                var nextdate = new Date(date);
                nextdate.setMonth(nextdate.getMonth()+1);
                nextdate.setDate(1);
                nextdate.setDate(nextdate.getDate() - 1);
                
                var lastDay = nextdate.getDay();

                for (var k = lastDay; k != 6; k++) {
                    var DateJson = {};

                    nextdate.setDate(nextdate.getDate() + 1);
                    DateJson.year = nextdate.getFullYear();
                    DateJson.month = nextdate.getMonth() + 1;
                    DateJson.date = nextdate.getDate();
                    DateItems.push(DateJson);
                }

                for (var m = 0; m < DateItems.length; m += 7) {
                    var DateCols = [];
                    DateCols = DateItems.slice(m, m + 7);
                    this.DateRows.push(DateCols);
                }
            },
            PreMonth() {
                this.DateRows = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month - 2);
                this.nowdata.year = date.getFullYear();
                this.nowdata.month = date.getMonth() + 1;
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            TodayMonth() {
                this.DateRows = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                this.nowdata.year = new Date().getFullYear();
                this.nowdata.month = new Date().getMonth() + 1;
                this.nowdata.date = new Date().getDate();
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            NextMonth() {
                this.DateRows = [];
                var savenowdata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savenowdata);

                var date = new Date();
                date.setFullYear(this.nowdata.year);
                date.setMonth(this.nowdata.month);
                this.nowdata.year = date.getFullYear();
                this.nowdata.month = date.getMonth() + 1;
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.LoadCalendarDate();
            },
            WeekBt() {
                this.$emit("WeekBt");
                this.LoadCalendarDate();
            },
            DayBt() {
                this.$emit("DayBt");
                this.LoadCalendarDate();
            },
            MonthDate(year, month, date) {
                this.nowdata.year = year;
                this.nowdata.month = month;
                this.nowdata.date = date;
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.DayBt();
            },
            AddSchedule(date, time) {
                this.DateRows = [];
                this.$emit("AddScheduleBt", date, time);
                this.LoadCalendarDate();
            },
            ViewSchedule(StartTime, EndTime, index) {
                this.DateRows = [];
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
        border-top: 1px dashed rgb(150, 150, 150);
        border-left: 1px dashed rgb(150, 150, 150);
    }
    .DayOfTheWeekBox {
        height: 40px;
        display: flex;
        background-color: rgb(225, 225, 225);
    }
    .DayOfTheWeek:first-child {
        color: red;
    }
    .DayOfTheWeek {
        width: calc(100% / 7);
        padding-top: 9px;
        border-bottom: 1px dashed rgb(150, 150, 150);
        border-right: 1px dashed rgb(150, 150, 150);
    }
    .DayOfTheWeek:last-child {
        color: blue;
    }
    .CalendarDateBox {
        height: calc( 100% - 40px );
    }
    .CalendarDateRowFour {
        height: calc(100% / 4);
        display: flex;
    }
    .CalendarDateRowFive {
        height: calc(100% / 5);
        display: flex;
    }
    .CalendarDateRowSix {
        height: calc(100% / 6);
        display: flex;
    }
    .CalendarDateCol:first-child {
        color: rgb(255, 200, 200);
    }
    .CalendarNowDateCol:first-child {
        color: red;
    }
    .CalendarNowDateCol,
    .CalendarDateCol {
        width: calc(100% / 7);
        background-color: rgb(250, 250, 250);
        border-bottom: 1px dashed rgb(150, 150, 150);
        border-right: 1px dashed rgb(150, 150, 150);
        text-align: left;
        padding: 0.5% ;
    }
    .CalendarDateCol {
        color: rgb(200, 200, 200);
    }
    .CalendarNowDateCol:last-child {
        color: blue;
    }
    .CalendarDateCol:last-child {
        color: rgb(200, 200, 255);
    }
    .MonthDatebox {
        width: 20px;
        height: 10%;
        cursor: pointer;
    }
    .MonthSchedulebox {
        height: 90%;
        cursor: pointer;
    }
    .MonthScheduleList {
        display: flex;
        min-height: 20px;
        height: 20px;
        line-height: 20px;
        margin: 0.2rem 0;
        padding: 0 0.9rem;
        background: rgb(150, 150, 150);
        border-radius: 5px;
        color: rgb(250, 250, 250);
        z-index: 500;
    }
</style>