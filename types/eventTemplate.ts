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
    mutable?: {
        label?: string,
        // 多數欄位使用
        value?: any,
        // 線下地點
        locationName?: string,
        locationAddress?: string,
        // 線上地點
        name?: string,
        url?: string,
        // 票券
        offers?: IOffer[]
    },
    sqlField?: string,
    lastmod?: any,
}

interface IOffer {
    name: string,
    count: number,
    price: number,
}

export interface ITemplateDragSouce extends ITemplateDesign {
    index: number,
}