import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl'>
          <h1 className='font-bold text-4xl tracking-tight text-gray-900 sm:text-6xl'>Make hosting a party no work and all <span className='text-rose-600'>play</span>.</h1>
          <p className='mt-6 text-lg max-w-prose text-muted-foreground'>Get everyone together with one simple click.</p>
          <div className="flex flex-col gap-4 mt-6 sm:flex-row">
            <Link href='/invitation' className={buttonVariants()}>Get Started</Link>
            <Button variant='ghost'><Link href='/login'>Sign In &rarr;</Link></Button>
          </div>
        </div>
      </MaxWidthWrapper>
      <section className='border-t border-gray-200 bg-gray-50'>
        <MaxWidthWrapper className='py-20'>
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">

          </div>
        </MaxWidthWrapper>
      </section>
    </>
  )
}
