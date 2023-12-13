import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import {CustomerCreatedEvent} from "../customerCreated.event";

export default class SendConsoleLog1Handler implements EventHandlerInterface<CustomerCreatedEvent>{
    handle(event: CustomerCreatedEvent): void {
        console.log("Esse e o primeiro console.log do evento: CustomerCreated");
    }
}