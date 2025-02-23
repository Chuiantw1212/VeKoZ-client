<template>
    <div class="offer">
        <el-alert type="info" show-icon :closable="false">
            欲調整公開狀態、票名、票價、數量，請到活動管理。
        </el-alert>
        <!-- <el-divider>未完成的活動</el-divider> -->
        <el-card class="notFound">
            <el-empty description="查無資料">
            </el-empty>
        </el-card>
        <div class="offerList">
            <template v-for="(groupOffers, index) in offerGroups">
                <MoleculeOfferListItem :model-value="groupOffers" :organizationList="organizationList"
                    @change="patchOfferCategory($event)">

                </MoleculeOfferListItem>
                <!-- <el-card class="offerList__item">
                    <template #header>
                        <div class="card__header">
                            {{ getDate(groupOffers[0]) }}
                            {{ groupOffers[0].categoryName }}
                            <div class="header__btnGroup">
                                <el-tooltip v-model:visible="shareTooltipVisible" content="連結已複製" trigger="click">
                                    <el-button :icon="Share" class="btnGroup__btn"
                                        @click="shareLink(groupOffers[0])">分享售票連結</el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
<el-form>
    <el-row :gutter="20">
        <el-col :span="formFieldSpan">
            <el-form-item label="活動名稱">
                {{ groupOffers[0].eventName }}
            </el-form-item>
        </el-col>
        <el-col :span="formFieldSpan">
            <el-form-item label="活動時間">
                {{ getTimes(groupOffers[0]) }}
            </el-form-item>
        </el-col>
        <el-col :span="formFieldSpan">
            <el-form-item label="公開狀態">
                {{ groupOffers[0].eventIsPublic ? '已公開' : '非公開' }}
            </el-form-item>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="formFieldSpan">
            <el-form-item label="主辦單位">
                {{ groupOffers[0].offererName }}
            </el-form-item>
        </el-col>
        <el-col :span="formFieldSpan">
            <el-form-item label="售票單位">
                <el-select v-model="groupOffers[0].sellerId" placeholder="請選擇"
                    @change="patchOfferCategory(groupOffers[0])" :disabled="checkOfferIsOver(groupOffers[0])">
                    <el-option v-for="(item, index) in organizationList" :key="index" :label="`${item.name}`"
                        :value="item.id" />
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="formFieldSpan">
            <el-form-item label="票券剩餘數量">
                <el-switch v-model="groupOffers[0].eventIsPublic" inline-prompt active-text="公開" inactive-text="隱藏"
                    @change="patchOfferCategory(groupOffers[0])" :disabled="checkOfferIsOver(groupOffers[0])" />
            </el-form-item>
        </el-col>
    </el-row>
</el-form>
<el-table :data="groupOffers" style="width: 100%">
    <el-table-column prop="name" label="票券名稱">
    </el-table-column>
    <el-table-column prop="price" label="票價">
    </el-table-column>
    <el-table-column prop="inventoryValue" label="數量">
        <template #default="{ row }">
                                {{ row.inventoryValue }} / {{ row.inventoryMaxValue }}
                            </template>
    </el-table-column>
</el-table>
</el-card> -->
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { IOffer } from '~/types/offer';
import type { IOrganization } from '~/types/organization';
const repoOffer = useRepoOffer()
const offers = ref<IOffer[]>()
const offerGroups = ref<any>()
const repoOrganization = useRepoOrganization()
const endedOfferGroups = ref<any>()
const organizationList = ref<IOrganization[]>([])
// Hooks
onMounted(() => {
    getOrganizationList()
    getOfferList()
})


// Methods
async function getOrganizationList() {
    const organizations = await repoOrganization.getOrganizationList()
    organizationList.value = organizations
}

async function getOfferList() {
    const result: IOffer[] = await repoOffer.getOfferList()
    offers.value = result
    offerGroups.value = Object.groupBy(result, ({ categoryId }) => categoryId)
}

async function patchOfferCategory(offer: IOffer,) {
    const selectedSeller = organizationList.value.find(org => {
        return org.id === offer.sellerId
    })
    if (selectedSeller) {
        offer.sellerName = selectedSeller.name
    }
    await repoOffer.patchOfferCategory(offer)
}

</script>
<style lang="scss" scoped>
.notFound {
    margin-top: 20px;
}

.offer {
    max-height: calc(100vh - 100px);
    overflow-y: auto;

    .offerList {
        margin-top: 20px;
    }
}


@media screen and (min-width: 768px) {
    .offer {

        .offerList {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 20px;
        }
    }
}
</style>