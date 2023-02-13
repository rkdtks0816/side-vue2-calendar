<template>
    <div class="ScheduleBox" v-if="nowdata.schedule === 'add'">
        <div class="ScheduleTitleBox">
            <div class="ScheduleTitle">내용</div>  
            <input type="text" v-model="NewScheduleItem" placeholder="일정을 입력해 주세요">             
        </div>
        <div class="ScheduleTime">
            <div class="ScheduleStartTime">
                <div class="ScheduleAlldayBt">     
                    <div class="ScheduleStartTimeTitle">시작</div>
                    <input type="checkbox" v-model="AllDayCheck">   
                    <div class="ScheduleAlldayBtTitle">하루종일</div> 
                </div>  
                <input type="date" v-model="NewStartDate">   
                <input type="time" v-model="NewStartTime" v-if="!AllDayCheck">            
            </div>
            <div class="ScheduleEndTime">
                <div class="ScheduleEndTimeTitle">종료</div>  
                <input type="date" v-model="NewEndDate">
                <input type="time" v-model="NewEndTime" v-if="!AllDayCheck">
            </div>           
        </div>   
        <div class="ScheduleBt">
            <span class="SaveBt" @click="AddSchedule()">저장</span>    
            <span class="CancelBt" @click="CancelBt()">취소</span>          
        </div>
    </div>
    <div class="ScheduleBox" v-else-if="nowdata.schedule === 'view'">
        <div class="ScheduleTitleBox">
            <span class="ScheduleViewTitle">내용</span>  
            <span class="ScheduleText">{{ ScheduleList[nowdata.scheduleindex].Schedule }}</span>        
        </div>
        <div class="ScheduleTime">
            <div class="ScheduleStartTime">
                <span class="ScheduleStartTimeViewTitle">시작</span>
                <span class="ScheduleText" v-if="ScheduleList[nowdata.scheduleindex].StartTime !== 'AllDay'">
                    {{ 
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(0, 4) + "-" +
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(4, 6) + "-" +
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(6, 8) + " " +
                        ScheduleList[nowdata.scheduleindex].StartTime.slice(0, 2) + ":" +
                        ScheduleList[nowdata.scheduleindex].StartTime.slice(2, 4)
                    }}
                </span>
                <span class="ScheduleText" v-else>
                    {{ 
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(0, 4) + "-" +
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(4, 6) + "-" +
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(6, 8)
                    }}
                </span>
            </div>           
            <div class="ScheduleEndTime">
                <span class="ScheduleEndTimeViewTitle">종료</span>  
                <span class="ScheduleText" v-if="ScheduleList[nowdata.scheduleindex].StartTime !== 'AllDay'">
                    {{ 
                        ScheduleList[nowdata.scheduleindex].EndDate.slice(0, 4) + "-" +
                        ScheduleList[nowdata.scheduleindex].EndDate.slice(4, 6) + "-" +
                        ScheduleList[nowdata.scheduleindex].EndDate.slice(6, 8) + " " +
                        ScheduleList[nowdata.scheduleindex].EndTime.slice(0, 2) + ":" +
                        ScheduleList[nowdata.scheduleindex].EndTime.slice(2, 4)
                    }}
                </span>
                <span class="ScheduleText" v-else>
                    {{ 
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(0, 4) + "-" +
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(4, 6) + "-" +
                        ScheduleList[nowdata.scheduleindex].StartDate.slice(6, 8)
                    }}
                </span>
            </div>           
        </div>   
        <div class="ScheduleBt">
            <span class="SaveBt" @click="EditScheduleBt(nowdata.scheduleindex)">수정</span>    
            <span class="SaveBt" @click="DeleteScheduleBt(nowdata.scheduleindex)">삭제</span>    
            <span class="CancelBt" @click="CancelBt()">닫기</span>          
        </div>
    </div>
    <div class="ScheduleBox" v-if="nowdata.schedule === 'edit'">
        <div class="ScheduleTitleBox">
            <div class="ScheduleTitle">내용</div>  
            <input type="text" v-model="NewScheduleItem" placeholder="일정을 입력해 주세요">             
        </div>
        <div class="ScheduleTime">
            <div class="ScheduleStartTime">
                <div class="ScheduleAlldayBt">     
                    <div class="ScheduleStartTimeTitle">시작</div>
                    <input type="checkbox" v-model="AllDayCheck">   
                    <div class="ScheduleAlldayBtTitle">하루종일</div> 
                </div>  
                <input type="date" v-model="NewStartDate">   
                <input type="time" v-model="NewStartTime" v-if="!AllDayCheck">            
            </div>
            <div class="ScheduleEndTime">
                <div class="ScheduleEndTimeTitle">종료</div>  
                <input type="date" v-model="NewEndDate">
                <input type="time" v-model="NewEndTime" v-if="!AllDayCheck">
            </div>           
        </div>   
        <div class="ScheduleBt">
            <span class="SaveBt" @click="EditSchedule(nowdata.scheduleindex)">저장</span>    
            <span class="CancelBt" @click="CancelBt()">취소</span>          
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.loadScheduleList();
        },
        emits: [
            'AddScheduleList',
            'CancelBt',
            'DeleteSchedule',
            'EditScheduleList'
        ],
        data() {
            return {
                nowdata: {},
                ScheduleList: [],
                NewScheduleItem: '',
                NewStartDate: '',
                NewStartTime: '',
                NewEndDate: '',
                NewEndTime: '',
                AllDayCheck: ''
            }
        },
        methods: {
            loadScheduleList() {
                var savedata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savedata);
                var saveschedulelist = localStorage.getItem("schedulelist");
                this.ScheduleList = JSON.parse(saveschedulelist);
                
                var nowdate = this.nowdata.year + '-' + ('0' + this.nowdata.month).slice(-2) + '-' + ('0' + this.nowdata.date).slice(-2);
                this.NewStartDate = nowdate;
                this.NewStartTime = this.nowdata.time;
                this.NewEndDate = nowdate;
                this.NewEndTime = this.nowdata.time;
                if (this.nowdata.time === 'Al:ay') {
                    this.AllDayCheck = true
                }
            },
            AddSchedule() {
                if (this.AllDayCheck) {
                    this.NewStartTime = "AllDay"
                    this.NewEndTime = "AllDay"
                }
                this.$emit(
                    "AddScheduleList", 
                    this.NewScheduleItem, 
                    this.NewStartDate.replaceAll('-', ''), 
                    this.NewStartTime.replaceAll(':', ''), 
                    this.NewEndDate.replaceAll('-', ''), 
                    this.NewEndTime.replaceAll(':', '')
                );
            },
            CancelBt() {
                this.$emit("CancelBt");
            },
            EditScheduleBt(index) {
                if (this.ScheduleList[index].StartTime === 'AllDay') {
                    this.AllDayCheck = true
                }
                this.NewScheduleItem = this.ScheduleList[index].Schedule;
                var savedata = localStorage.getItem("nowdata");
                this.nowdata = JSON.parse(savedata);
                this.nowdata.schedule = "edit";
                localStorage.setItem("nowdata", JSON.stringify(this.nowdata));
                this.loadScheduleList();
            },
            EditSchedule(index) {
                if (this.AllDayCheck) {
                    this.NewStartTime = "AllDay"
                    this.NewEndTime = "AllDay"
                }
                this.$emit(
                    "EditScheduleList", 
                    this.NewScheduleItem, 
                    this.NewStartDate.replaceAll('-', ''), 
                    this.NewStartTime.replaceAll(':', ''), 
                    this.NewEndDate.replaceAll('-', ''), 
                    this.NewEndTime.replaceAll(':', ''),
                    index
                );
            },
            DeleteScheduleBt(index) {
                this.$emit("DeleteSchedule", index)
                this.loadScheduleList();
            }
        }
    }
