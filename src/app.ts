import {Client, LocalAuth, Message} from 'whatsapp-web.js';
import Qrcode from 'qrcode-terminal';

const bot = new Client({
    authStrategy: new LocalAuth(), // Gera a session para a authenticação automática
});

bot.on("qr", (qr:string) => {
    Qrcode.generate(qr, {small:true})
})

bot.on('message', (message:Message) => {
    console.log(`${message.from} -- ${message.body}`);
})

bot.on("ready", () => console.log("Bot Connected"))

bot.initialize();