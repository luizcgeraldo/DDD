import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customerChangedAddress.event";

export default class SendConsoleLogAddressHandler implements EventHandlerInterface<CustomerChangedAddressEvent> {
    handle(event: CustomerChangedAddressEvent): void {
        const { id, name, oldAddress, newAddress } = event.eventData.customer;
        console.log(
            `Endereço do cliente: ${id}, ${name} alterado para: ${newAddress.street} ${newAddress.number}, ${newAddress.city} - ${newAddress.zip}`
        );
    }
}
