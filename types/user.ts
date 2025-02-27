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
    providerId?: string, // 註冊來源
    preference?: IUserPreference,
    // SEO可用
    description?: string,
    seoName?: string,
    seoTitle?: string,
    isPublic?: false,
    designs?: any[]
}

export interface IUserPreference {
    [key: string]: any,
    // publicInfos?: string[], // 這邊可能會限制講者開放的資訊  
    uid?: string,
    id?: string,
    userType?: UserType,
    isFullScreen?: boolean,
    event: IPreferenceEvent
}

export interface IPreferenceEvent {
    calendarViewType?: 'dayGridMonth' | 'dayGridWeek' | 'listWeek'
    organizationIds?: string[]
}