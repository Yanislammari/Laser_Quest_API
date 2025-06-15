import mqtt from "mqtt";

const client = mqtt.connect("mqtt://192.168.1.126:1883");

const topicsSubscribe = ["esp32/status"];

export async function initClientMqtt() {
  client.on("connect", () => {
    console.log("Connected to MQTT broker");

    // Subscribe to your ESP32 topic
    client.subscribe(topicsSubscribe, (err) => {
      if (err) {
        console.error("Subscribe error:", err);
      }
    });
  });

  client.on("message", (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);

    // You can parse JSON if you send JSON strings:
    try {
      const data = JSON.parse(message.toString());
      client.publish("esp32/control", JSON.stringify({ status: "received", data }));
      //console.log("Parsed data:", data);
    } catch (e) {
      console.log("Not a JSON message");
    }
  });
}