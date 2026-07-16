import { TaskProcessorService } from '../../application/services/TaskProcessorService';
export declare class RabbitMQConsumer {
    private taskProcessor;
    private connection;
    private channel;
    constructor(taskProcessor: TaskProcessorService);
    startListening(queueName: string): Promise<void>;
}
