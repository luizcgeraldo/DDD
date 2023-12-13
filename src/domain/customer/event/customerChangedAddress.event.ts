import EventInterface from "../../@shared/event/event.interface";

export interface Address {
    street: string;
    number: string;
    city: string;
    zip: string;
}

export interface CustomerPayload {
    id: string;
    name: string;
    oldAddress: Address;
    newAddress: Address;
}

export interface CustomerPayloadChangedAddressEvent {
    customer: CustomerPayload;
}

export default class CustomerChangedAddressEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: CustomerPayloadChangedAddressEvent;

    constructor(eventPayload: CustomerPayloadChangedAddressEvent) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventPayload;
    }
}
