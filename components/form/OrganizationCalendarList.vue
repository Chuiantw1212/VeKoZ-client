<template>
    <el-table :data="memberships" style="width: 100%">
        <el-table-column prop="color" label="顏色">
            <template #default="{ row }">
                <div ref="pickRef" :id="`pickr-${row.organizationId}`">{{ row.organizationId }}</div>
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
import type { IOrganizationMember } from '@/types/organization'
const { $Pickr } = useNuxtApp()
const pickRef = ref() // 只是用來偵測選染完成

// const

const memberships = defineModel<IOrganizationMember[]>({
    type: Array,
    required: true,
})
const currentInstance = getCurrentInstance()

onMounted(() => {
    if (import.meta.client) {
        requestAnimationFrame(waitForRenderCompleted)
    }
})

function waitForRenderCompleted() {
    if (pickRef.value) {
        initializePickr()
    } else {
        requestAnimationFrame(waitForRenderCompleted)
    }
}

function initializePickr() {
    memberships.value.forEach(membership => {
        const element = document.querySelector(`#pickr-${membership.organizationId}`)
        // console.log(element)
        // console.log(currentInstance?.refs)
        // return
        const pickr = ($Pickr as any).create({
            el: element,
            // theme: 'classic', // or 'monolith', or 'nano'

            swatches: [
                'rgb(192, 84, 118)',
                'rgb(216, 86, 117)',
                'rgb(218, 82, 52)',
                'rgb(214, 131, 122)',
            ],

            components: {

                // // Main components
                // preview: true,
                // opacity: true,
                // hue: true,

                // Input / output Options
                interaction: {
                    //     hex: true,
                    //     rgba: true,
                    //     hsla: true,
                    //     hsva: true,
                    //     cmyk: true,
                    //     input: true,
                    //     clear: true,
                    // save: true
                }
            }
        })
        pickr.on('change', (instance: any) => {
            console.log('Event: "change"', instance);
            pickr.hide()
        })
    })
}
</script>