export interface IEventTemplate {
    uid?: string,
    id?: string,
    eventId?: string, // 已公開的event才會有, 編輯中或是樣板不會有
    designs: ITemplateDesign[]
}

export interface ITemplateDesign {
    type: string,
    mutable?: {
        label: string,
        value: any,
        name?: string,
        address?: string,
        url?: string,
    }
}

export interface ITemplateDragSouce {
    index: number,
    type: string,
}