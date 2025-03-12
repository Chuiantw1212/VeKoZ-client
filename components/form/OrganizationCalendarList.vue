<template>
    <el-table :data="memberships" style="width: 100%">
        <el-table-column prop="color" label="顏色">
            <template #default="{ row }">
                <input class="pickr" ref="pickrRef" :id="`pickr-${row.organizationId}`"></input>
            </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="名稱" />
        <el-table-column prop="" label="GoogleCalendarId">
            <template #default>
                開發中
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
import type Pickr from '@simonwep/pickr'
import type { IOrganizationMember } from '@/types/organization'
const { $Pickr } = useNuxtApp()
const pickrRef = ref() // 只是用來偵測選染完成

const memberships = defineModel<IOrganizationMember[]>({
    type: Array,
    required: true,
})

// Hooks
onMounted(() => {
    if (import.meta.client) {
        requestAnimationFrame(waitForRenderCompleted)
    }
})

// Methods
function waitForRenderCompleted() {
    if (pickrRef.value) {
        initializePickr()
    } else {
        requestAnimationFrame(waitForRenderCompleted)
    }
}

function initializePickr() {
    memberships.value.forEach((membership, index) => {
        const element = document.querySelector(`#pickr-${membership.organizationId}`) as HTMLElement
        /**
         * 規格看這裡
         * https://github.com/simonwep/pickr?tab=readme-ov-file
         */
        const options: Pickr.Options = {
            el: element,
            theme: 'nano', // or 'monolith', or 'nano'
            default: '#42445a',

            /**
             * 仿照 Google Calendar 顏色
             */
            swatches: [
                'rgb(192, 84, 118)',
                'rgb(216, 86, 117)',
                'rgb(218, 82, 52)',
                'rgb(214, 131, 122)',

                'rgb(227, 104, 62)',
                'rgb(221, 120, 53)',
                'rgb(224, 150, 60)',
                'rgb(231, 186, 81)',

                'rgb(216, 190, 94)',
                'rgb(188, 194, 86)',
                'rgb(133, 173, 89)',
                'rgb(85, 176, 128)',

                'rgb(72, 145, 96)',
                'rgb(66, 154, 142)',
                'rgb(75, 153, 210)',
                'rgb(102, 139, 225)',

                'rgb(110, 114, 195)',
                'rgb(130, 139, 194)',
                'rgb(174, 156, 206)',
                'rgb(164, 121, 177)',

                'rgb(167, 90, 186)',
                'rgb(149, 115, 103)',
                'rgb(124, 124, 124)',
                'rgb(165, 153, 140)'
            ],

            components: {
                // preview: true,
                interaction: {
                    // hex: true,
                    //     save: true,
                }
            }
        }

        const pickr = ($Pickr as any).create(options)
        pickr.on('change', (instance: any) => {
            pickr.applyColor()
            pickr.hide()
            if (memberships.value[index]) {
                memberships.value[index].calendarColor = instance.toHEXA() as any
            }
        })
    })
}
</script>
<style lang="scss" scoped>
@import '@simonwep/pickr/dist/themes/nano.min.css';

.pickr {
    :deep(.pcr-swatches) {
        margin-bottom: .6em;
    }
}
</style>