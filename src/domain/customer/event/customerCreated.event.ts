import EventInterface from "../../@shared/event/event.interface";

interface CustomerPayload {
    id: string;
    name: string;
    active: boolean;
}

interface CustomerPayloadCreatedEvent {
    customer: CustomerPayload;
}

export class CustomerCreatedEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: CustomerPayloadCreatedEvent;

    constructor(eventPayload: CustomerPayloadCreatedEvent) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventPayload;
    }
}