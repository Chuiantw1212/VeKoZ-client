/**
 * https://schema.org/Place
 */
export interface IPlace {
    id?: string,
    name: string,
    address: string,
    addressRegion: string,
    description: string,
    publicAccess: boolean, // default by false
}
