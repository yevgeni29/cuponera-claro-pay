import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import PromotionalBanner from '@/components/PromotionalBanner'
import CategoryCarousel from '@/components/CategoryCarousel'
import SectionCarousel from '@/components/SectionCarousel'

const inter = Inter({ subsets: ['latin'] })

import axios from 'axios';

export default function Home ({
  promotionsCategories,
  banner,
  dynamicCategories
}) {

  const groupByCategory = (categorias) => {
    return categorias.reduce((resultado, categoria) => {
      const nombreCategoria = categoria.marca.categoria.nombre;

      const categoriaExistente = resultado.find((item) => item.nombre === nombreCategoria);

      if (!categoriaExistente) {
        resultado.push({
          nombre: nombreCategoria,
          objetos: [categoria],
        });
      } else {
        categoriaExistente.objetos.push(categoria);
      }

      return resultado;
    }, []);
  }

  const groupedCategories = groupByCategory(promotionsCategories);

  return (
    <main
      className={`${inter.className}`}
    >
      <div className='w-full max-w-[500px] h-screen'>
        <div className='flex flex-col gap-6'>
          <Header title='Home' />

          <div className='px-5'>
            <PromotionalBanner banner={banner} />
          </div>

          <div className='pl-5'>
            <CategoryCarousel categories={dynamicCategories} />
          </div>

          <div className='pl-5'>
            <SectionCarousel groupedCategories={groupedCategories} />
          </div>
        </div>
      </div>
    </main>
  )
}


export async function getServerSideProps (context) {

  const { query } = context;
  const state = query.state;

  const urls = [
    `https://api-dev.cuponerapp.com/v2/categorias/8/promociones?estado=${state}`,
    `https://api-dev.cuponerapp.com/v2/estados/${state}/banners`,
    `https://api-dev.cuponerapp.com/v2/estados/${state}/dinamicas`
  ];

  const headers = {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRjNTE0Y2ZhYWFlMzM3MmQ0NzQ2OGU3YWVlNWEzMDc4ZDZhNDZhMjk4ZWFiYzk5MDg3NmMwYzI0NzljY2NlMTY2ZTE1YTIzMzAxMzM0NmQyIn0.eyJhdWQiOiIxIiwianRpIjoiNGM1MTRjZmFhYWUzMzcyZDQ3NDY4ZTdhZWU1YTMwNzhkNmE0NmEyOThlYWJjOTkwODc2YzBjMjQ3OWNjY2UxNjZlMTVhMjMzMDEzMzQ2ZDIiLCJpYXQiOjE3MDEzODY2NDgsIm5iZiI6MTcwMTM4NjY0OCwiZXhwIjoxNzMzMDA5MDQ4LCJzdWIiOiI0Nzg1MzQiLCJzY29wZXMiOltdfQ.VBa9_eOARZsYDqBTIlWKatj31tpP1MF8xvx5nsYOzwSzxSZcbczFalrgCzzuEG31000A3imbjW-NEu8aYQ3xkR3YtuU8L0Q9UL6eSoyuBqT7cl90QhSevHKSQ0et_K7GymwZl8LnV67gtNoInHat_M1PYJR6NG8Re7xAzLnbJMGPoai8_yw62Q9oL7luV7wT5RVPe70RfyQ1yu64QLRbtn-3CT-quwuXQjHDJXP87BFnuBXmx2tq2ppBUp_QiZFtkLIKiy7QsUeIUkuBTJAdXMr0zfKTwiCj-BeGTIhO1FsrXy48k_Ya3C9QxD0E9mlEVYg6yl-kNrrNcLZBGbXRSZ63cGTkgDAhWJEnQKeKc4ZWFWlpKsvJR7ZWK9uyVFqRQa3z4soTEbDFTZfyyM3qa2Iz7gVrBuGluJyiHCQm9IeeWDAecvofVSLMTPk4RBwhRst7iB9lkd8nsleY2LmXi7ZJs9zxldoErvSLUOy0HHw_bTwIxXRbHg0HOIVOSp2xq3oJJjPkOEkn5YckRoT-y2FMZBOMFVBDidC_RmVX8T8l9XWJRPvCESJsuh379mMw--xZ0OBS1PIpfF-oM0EHN3TExORc0B8woq3edNcGdc6IXIXnbzwo4YzLAc4JtkdA1E10OGaSRv3-PSQ2j_hwq2NFK8UmfNvjL7LaJNhsrrE',
  };

  const requests = urls.map(url => axios.get(url, { headers }));

  try {
    const responses = await Promise.all(requests);

    const promotionsCategories = responses[0].data;
    const banner = responses[1].data;
    const dynamicCategories = responses[2].data;

    return {
      props: {
        promotionsCategories,
        banner,
        dynamicCategories
      },
    };
  } catch (error) {
    console.error('Error', error.message);

    return {
      props: {},
    };
  }
}
