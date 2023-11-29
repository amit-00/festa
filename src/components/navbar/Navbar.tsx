import Link from "next/link"
import MaxWidthWrapper from "../MaxWidthWrapper"
import { PartyPopper } from "lucide-react"
import { Button, buttonVariants } from "../ui/button"

const links = [
  {
    name: 'About',
    href: '/about'
  },
  {
    name: 'FAQ',
    href: '/faq'
  },
]

const Navbar = () => {
  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              {/* TODO: Mobile Nav */}
              <div className="ml-4 flex lg:ml-0">
                <Link href='/' className="text-3xl font-bold tracking-tight flex items-center text-gray-900">
                  <PartyPopper className="h-12 w-12 mr-4 text-rose-600"/>
                  Festa
                </Link>
              </div>

              <div className="flex items-center">
                {links.map((link, ind) => (
                  <Button key={ind} variant='ghost' className="mr-4">
                    <Link className="" href={link.href}>{link.name}</Link>
                  </Button>
                ))}
                <Link className={buttonVariants()} href='/create'>Create Invitation &rarr;</Link>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  )
}

export default Navbar