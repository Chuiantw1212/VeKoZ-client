export interface IPatchOffer {
    id: string,
    description: string,
}

export interface IOffer extends IOfferQuery {
    description?: string,
    name: string,
    inventoryMaxValue: any,
    price: any,
    showInventoryValue?: boolean,
    sellerId?: string,
    sellerName?: string,
    offererId?: string,
    offererName?: string,
    eventName?: string,
    validFrom?: any,
    validThrough?: any,
    categoryId?: string,
    categoryName?: string,
}

export interface IOfferQuery {
    id?: string,
    eventId?: string,
    inventoryValue?: number,
    offererIds?: string[],
}