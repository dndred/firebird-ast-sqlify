import { prisma } from './prisma.ts'

const main = async () => {
  console.log('Hello, world!')
  const r = await prisma.items.findMany({
    select: {
      itemId: true,
      priceOpt: true,
      color: {
        select: {
          colorName: true,
        },
      },
      rashod: {
        take: 2,
        include: {
          RashodDocs: {
            include: {
              Clients: true,
            },
          },
        },
      },
    },
    take: 500,
    where: {
      color: {
        colorName: 'Белый',
      },
      rashod: {
        every: {
          numDoc: {
            gte: 0,
          },
        },
      },
    },
  })
  console.log(r.filter((i) => i.rashod.length > 0))
}
await main()
