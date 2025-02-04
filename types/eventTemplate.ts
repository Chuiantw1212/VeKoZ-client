export interface IEventTemplate {
    uid?: string,
    id?: string,
    eventId?: string, // 已公開的event才會有, 編輯中或是樣板不會有
    designs: ITemplateDesign[]
}

export interface ITemplateDesign {
    id?: string,
    type: string,
    mutable?: {
        label?: string,
        value?: any,
        name?: string,
        address?: string,
        url?: string,
        offers?: any[]
    },
}

export interface ITemplateDragSouce extends ITemplateDesign {
    index: number,
}