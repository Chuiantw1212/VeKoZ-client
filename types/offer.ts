export interface IPatchOffer {
    id: string,
    description: string,
}

export interface IOffer {
    id?: string,
    description?: string,
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