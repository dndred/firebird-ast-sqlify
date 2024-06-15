import { prisma } from './prisma.ts'

const main = async () => {
  console.log('Hello, world!')
  const r = await prisma.colors.findFirst({
    select: {
      colorid: true,
      colorname: true,
    },
  })
  console.log(JSON.stringify(r, null, 2))
}
await main()
