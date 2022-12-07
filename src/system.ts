import { Client, LocalAuth, Message } from "whatsapp-web.js";
import Qrcode from "qrcode-terminal";

interface MessageSended {
  from: string;
  message: Message;
  author: string | undefined;
}

function delay(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export class System {
  private timeout: number;
  private listMessage: MessageSended[] = []; // list in white
  private bot: Client;

  constructor(timeout: number = 5000) {
    this.timeout = timeout;
    this.bot = this.createBot();
    this.initializeEvents();
  }

  public async execute() {
    await this.bot.initialize();
    this.Process();
  }

  private async Process() {
    let online = true;

    while (true) {
      //anything
      if (this.listMessage.length > 0) {
        const msg = this.listMessage.shift(); // Chama a primeira mensage.

        if (msg?.author === undefined) {
          msg?.message.reply("🤖 - Boa tarde!");
          msg?.message.reply(
            "🤖 - Estou no horário de almoço, retornarei ás 13:00"
          );
        }

        if (msg?.message.body.startsWith("Bom dia!")) {
          msg?.message.reply(
            "🤖 - Olá, tudo bem? Seja bem-vindo! Meu nome é Seth. Sou um bot assistente."
          );
          msg?.message.reply(
            "🤖 - Estou trabalhando no momento, deixe sua mensagem que logo entrarei em contato."
          );
        }
      }
      await delay(this.timeout); // consult list an 1 second
    }
  }

  private createBot(): Client {
    return new Client({
      authStrategy: new LocalAuth(),
    });
  }

  private initializeEvents() {
    this.bot.on("qr", (qr: string) => {
      Qrcode.generate(qr, { small: true });
    });

    // Get Message
    this.bot.on("message", (message: Message) => {
      console.log(message);
      this.listMessage.push({
        from: message.from,
        author: message.author,
        message,
      });

      console.log(this.listMessage.length);
    });

    this.bot.on("ready", () => console.log("Bot Connected"));
  }
}
