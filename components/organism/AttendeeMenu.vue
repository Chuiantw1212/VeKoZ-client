<template>
    <el-menu class="footerMenu" mode="horizontal" :ellipsis="false" :menu-trigger="'click'">
        <MoleculeAttendeeMenuItems></MoleculeAttendeeMenuItems>
    </el-menu>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.footerMenu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border-top: 1px solid lightgrey;
    max-width: 1280px;

    .footerMenu__logo {
        margin: 0px;
    }

    >* {
        width: 25%;
    }
}
</style>