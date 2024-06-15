import { prisma } from './prisma.ts'

const main = async () => {
  console.log('Hello, world!')
  const r = await prisma.items.findMany({
    select: {
      itemid: true,
    },
    where: {
      color: {
        colorId: 10
      }
    },
  })
  console.log(JSON.stringify(r, null, 2))
}
await main()
