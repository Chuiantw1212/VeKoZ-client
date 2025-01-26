<template>
    <el-form class="form">
        <el-form-item label="主辦單位">
            <el-input v-model="organization.organizer" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="描述">
            <AtomVenoniaEditor class="form__item" v-model="organization.descrption"></AtomVenoniaEditor>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const organization = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
</script>
<style lang="scss" scoped>
.form {
    .form__item {
        width: 100%;
    }
}
</style>