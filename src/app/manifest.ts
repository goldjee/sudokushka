import type { MetadataRoute } from 'next';
import { BASE_PATH } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Судокушка',
        short_name: 'Судокушка',
        start_url: `${BASE_PATH}/`,
        scope: `${BASE_PATH}/`,
        display: 'standalone',
        background_color: '#f6f1e3',
        theme_color: '#f6f1e3',
        icons: [
            {
                src: `${BASE_PATH}/icon.png`,
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
