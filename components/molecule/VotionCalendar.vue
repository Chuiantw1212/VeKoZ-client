<template>
    <div class="votionCalendar">
        <FullCalendar class="votionCalendar__calendar" :options='calendarOptions'></FullCalendar>

        <el-dialog v-model="dialogTableVisible" title="活動編輯" @close="dialogTableVisible = false" :lock-scroll="true">
            <FormEvent v-if="dialogTableVisible" v-model="form">
                <slot></slot>
                <template v-slot:eventActor>
                    <!-- Q9iDU9CGpWxA5DgYeaNq -->
                    <el-form-item label="講者">
                        <el-select v-model="eventActors" filterable multiple allow-create
                            :placeholder="`輸入後，篩選選項 或 新增`">
                            <el-option v-for="(item, index) in actorOptions" :key="index" :label="item.name"
                                :value="String(item.id)" />
                        </el-select>
                    </el-form-item>
                </template>
                <template v-slot:eventTodos>
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
                                    <el-checkbox-group v-model="todoCheckList[index]"
                                        @change="setIsDone($event, index)">
                                        <el-checkbox :value="true" />
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </template>
            </FormEvent>
            <template #footer>
                <el-button @click="dialogTableVisible = false">取消</el-button>
                <el-button type="primary" @click="createEvent()">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import type { IOrganizationMember } from '~/types/organization';
const emit = defineEmits(['update:modelValue'])
const repoOrganization = useRepoOrganization()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => { }
    }
})

const dialogTableVisible = ref(false)

const actorOptions = ref<IOrganizationMember[]>([])

const organizationTemplateOptions = ref([
    {
        label: 'EN Chu',
        value: 'EN Chu',
        color: 'blue',
    },
    {
        label: '.38',
        value: '.38',
        color: 'yellow',
    }
])

/**
 * 這邊資料要使用SQL格式，避免物件，未來方便轉換資料用
 * Event參考網址
 * https://schema.org/Event
 */
const form = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

// const eventForm = reactive({
//     name: '活動名稱',
//     locationName: '',
//     locationAddress: '',
//     virtualLocationUrl: '',
//     description: '', // html
//     startDate: '',
//     endDate: '',
// })

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
})

// Hooks
onMounted(() => {
    getOrganizationMembers()
    nextTick(() => {
        listenToDateCell(true)
        listenToFcButton(true)
    })
})

onBeforeUnmount(() => {
    listenToDateCell(false)
    listenToFcButton(false)
})

// Methods
async function getOrganizationMembers() {
    const result = await repoOrganization.getOrganizationMemberList()
    actorOptions.value = result
}

function createEvent() {

}

function setIsDone(result: string[], index: number) {
    if (todoList[index]) {
        if (result[0]) {
            todoList[index].isDone = true
            return
        }
        todoList[index].isDone = false
    }
}

function listenToDateCell(isOn: boolean) {
    const frames = document.querySelectorAll('.fc-daygrid-day-frame')
    frames.forEach(item => {
        item.removeEventListener('mouseenter', toggleEventAddingBtn)
    })
    if (isOn) {
        frames.forEach(item => {
            item.addEventListener('mouseenter', toggleEventAddingBtn)
        })
    }
}

function listenToFcButton(isOn: boolean) {
    const fcButtons = document.querySelectorAll('.fc-button')
    fcButtons.forEach(item => {
        item.removeEventListener('click', resetDateCellListener)
    })
    if (isOn) {
        fcButtons.forEach(item => {
            item.addEventListener('click', resetDateCellListener)
        })
    }
}

function resetDateCellListener() {
    listenToDateCell(true)
}

function toggleEventAddingBtn(event: Event) {
    const dayFrame = event.target as any
    const dayTop = dayFrame.querySelector('.fc-daygrid-day-top')
    const dateNumber = dayTop.querySelector('.fc-daygrid-day-number')
    const dateLabelInChinese: string = dateNumber.ariaLabel
    let formatLabel = dateLabelInChinese.replace('年', '-')
    formatLabel = formatLabel.replace('月', '-')
    formatLabel = formatLabel.replace('日', '')
    const dateInstance = new Date(formatLabel)
    const isoDateString = dateInstance.toISOString()

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
    button.onclick = async () => {
        form.value.startDate = isoDateString
        form.value.endDate = isoDateString
        dialogTableVisible.value = true;
    }

    // 顯示新增按鈕上去
    dayTop.append(button)
}
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
