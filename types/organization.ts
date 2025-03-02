export type IOrganization = {
    id?: string,
    name?: string,
    description?: string,
    logo?: any,
    banner?: any,
    googleCalendarId?: string,
    lineId?: string,
    sameAs?: string[],
}

export type IOrganizationMember = {
    id?: string,
    name: string,
    email: string,
}