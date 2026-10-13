import type { Metadata, Viewport } from 'next';
import { Neucha } from 'next/font/google';
import { BASE_PATH } from '@/lib/site';
import './globals.css';

const neucha = Neucha({ weight: '400', subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
    title: 'Судокушка',
    description: 'Классический судоку в бумажном стиле',
    appleWebApp: {
        capable: true,
        title: 'Судокушка',
        statusBarStyle: 'default',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#f6f1e3',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='ru' data-theme='light' suppressHydrationWarning>
            <head>
                <script src={`${BASE_PATH}/theme.js`} />
            </head>
            <body className={neucha.className}>{children}</body>
        </html>
    );
}
