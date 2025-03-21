export type UserType = 'host' | 'attendee' | ''

export interface IUser {
    id?: string,
    uid?: string,
    // 其他欄位
    emailVerified?: boolean,
    name?: string,
    email?: string,
    telephone?: string,
    avatar?: any,
    banner?: any,
    providerId?: string, // 註冊來源
    preference?: IUserPreference,
    // SEO可用
    description?: string,
    seoName?: string,
    seoTitle?: string,
    seoSubtitle?: string,
    isPublic?: false,
    designs?: any[],
    sameAs?: string[],
    followerCount?: number,
}

export interface IUserPreference {
    [key: string]: any,
    uid?: string,
    id?: string,
    // 主題偏好
    menuType?: UserType,
    isFullScreen?: boolean,
    // 個別管理畫面的偏好
    follow: IPreferenceFollow,
    event: IPreferenceEvent,
    eventTemplate: IPreferenceEventTemplate,
}

export interface IPreferenceFollow {
    
}

export interface IPreferenceEvent {
    calendarViewType?: 'dayGridMonth' | 'dayGridWeek' | 'listWeek'
    organizerIds?: string[],
    organizerId?: string,
}

export interface IPreferenceEventTemplate {
    organizerId: string,
    templateId: string,
}