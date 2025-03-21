<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="repoUI.isXLarge ? 19 : 24">
                <MoleculeEventCalendarAttendee></MoleculeEventCalendarAttendee>
            </el-col>
            <el-col v-if="repoUI.isXLarge" :span="5">
                <el-card></el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts" setup>
const repoUI = useRepoUI()
</script>