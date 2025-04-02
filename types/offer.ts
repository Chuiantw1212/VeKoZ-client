export interface IPatchOffer {
    id: string,
    description: string,
}

export interface IOffer extends IOfferQuery {
    id?: string,
    description?: string,
    name: string,
    inventoryMaxValue: any,
    price: any,
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

export interface IOfferQuery {
    offererIds?: string[],
}