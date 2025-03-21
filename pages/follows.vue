<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="repoUI.isXLarge ? 19 : 24">
                <MoleculeEventCalendarAttendee></MoleculeEventCalendarAttendee>
            </el-col>
            <el-col v-if="repoUI.isXLarge" :span="5">
                <el-card>
                    <AtomVekozCheckboxGroup v-model="selectedFollowList" :items="followList"
                        :item-label="'followeeName'" :item-value="'followeeId'">
                    </AtomVekozCheckboxGroup>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts" setup>
import type { IFollowAction } from '~/types/userFollow'
const repoUI = useRepoUI()
const repoUserFollow = useRepoUserFollow()
const repoUser = useRepoUser()

const selectedFollowList = ref<string[]>([])
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
</script>