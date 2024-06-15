import { prisma } from './prisma.ts'

const main = async () => {
  console.log('Hello, world!')
  const r = await prisma.colors.findMany({
    select: {
      colorid: true,
      colorname: true,
    },
    where: {
      colorid: 1358,
    },
    take: 10,
    skip: 3,
  })
  console.log(JSON.stringify(r, null, 2))
}
await main()
