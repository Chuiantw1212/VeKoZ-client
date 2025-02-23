export interface IOffer {
    name: string,
    inventoryMaxValue: any,
    price: any,
    // reqiored
    inventoryValue?: number,
    showInventoryValue?: boolean,
    sellerId?: string,
    sellerName?: string,
    offererId?: string,
    offererName?: string,
    eventId?: string,
    eventName?: string,
    validFrom?: any,
    validThrough?: any,
    categoryId?: string,
    categoryName?: string,
}