export type IOrganization = {
    id: string,
    name: string,
    description: string,
    logo: string | Buffer,
    banner: string | Buffer,
    googleCalendarId?: string,
    lineId?: string,
    sameAs?: string[],
}

export type IOrganizationMember = {
    id?: string,
    name: string,
    email: string,
}