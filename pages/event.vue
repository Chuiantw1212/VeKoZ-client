<template>
    <div class="event">
        <div class="event__header">
            <h1>事件管理</h1>
            <el-button @click="dialogVisible = true">樣板設定</el-button>
        </div>
        <br />
        <VotionCalendar></VotionCalendar>

        <el-dialog v-model="dialogVisible" title="樣板設定" class="event__template">
            <FormEventTemplate v-model="organizationTemplate">

            </FormEventTemplate>
            <!-- <el-divider>
                活動描述
            </el-divider> -->
            <!-- <ClientOnly>
                <AtomVenoniaEditor v-model="template.description">

                </AtomVenoniaEditor>
            </ClientOnly> -->
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="putEventTemplate">
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

const dialogVisible = ref(true)

const organizationTemplate = reactive({
    description: '樣板測試',
})

async function putEventTemplate() {
    const res = await repoEvent.putEventTemplate(organizationTemplate)
}

</script>

<style lang="scss" scoped>
.event {
    .event__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>