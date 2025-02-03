/**
 * https://fullcalendar.io/docs/eventChange
 */
export interface IChangeInfo {
    event: any,
    relatedEvents: any[],
    oldEvent: any,
    revert: Function,
}

/**
 * https://fullcalendar.io/docs/event-parsing
 */
export interface IFullCalendarEvent {
    id: string,
    groupId?: string,
    allDay?: boolean,
    start: Date | string,
    end: Date | string,
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