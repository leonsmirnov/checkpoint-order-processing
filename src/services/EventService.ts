import { EventEmitter } from 'events';

export interface DeliveryStatusChangedEvent {
  deliveryStatusId: string;
  orderId: string;
  oldStatus: string;
  newStatus: string;
  timestamp: Date;
}

export class EventService extends EventEmitter {
  private static instance: EventService;

  private constructor() {
    super();
  }

  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  emitDeliveryStatusChanged(event: DeliveryStatusChangedEvent): void {
    console.log(`Emitting delivery status changed event for order ${event.orderId}: ${event.oldStatus} -> ${event.newStatus}`);
    this.emit('deliveryStatusChanged', event);
  }
}