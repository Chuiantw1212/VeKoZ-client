<template>
    <div class="event__actions">
        <div class="actions__offers">
            <div class="offers__options">
                <el-select v-model="form.offerId" placeholder="請選擇" class="row__item row__item--select">
                    <el-option v-for="(item, index) in ticketOptions" :key="index" :label="`${item.label}`"
                        :value="item.value" />
                </el-select>
                <el-input-number v-model="form.offerCount" class="row__item" :controls-position="'right'">

                </el-input-number>
            </div>
            <div class="offers__desc">
                任選三場合購優惠價_每場1400元（定價2000元以內活動，可以任選3場參加。除本場活動，另外2場可以先保留）
            </div>
        </div>
        <div class="actions__btnGroup">
            <el-button class="btnGroup__btn btnGroup__btn--large" type="danger" plain size="large">
                <div class="btn__content">
                    <el-icon :size="24">
                        <Money />
                    </el-icon>
                    1,200
                </div>
            </el-button>
            <el-button class="btnGroup__btn" :icon="More" :disabled="true">
                更多
            </el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { More, Money } from '@element-plus/icons-vue';

const form = ref({
    offerId: 'earlyBird',
    offerCount: 1,
})

const ticketOptions = ref([
    {
        label: '早鳥票',
        value: 'earlyBird'
    },
    {
        label: '一般票',
        value: 'normal'
    },
])
</script>
<style lang="scss" scoped>
.event__actions {
    left: 0px;
    position: fixed;
    bottom: 0px;
    background-color: white;
    width: calc(100vw - 40px);
    display: flex;
    gap: 8px;
    padding: 20px;
    z-index: 20;
    border-top: 1px solid lightgrey;

    .actions__offers {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: space-between;

        .offers__desc {
            text-align: justify;
        }

        .row__item {
            width: 50%;
        }

        .row__item--price {
            width: fit-content;
            text-align: right;
            white-space: nowrap;
        }

        .offers__options {
            display: flex;
            gap: 8px;

        }
    }

    .actions__btnGroup {
        width: fit-content;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .btnGroup__price {
            text-align: right;
            height: 32px;
            line-height: 32px;
        }

        .btnGroup__btn {
            margin: 0px;
        }

        .btnGroup__btn--large {
            min-width: 95px;
            height: 100%;
            min-height: 75px;
            padding: 0px;

            .btn__content {
                display: flex;
                gap: 8px;
                flex-direction: column;
                align-items: center;
                font-size: 24px;
            }
        }
    }

    .row__actionGroup {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .group__icon {
            margin: 0px;
        }
    }
}

@media screen and (min-width: 992px) {
    .event__actions {
        left: unset;
        position: unset;
        top: unset;
        bottom: unset;
        background-color: white;
        width: unset;
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        z-index: unset;
        border-top: unset;

        .actions__offers {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            justify-content: space-between;

            .offers__desc {
                text-align: justify;
            }

            .row__item {
                width: 100%;
            }

            .row__item--price {
                width: fit-content;
                text-align: right;
                white-space: nowrap;
            }

            .offers__options {
                display: flex;
                gap: 8px;

            }
        }

        .actions__btnGroup {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .btnGroup__price {
                text-align: right;
                height: 32px;
                line-height: 32px;
            }

            .btnGroup__btn {
                margin: 0px;
            }

            .btnGroup__btn--large {
                min-width: 95px;
                height: 100%;
                min-height: 75px;
                padding: 0px;

                .btn__content {
                    display: flex;
                    gap: 8px;
                    flex-direction: column;
                    align-items: center;
                    font-size: 24px;
                }
            }
        }

        .row__actionGroup {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .group__icon {
                margin: 0px;
            }
        }
    }
}
</style>