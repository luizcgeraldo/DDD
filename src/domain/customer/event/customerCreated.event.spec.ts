import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customerCreated.event";
import SendConsoleLog1Handler from "./handler/sendConsoleLog1.handler";
import SendConsoleLog2Handler from "./handler/sendConsoleLog2.handler";
import CustomerPayloadCreatedEvent from "./customerCreated.event";

describe("Customer created event tests", () => {
    afterEach(function () {
        jest.restoreAllMocks();
    });

    it("should notify the event handlers of the creation of a product", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendConsoleLog1Handler();
        const eventHandler2 = new SendConsoleLog2Handler();

        const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle');
        const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle');

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);

        let eventPayload: { customer: { name: string; active: boolean; id: string } };
        eventPayload = {
            customer: {
                id: "123",
                active: false,
                name: "John"
            }
        };

        const customerCreatedEvent = new CustomerCreatedEvent(eventPayload);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();

    });

});