<template>
    <el-form label-width="auto">
        <el-row justify="space-between" :gutter="20">
            <el-col :span="24">
                <el-form-item label="註冊Email">
                    <el-input v-model="userForm.email" placeholder="請輸入Email" :disabled="true">
                        <template #suffix>
                            (僅主辦方可見)
                        </template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="別名/姓名">
                    <el-input v-model="userForm.name" placeholder="請輸入別名或姓名" :maxlength="30" :show-word-limit="true"
                        :disabled="disabled">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-divider>願意主動提供給主辦方的資料</el-divider>
        <el-alert type="info" show-icon :closable="false">
            TODO：將會包含年齡、性別、職業，便於主辦方舉行特定活動，例：Womens Talk, Mens Talk。
        </el-alert>
    </el-form>
</template>
<script setup lang="ts">
import type { IUser } from '~/types/user';
const userForm = defineModel<IUser>('modelValue', {
    type: Object,
    default: {
        id: '',
        name: '',
        description: '',
        seoName: '',
        seoTitle: '',
    }
})
const props = defineProps({
    disabled: {
        type: Boolean,
        defualt: false,
    }
})
</script>