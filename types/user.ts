export type UserType = 'host' | 'attendee' | ''

export interface IUser {
    id?: string,
    emailVerified: boolean,
    displayName: string,
    email: string,
    phoneNumber: string,
    photoURL: string,
    providerId: string,
    uid: string,
}

export interface IUserPreference {
    uid?: string,
    id?: string,
    userType?: UserType,
}