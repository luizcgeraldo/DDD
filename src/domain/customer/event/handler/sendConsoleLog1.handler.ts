import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import EventInterface from "../../../@shared/event/event.interface";

export default class SendConsoleLog1Handler implements EventHandlerInterface<EventInterface>{
    handle(event: EventInterface): void {
        console.log("Esse e o primeiro console.log do evento: CustomerCreated");
    }
}