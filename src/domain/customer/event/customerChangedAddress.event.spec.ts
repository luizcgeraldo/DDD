import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerChangedAddressEvent from "./customerChangedAddress.event";
import SendConsoleLogAddressHandler from "./handler/sendConsoleLogAddress.handler";

describe("Customer changed of address event tests", () => {
    it("should notify the event handlers of the change of address of a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendConsoleLogAddressHandler();
        const spyEventHandler = jest.spyOn(eventHandler1, "handle");

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler1);

        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);

        const eventPayload = {
            customer: {
                id: "123",
                name: "John",
                oldAddress: {
                    street: "Street 1",
                    number: "123",
                    city: "São Paulo",
                    zip: "13330-250",
                },
                newAddress: {
                    street: "Rua nova",
                    number: "473",
                    city: "São Paulo",
                    zip: "13330-000",
                },
            },
        };

        const customerCreatedEvent = new CustomerChangedAddressEvent(eventPayload);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});