</script>

<style>
    /* Schedule */
    .ScheduleBox {
        display: flex;
        flex-direction: column;
        width: 350px;
        padding: 24px 0;
        outline: 1px solid var(--GRAY100A);
        border-radius: 8px;
        text-align: left;
        background-color: rgb(240, 240, 240);
        box-shadow: 0px 5px 10px rgb(0 0 0 / 15%);
    }
    .ScheduleTitleBox {
        padding: 0 10px;       
    }
    .ScheduleTitle
    .ScheduleEndTimeTitle {
        height: 50px;
        font-size: 25px;
        font-weight: 900;
        line-height: 48px;
        padding: 0 10px; 
    }
    .ScheduleViewTitle,
    .ScheduleStartTimeViewTitle,
    .ScheduleEndTimeViewTitle {
        height: 50px;
        font-size: 25px;
        font-weight: 900;
        line-height: 48px;
        padding: 0 10px; 
    }
    .ScheduleText {
        height: 50px;
        font-size: 25px;
        font-weight: 900;
        line-height: 48px;
        color: rgb(50, 50, 50);
    }
    .ScheduleTitleBox input{
        width: 100%;
        height: 50px;
        font-size: 25px;
        font-weight: 900;
        border: none;
        padding: 0;
        border-radius: 8px;
    }
    .ScheduleTitleBox input::placeholder{
        padding-left: 10px;
    }
    .ScheduleTime {
        padding: 10px 10px 0 10px;
        font-size: 25px;
        font-weight: 900;
        line-height: 48px;     
    }
    .ScheduleStartTime input,
    .ScheduleEndTime input {
        width: 100%;
        height: 50px;
        font-size: 25px;
        font-weight: 900;
        border: none;
        padding: 0;
        border-radius: 8px;
        margin: 3px 0;
        color: rgb(112, 112, 112);
    }
    .ScheduleAlldayBt {
        padding: 0 10px; 
        height: 50px;
        font-size: 25px;
        font-weight: 900;
        line-height: 50px; 
        padding: 0 10px;  
        display: flex;     
    }
    .ScheduleAlldayBt input {
        width: 30px;
        height: 30px;
        font-size: 25px;
        font-weight: 900;
        border: none;
        padding: 5px 0;
        margin: 10px 10px 10px 120px;
        color: rgb(112, 112, 112);
    }
    .ScheduleBt {
        padding: 10px 10px 0 10px; 
        height: 50px;
        font-size: 25px;
        font-weight: 900;
        line-height: 48px;
        text-align: right;
    }
    .SaveBt,
    .CancelBt {
        margin-right: 10px;
        cursor: pointer;
    }
</style>