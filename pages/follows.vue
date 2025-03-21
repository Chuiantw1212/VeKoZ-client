<template>
    <div class="follows">
        <el-row :gutter="20">
            <el-col :span="repoUI.isXLarge ? 19 : 24">
                <MoleculeEventCalendarAttendee></MoleculeEventCalendarAttendee>
            </el-col>
            <el-col v-if="repoUI.isXLarge" :span="5">
                <el-card>
                    <template #header>
                        <div class="card__header">
                            選擇月曆
                            <el-button :icon="More" :text="true" :circle="true" @click="openCalendarModal()">

                            </el-button>
                        </div>
                    </template>
                    <AtomVekozCheckboxGroup v-model="selectedFollowList" :items="followList"
                        :item-label="'followeeName'" :item-value="'followeeId'">
                    </AtomVekozCheckboxGroup>
                </el-card>
            </el-col>
        </el-row>

        <AtomVekozDialog v-model="followModalVisible" :showClose="true">
            <template #header>
                組織行事曆
            </template>
            <FormUserFollowList v-model="followList"></FormUserFollowList>
        </AtomVekozDialog>
    </div>
</template>
<script lang="ts" setup>
import { More } from '@element-plus/icons-vue'
import type { IFollowAction } from '~/types/userFollow'
const repoUI = useRepoUI()
const repoUserFollow = useRepoUserFollow()
const repoUser = useRepoUser()

const followModalVisible = ref<boolean>(false)

const selectedFollowList = ref<IFollowAction[]>([])
const followList = ref<IFollowAction[]>([])

// Hooks
watch(() => repoUser.userInfo.id, (isLoggedIn) => {
    if (isLoggedIn) {
        getFollowList()
    }
}, { immediate: true })


// Methods
async function getFollowList() {
    const result = await repoUserFollow.getFollowActionList({
        id: repoUser.userInfo.id,
    })
    followList.value = result
}

function openCalendarModal() {
    followModalVisible.value = true
}
</script>
<style lang="scss" scoped>
.follows {
    .card__header {
        display: flex;
        justify-content: space-between;
    }

    .event__todoList {
        margin-top: 20px;
    }
}
</style>