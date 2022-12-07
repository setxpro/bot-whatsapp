import {Client, LocalAuth, Message} from 'whatsapp-web.js';
import Qrcode from 'qrcode-terminal';

interface MessageSended {
    from: string;
    message: Message;
}

function delay(timeout:number) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    })
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
        while (true) {
            //anything
            if (this.listMessage.length > 0) {
                const msg = this.listMessage.shift() // Chama a primeira mensage.
                if(msg?.message.body.startsWith('Bom dia!')) {
                    msg?.message.reply('🤖 - Bom dia!')
                    msg?.message.reply('🤖 - Não posso atender no momento.')
                    msg?.message.reply('🤖 - Irei responder mais tarde!.')
                }
            }
            // console.log(this.listMessage.length)
            await delay(this.timeout) // consult list an 1 second
        }
    }

    private createBot():Client {
        return new Client({
            authStrategy: new LocalAuth()
        })
    }

    private initializeEvents() {
        this.bot.on("qr", (qr:string) => {
            Qrcode.generate(qr, {small:true})
        })
        
        // Get Message
        this.bot.on('message', (message:Message) => {

            this.listMessage.push({
                from: message.from,
                message
            })

            console.log(this.listMessage.length);
        })
        
        this.bot.on("ready", () => console.log("Bot Connected"))
    }
}