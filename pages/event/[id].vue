<template>
    <!-- 活動表單的呈現頁面，要可以被iFrame完美鑲嵌。 -->
    <div v-if="event" class="event">
        <!-- <el-container> -->
        <!-- <div class="event__banner" :style="{ 'background-image': `url(${event.banner})` }">

        </div> -->
        <!-- <el-row>
        </el-row> -->
        <el-row :gutter="20">
            <el-col :span="18">
                <!-- <el-card>
                    {{ event.description }}
                </el-card> -->
                <el-card>
                    <FormTemplateDesign :model-value="event.designs" :disabled="true">

                    </FormTemplateDesign>
                    <!-- <el-row>
                        <el-col v-for="(design) in event.designs">
                            <template v-if="design.mutable">
                                <el-form-item :label="design.mutable.label">
                                    
                                </el-form-item>
                            </template>
</el-col>
</el-row> -->
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <img :src="event.organizerLogo">
                    <div>
                        {{ event.organizerName }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- </el-container> -->
    </div>
</template>
<script setup lang="ts">
import type { IEvent } from '~/types/event'

const repoEvent = useRepoEvent()
const route = useRoute()

const event = ref<IEvent>()

onMounted(() => {
    getEvent()
})
// Methods
async function getEvent() {
    const { id } = route.params
    if (id) {
        const result = await repoEvent.getEvent(String(id))
        console.log({
            result
        })
        event.value = result
    }
}
</script>
<style lang="scss" scoped>
.event {
    .event__banner {
        width: 100%;
        height: 540px;
        background-position: center;
        background-size: cover;
    }
}
</style>