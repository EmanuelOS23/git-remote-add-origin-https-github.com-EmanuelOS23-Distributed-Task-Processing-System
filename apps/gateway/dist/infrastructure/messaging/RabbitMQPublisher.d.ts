export declare class RabbitMQPublisher {
    private static connection;
    private static channel;
    static connect(): Promise<any>;
    publish(queueName: string, message: any): Promise<void>;
}
