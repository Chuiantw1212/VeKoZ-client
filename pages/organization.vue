<script setup lang="ts">
import VenoniaUploader from '~/components/atom/VenoniaUploader.vue';

</script>

<template>
    <h1>權限&組織管理</h1>
    <VenoniaUploader></VenoniaUploader>
    <table>
        <thead>
            <tr>
                <th>姓名</th>
                <th>email</th>
                <th>權限(下拉選單)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>EN Chu</th>
                <th>chuinatw1212@gmail.com</th>
                <th>創建事件</th>
            </tr>
        </tbody>
    </table>
</template>