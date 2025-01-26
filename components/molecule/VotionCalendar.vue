<template>
    <div class="votionCalendar">
        <FullCalendar class="votionCalendar__calendar" :options='calendarOptions'></FullCalendar>

        <el-dialog v-model="dialogTableVisible" title="活動編輯">
            <el-form :model="eventForm" label-width="auto">
                <el-form-item label="名稱">
                    <el-input v-model="eventForm.name" placeholder="請輸入" :maxlength="30" :show-word-limit="true" />
                </el-form-item>
                <!-- 從組織管理中選人 -->
                <el-form-item label="主辦/講者">
                    <el-select v-model="eventActors" multiple placeholder="請選擇">
                        <el-option v-for="(item, index) in actorOptions" :key="index" :label="item.name"
                            :value="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="線下地址">
                    <!-- 這邊只是選擇，送出資料時並不會連結原本的資料 -->
                    <el-select v-model="eventForm.locationName" @change="setLocationAddress($event)" placeholder="請選擇">
                        <el-option v-for="item in tableData" :key="item.uid" :label="item.name" :value="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-input :model-value="eventForm.locationAddress" placeholder="請選擇線下地址" :disabled="true" />
                </el-form-item>
                <el-form-item label="線上連結">
                    <el-input v-model="eventForm.virtualLocationUrl" placeholder="請輸入" />
                </el-form-item>

                <el-divider>
                    活動描述
                </el-divider>
                    <AtomVenoniaEditor v-model="eventForm.description">

                    </AtomVenoniaEditor>
                <!-- 那些很重要，但是參加者不需要知道的幕後 -->
                <el-divider>
                    待辦事項
                </el-divider>

                <template v-for="(item, index) in todoList">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="item.name">
                                <el-date-picker v-model="item.value" type="date" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="`已完成`">
                                <el-checkbox-group v-model="todoCheckList[index]" @change="setIsDone($event, index)">
                                    <el-checkbox :value="true" />
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';

const dialogTableVisible = ref(false)

// Mock Data
const actorOptions = [
    { name: 'EN Chu' },
    { name: '.38' },
    { name: 'NaNa' }
]

const tableData = [
    {
        uid: '1',
        name: '齊文藝 2F-Q 安靜區大桌座位',
        address: '台北車站南陽街32號',
        description: '預定須知',
    },
    {
        uid: '2',
        name: 'TCCC台灣文創訓練中心',
        address: '台灣台北市中山區長安東路一段27號2樓',
        description: '預定須知',
    },
]

/**
 * 這邊資料要使用SQL格式，避免物件，未來方便轉換資料用
 * Event參考網址
 * https://schema.org/Event
 */
const eventForm = reactive({
    name: '活動名稱',
    locationName: '',
    locationAddress: '',
    virtualLocationUrl: '',
    description: '', // html
})

const eventActors = ref(['EN Chu', '.38'])

const todoList = reactive([
    {
        name: '海報製作',
        // type: 'date',
        value: '2015-01-15',
        isDone: false,
    },
    {
        name: '文宣',
        type: 'date',
        value: '2015-01-15',
        isDone: false,
    },
])

const todoCheckList = ref([
    [],
    []
])

/**
 * Vue3範例
 * https://github.com/fullcalendar/fullcalendar-examples/blob/main/vue3/src/DemoApp.vue
 */
const calendarOptions = reactive({
    plugins: [dayGridPlugin, interactionPlugin],
    events: [
        { title: 'Meeting', start: new Date() }
    ],
    locale: 'zh-tw',
    headerToolbar: {
        left: 'today prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
    },
    // headerToolbar: {
    //     left: 'today,prev,next',
    //     center: 'title',
    //     right: 'dayGridMonth,dayGridWeek' // user can switch between the two
    // },
    // allLocales
    dateClick: function (info: any) {
        /**
         * 選取日期
         * https://fullcalendar.io/docs/dateClick
         */
        // alert('Clicked on: ' + info.dateStr);
        // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        // alert('Current view: ' + info.view.type);
        // change the day's background color just for fun
        // info.dayEl.style.backgroundColor = 'red';
    },
})

// Methods
function setIsDone(result: string[], index: number) {
    if (todoList[index]) {
        if (result[0]) {
            todoList[index].isDone = true
            return
        }
        todoList[index].isDone = false
    }
}

function setLocationAddress(locationName: string) {
    if (locationName) {
        const selectedItem = tableData.find(item => {
            return item.name === locationName
        })
        if (selectedItem) {
            eventForm.locationAddress = selectedItem.address
        }
    }
}

function listenToDateCell(isOn: boolean) {
    const frames = document.querySelectorAll('.fc-daygrid-day-frame')
    if (isOn) {
        frames.forEach(item => {
            item.addEventListener('mouseenter', toggleEventAddingBtn)
        })
    } else {
        frames.forEach(item => {
            item.removeEventListener('mouseenter', toggleEventAddingBtn)
        })
    }
}

function listenToFcButton(isOn: boolean) {
    const fcButtons = document.querySelectorAll('.fc-button')
    if (isOn) {
        fcButtons.forEach(item => {
            item.addEventListener('click', resetDateCellListener)
        })
    } else {
        fcButtons.forEach(item => {
            item.removeEventListener('click', resetDateCellListener)
        })
    }
}

function resetDateCellListener() {
    listenToDateCell(false)
    listenToDateCell(true)
}

function toggleEventAddingBtn(event: Event) {
    const dayFrame = event.target as any
    const dayTop = dayFrame.querySelector('.fc-daygrid-day-top')

    // 移除所有的事件增加按鈕
    const items = document.querySelectorAll('.addEventBtn')
    items.forEach(item => {
        item.remove()
    })

    // 顯示新增按鈕上去
    const button = document.createElement("button")
    button.type = 'button'
    button.classList.add('addEventBtn')
    button.classList.add('el-button')
    button.classList.add('el-button--small')
    button.innerHTML = `<i class="el-icon"><svg data-v-96a87c83="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
    <path fill="currentColor"
        d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"></path>
</svg></i>`
    button.onclick = () => {
        dialogTableVisible.value = true;
    }

    // 顯示新增按鈕上去
    dayTop.append(button)
}

onMounted(() => {
    nextTick(() => {
        listenToDateCell(true)
        listenToFcButton(true)
    })
})

onBeforeUnmount(() => {
    listenToDateCell(false)
    listenToFcButton(false)
})
</script>

<style lang="scss" scoped>
:deep(.votionCalendar__calendar) {
    max-width: 100%;

    .fc-daygrid-day-top {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
    }

    .addEventBtn {
        transform: translate(4px, 4px);
    }
}
</style>
