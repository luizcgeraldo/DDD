import EventInterface from "../../@shared/event/event.interface";

export default interface Address {
    street: string;
    number: string;
    city: string;
    zip: string;
}

export default interface CustomerPayload {
    id: string;
    name: string;
    oldAddress: Address;
    newAddress: Address;
}

export default interface CustomerPayloadChangedAddressEvent {
    customer: CustomerPayload;
}

export default class CustomerChangedAddressEvent implements EventInterface {
    dateTimeOccurred: Date;
    eventData: any;
    payload: CustomerPayloadChangedAddressEvent;

    constructor(eventPayload: CustomerPayloadChangedAddressEvent) {
        this.dateTimeOccurred = new Date();
        this.payload = eventPayload;
    }
}