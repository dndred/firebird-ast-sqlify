import { prisma } from './prisma.ts'

const main = async () => {
  console.log('Hello, world!')
  const r = await prisma.items.findMany({
    select: {
      itemid: true,
      priceOpt: true,
      color: {
        select: {
          colorname: true,
        },
      },
    },
    take: 2,
    where: {
      color: {
        colorId: 20,
      },
    },
  })
  console.log(JSON.stringify(r, null, 2))
}
await main()
