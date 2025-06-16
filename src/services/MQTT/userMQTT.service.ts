import { MqttClient } from "mqtt/*";
import MQTTService from "./MQTT.service";
import { Response } from "express";

class UserMQTTService {
  private mqttClient: MqttClient;
  private frontHandlers: Map<Response, (topic: string) => void> = new Map();

  constructor() {
    this.mqttClient = MQTTService.getMqttClient();
  }

  private static extractId(topic: string): string {
    const parts = topic.split('/');
    if(parts.length > 0) {
      return parts[parts.length - 1];
    }
    return "";
  }

  public sendCommandToListOfUuid(baseTopic:string,uuids : string[]): void {
    uuids.forEach(id => {
      const topic = `${baseTopic}${id}`;
      this.mqttClient.publish(topic,"", (err) => {
        if (err) {
          console.error(`Failed to publish to ${topic}:`, err);
        }
      });
    });
  }

  public addListenerForFront(topicBaseSub:string,res : Response,uuids : string[]): void {
    const handler = (topic: string) => {
      const uuid = UserMQTTService.extractId(topic);
      res.write(`${JSON.stringify({uuid})}`);
    }
    this.removeListenerForFront(topicBaseSub,res,uuids);
    uuids.forEach(id => {
      const topic = `${topicBaseSub}${id}`;
      MQTTService.getMqttEventBus().once(topic, handler);
    });
          this.frontHandlers.set(res, handler);
  }

  public removeListenerForFront(topicBaseSub:string,res: Response, uuids: string[]): void {
    const handler = this.frontHandlers.get(res);
    if (!handler) {
      return;
    }
    uuids.forEach(id => {
      const topic = `${topicBaseSub}${id}`;
      MQTTService.getMqttEventBus().removeListener(topic, handler);
    });    
    this.frontHandlers.delete(res);
  }
}

export default UserMQTTService;