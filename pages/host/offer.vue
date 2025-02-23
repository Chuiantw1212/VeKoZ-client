<template>
    <div class="offer">
        <el-alert type="info" show-icon :closable="false">
            欲調整公開狀態、票名、票價、數量，請到活動管理。
        </el-alert>
        <el-divider>銷售中的活動</el-divider>
        <div v-if="Object.keys(ongoingOfferGroups).length" class="offerList">
            <template v-for="(groupOffers, index) in ongoingOfferGroups">
                <MoleculeOfferListItem :model-value="groupOffers" :organizationList="organizationList"
                    @change="patchOfferCategory($event)">
                </MoleculeOfferListItem>
            </template>
        </div>
        <el-card v-else class="notFound">
            <el-empty description="查無資料">
            </el-empty>
        </el-card>
        <el-divider>已結束的活動</el-divider>
        <div v-if="Object.keys(endedOfferGroups).length" class="offerList">
            <template v-for="(groupOffers, index) in endedOfferGroups">
                <MoleculeOfferListItem :model-value="groupOffers" :organizationList="organizationList"
                    @change="patchOfferCategory($event)">
                </MoleculeOfferListItem>
            </template>
        </div>
        <el-card v-else class="notFound">
            <el-empty description="查無資料">
            </el-empty>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import type { IOffer } from '~/types/offer';
import type { IOrganization } from '~/types/organization';
const repoOffer = useRepoOffer()
const repoOrganization = useRepoOrganization()
const ongoingOfferGroups = ref<any>({})
const endedOfferGroups = ref<any>({})
const organizationList = ref<IOrganization[]>([])
// Hooks
onMounted(() => {
    getOrganizationList()
    // getOfferList()
})


// Methods
async function getOrganizationList() {
    const organizations = await repoOrganization.getOrganizationList()
    organizationList.value = organizations
}

async function getOfferList() {
    const result: IOffer[] = await repoOffer.getOfferList()
    const currentDate = new Date().toISOString()

    // const ongoingOffers = result.filter(offer => {
    //     return offer.validThrough >= currentDate
    // })
    // ongoingOfferGroups.value = Object.groupBy(ongoingOffers, ({ categoryId }) => String(categoryId))

    // const endedOffers = result.filter(offer => {
    //     return offer.validThrough < currentDate
    // })
    // endedOfferGroups.value = Object.groupBy(endedOffers, ({ categoryId }) => String(categoryId))
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