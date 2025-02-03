export interface IChangeInfo {
    event: any,
    relatedEvents: any[],
    oldEvent: any,
    revert: any,
}

/**
 * https://fullcalendar.io/docs/event-object
 */
export interface IFullCalendarEvent {
    id: string,
    groupId?: string,
    allDay?: boolean,
    start: Date,
    end: Date,
    startStr?: string,
    endStr?: string,
    title: string,
    url?: string,
    classNames?: string[],
    editable?: boolean,
    startEditable?: boolean,
    durationEditable?: boolean,
    resourceEditable?: boolean,
    display?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none'
    overlap?: boolean,
    constraint?: any, // TODO: better
    backgroundColor?: string,
    borderColor?: string,
    textColor?: string,
    extendedProps?: object,
    source?: null,
}