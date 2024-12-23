import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { FC } from 'react'

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  return <div>
    <Header />
    <FAQ />
    <Footer />
  </div>
}

export default page