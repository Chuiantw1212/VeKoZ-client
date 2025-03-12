<template>
    <el-table :data="memberships" style="width: 100%">
        <el-table-column prop="color" label="顏色" />
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

const memberships = defineModel<IOrganizationMember[]>({
    type: Array,
    required: true,
})
</script>