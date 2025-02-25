export type UserType = 'host' | 'attendee' | ''

export interface IUser {
    id?: string,
    emailVerified?: boolean,
    displayName?: string,
    email?: string,
    phoneNumber?: string,
    photoURL?: string,
    providerId?: string,
    uid?: string,
    preference?: IUserPreference,
    // 通用
    name?: string,
    description?: string,
    // SEO使用
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