import EventInterface from "../../@shared/event/event.interface";

interface CustomerPayload {
    id: string;
    name: string;
    active: boolean;
}

export default  interface CustomerPayloadCreatedEvent {
    customer: CustomerPayload;
}

export default class CustomerCreatedEvent implements EventInterface {
    dateTimeOccurred: Date;
    eventData: CustomerPayloadCreatedEvent;

    constructor(eventPayload: CustomerPayloadCreatedEvent) {
        this.dateTimeOccurred = new Date();
        this.eventData = eventPayload;
    }
}