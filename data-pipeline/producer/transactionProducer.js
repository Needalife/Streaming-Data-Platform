const faker = require("faker");
const EventEmitter = require("events");
const { Kafka } = require("kafkajs");

class TransactionProducer extends EventEmitter {
  constructor() {
    super();
    this.isProducing = false;

    // Kafka setup
    this.kafka = new Kafka({
      clientId: "transaction-producer",
      brokers: ["localhost:9092"],
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    console.log("Kafka producer connected.");
  }

  generateTransaction() {
    const currency = faker.helpers.randomize([
      "USD",
      "EUR",
      "GBP",
      "VND",
      "JPY",
    ]);
    let amount;

    switch (currency) {
      case "USD":
      case "EUR":
      case "GBP":
        amount = parseFloat(faker.finance.amount(10, 5000, 2)); // 10 to 5000 for these currencies
        break;
      case "VND":
        amount = parseFloat(faker.finance.amount(200000, 30000000, 0)); // 200,000 to 30,000,000 for VND
        break;
      case "JPY":
        amount = parseFloat(faker.finance.amount(1000, 1000000, 0)); // 1,000 to 1,000,000 for JPY
        break;
      default:
        amount = parseFloat(faker.finance.amount(10, 1000, 2)); // Fallback
    }

    return {
      name: faker.name.findName(),
      email: faker.internet.email(),
      amount: amount,
      currency: currency,
      status: faker.helpers.randomize(["pending", "completed", "failed"]),
      type: faker.helpers.randomize([
        "withdraw",
        "deposit",
        "transfer",
        "payment",
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  startProducing(interval = 5000) {
    this.isProducing = true;
    const produce = async () => {
      if (!this.isProducing) return;

      const transactionCount = faker.datatype.number({ min: 3, max: 20 });
      const transactions = Array.from({ length: transactionCount }, () =>
        this.generateTransaction()
      );

      this.emit("data", transactions);

      await this.producer.send({
        topic: "transactions",
        messages: transactions.map((transaction) => ({
          value: JSON.stringify(transaction),
        })),
      });

      console.log(`${transactionCount} transactions produced.`);

      setTimeout(produce, interval);
    };

    produce();
  }

  stopProducing() {
    this.isProducing = false;
  }
}

const producer = new TransactionProducer();
producer.startProducing();
