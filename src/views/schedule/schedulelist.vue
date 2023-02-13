<template>
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
                    @click="ViewScheduleBt(index)"
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
</template>

<script>
</script>

<style>
</style>