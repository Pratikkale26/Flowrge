
import { prisma } from "db/prisma";

async function main() {
    await prisma.availableTrigger.create({
        data: {
            id: "webhook",
            name: "Webhook",
            image: "https://media.licdn.com/dms/image/v2/D4D12AQHtrdLcx2NuzQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1709325806317?e=2147483647&v=beta&t=DUaFfcSvxvwZCn00XhUncL3j8xFHJaSI_pcyYBrqX_4",
        }
    })    
    await prisma.availableTrigger.create({
        data: {
            id: "solana",
            name: "Solana Transaction",
            image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
        }
    })    

    await prisma.availableAction.create({
        data: {
            id: "sol",
            name: "Send Solana",
            image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
        }
    })

    await prisma.availableAction.create({
        data: {
            id: "email",
            name: "Send Email",
            image: "https://media.istockphoto.com/id/1125279178/vector/mail-line-icon.jpg?s=612x612&w=0&k=20&c=NASq4hMg0b6UP9V0ru4kxL2-J114O3TaakI467Pzjzw="
        }
    })

    await prisma.availableAction.create({
        data: {
            id: "x-post",
            name: "Post on X",
            image: "https://img.freepik.com/premium-vector/new-logo-twitter-2023-vector-elon-musk_982229-557.jpg?semt=ais_hybrid&w=740&q=80"
        }
    })
    
}

main();