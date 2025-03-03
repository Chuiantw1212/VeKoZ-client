<template>
    <MoleculeVenoniaCard class="index__card">
        <template #default>
            <NuxtLink :to="`/event/${item.id}`" target="_blank" :disabled="disabled">
                <div v-if="item.banner" class="card__image" :style="{ 'background-image': `url(${item.banner})` }">
                </div>
                <div v-else class="card__image" :style="{ 'background-image': `url(${placeholderImage})` }"></div>
            </NuxtLink>
        </template>
        <template #footer>
            <table class="card__footTable">
                <tbody>
                    <tr>
                        <td colspan="2">
                            <div class="table__time">
                                <span class="time__span">
                                    {{ getDate(item) }}
                                    <!-- cardSize: {{ cardSize }} -->
                                </span>

                                <span class="time__span">
                                    {{ getTimes(item) }}
                                </span>
                            </div>
                        </td>
                        <td>
                            <img class="table__logo" :src="item.organizerLogo">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <NuxtLink :to="`/event/${item.id}`" target="_blank">
                                {{ item.name }}
                            </NuxtLink>
                        </td>
                        <!-- <td>
                                            <div class="footer__offer">
                                                NTD 250
                                            </div>
                                        </td> -->
                    </tr>
                    <tr>
                        <td>{{ getRegionName(item) }}</td>
                        <td></td>
                        <td>
                            <div class="footer__offer">
                                <!-- NTD 250 -->
                            </div>
                        </td>
                    </tr>
                </tbody>
                <!-- <tr>
                                    <td colspan="3">{{ item.organizerName }}</td> // 初期使用者不在意？
                                </tr> -->
            </table>
            <!-- <span>
                                台北市
                            </span>
                            <span>
                                {{ item.name }}
                            </span>
                            <span class="footer__offer">
                                NTD 250
                            </span> -->
        </template>
    </MoleculeVenoniaCard>
</template>
<script setup lang="ts">
import type { IEventFromList } from '~/types/event'
import type { ISelectOption } from '~/types/meta'
import placeholderImage from '@/assets/logo/500_250.png'
const repoMeta = useRepoMeta()
const item = defineModel<IEventFromList>('modelValue', {
    type: Object,
    default: {}
})
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    }
})

const taiwanRegions = ref<ISelectOption[]>([])

onMounted(() => {
    getMetaSelectById()
})

// Methods
function getRegionName(event: IEventFromList) {
    const regionValue = event.locationAddressRegion
    const selectedOption = taiwanRegions.value.find(option => {
        return option.value === regionValue
    })
    if (selectedOption) {
        return selectedOption.label
    }
    return '地點未定'
}

async function getMetaSelectById() {
    const result = await repoMeta.getMetaSelectById('taiwan')
    taiwanRegions.value = result
}
function getDate(event: IEventFromList) {
    if (event.startDate) {
        const startDate: Date = new Date(event.startDate)
        const date = startDate.toLocaleDateString('zh-TW')
        const weekOfTheDay = startDate.getDay()
        const dayString = ['日', '一', '二', '三', '四', '五', '六']
        return `${date}(${dayString[weekOfTheDay]})`
    }
}

function getTimes(event: IEventFromList) {
    let timeString = ''
    if (event.startDate) {
        const startDate: Date = new Date(event.startDate)
        const startTime = startDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += `${startTime.slice(0, 5)}`
    }
    if (event.endDate) {
        const endDate: Date = new Date(event.endDate)
        const endTime = endDate.toLocaleTimeString('zh-TW', {
            hour12: false,
        })
        timeString += ` ~ ${endTime.slice(0, 5)}`
    }
    return timeString
}
</script>
<style lang="scss" scoped>
.card__image {
    background-position: center;
    display: block;
    height: 150px;
    width: auto;
    background-size: cover;
    background-repeat: no-repeat;
}

.index__cardWrap {
    margin-bottom: 8px;
}

.card__footTable {
    width: 100%;
    min-height: 125px;
    text-align: justify;

    .table__row {
        display: flex;
        justify-content: space-between;
        width: 100%;

        * {
            width: 33%;
        }
    }

    .table__time {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        width: 100%;

        .time__span {
            text-wrap: nowrap;
        }
    }

    .table__logo {
        width: 40px;
        border: 1px solid black;
        border-radius: 50%;
        display: block;
        margin-left: auto;
    }

    .footer__offer {
        white-space: nowrap;
        text-align: right;
        width: 100%;
    }
}
</style>