import mqtt from "mqtt";
import { EventEmitter } from 'events';
import dotenv from "dotenv";

dotenv.config();
const MQTT_ADRESS = process.env.MQTT_ADRESS as string;

const mqttClient = mqtt.connect(MQTT_ADRESS);
const mqttEventBus = new EventEmitter();

class MQTTService {
  private static instance: MQTTService;
  private mqttClient: mqtt.MqttClient = mqttClient;
  private static mqttEventBus: EventEmitter = mqttEventBus;

  private constructor() {}

  public static getInstance(): MQTTService {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }
    return MQTTService.instance;
  }

  public static getMqttClient(): mqtt.MqttClient {
    return mqttClient;
  }

  public static getMqttEventBus(): EventEmitter {
    return mqttEventBus;
  }

  public connect(): void {
    const topics = ["esp32/status/+",]
    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      this.mqttClient.subscribe(topics, (err) => {
        if (err) {
          console.error("Failed to subscribe to all topics:", err);
        }
      });
    });
    this.mqttClient.on("message", (topic,message) => {
      MQTTService.mqttEventBus.emit(topic, topic, message.toString());
    });
  }

  public disconnect(): void {
    console.log("Disconnected from MQTT broker");
  }
}

export default MQTTService;