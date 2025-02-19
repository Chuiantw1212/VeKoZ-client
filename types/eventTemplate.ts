export interface IEventTemplate {
    uid?: string,
    id?: string,
    eventId?: string, // 已創建的event才會有, 編輯中或是樣板不會有
    designs: ITemplateDesign[],
    designIds?: string[],
    name?: string,
    lastmod?: any,
    isPublic?: boolean, // 可被搜索到的活動事件
}

export interface ITemplateDesign {
    id?: string,
    eventId?: string, // 已公開的event才會有, 編輯中或是樣板不會有
    templateId?: string,
    type?: string,
    required?: boolean,
    mutable?: {
        label?: string,
        // 未定義欄位使用
        value?: any,
        // organization
        organizationId?: string,
        organizationName?: string,
        // organization members
        memberIds?: string[],
        memberNames?: string[],
        // 時間
        startDate: Date,
        endDate: Date,
        // 線下地點
        placeId?: string, // entities
        placeName?: string,
        locationAddressRegion?: string, // 第一級行政區
        locationAddress?: string,
        // 線上地點
        virtualLocationName?: string,
        virtualLocationUrl?: string,
        // 票券
        offers?: IOffer[]
    },
    formField?: string,
    lastmod?: any,
    [key: string]: any
}

interface IOffer {
    name: string,
    count: number,
    price: number,
}

export interface ITemplateDragSouce {
    index: number,
    item: ITemplateDesign
}