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
    // SEO使用
    name?: string,
    description?: string,
}

export interface IUserPreference {
    [key: string]: any,
    uid?: string,
    id?: string,
    userType?: UserType,
    event: IPreferenceEvent
}

export interface IPreferenceEvent {
    calendarViewType?: 'dayGridMonth' | 'dayGridWeek' | 'listWeek'
    organizationIds?: string[]
}