<template>
    <div class="event">
        <div class="event__header">
            <h1>事件管理</h1>
            <el-button @click="dialogVisible = true">樣板設定</el-button>
        </div>
        <br />
        <VotionCalendar></VotionCalendar>

        <el-dialog v-model="dialogVisible" title="樣板設定" class="event__template">
            <el-divider>
                活動描述
            </el-divider>
            <ClientOnly>
                <AtomVotionEditor v-model="template.description">

                </AtomVotionEditor>
            </ClientOnly>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    確認
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import VotionCalendar from '~/components/molecule/VotionCalendar.vue';
import useRepoEvent from '~/composables/useRepoEvent';
const repoEvent = useRepoEvent()

const dialogVisible = ref(false)

const template = reactive({
    description: '',
})

</script>

<style lang="scss" scoped>
.event {
    .event__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>