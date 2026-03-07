import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';
import { usePathname } from 'next/navigation';

// Next router mock
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

// Theme mock
jest.mock('next-themes', () => ({
    useTheme: jest.fn(() => ({
        theme: 'dark',
        setTheme: jest.fn(),
    })),
}));

// Framer motion mock
jest.mock('framer-motion', () => ({
    __esModule: true,
    motion: {
        nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useScroll: jest.fn(() => ({ scrollY: { get: () => 0, onChange: jest.fn() } })),
    useTransform: jest.fn(() => ({ get: () => 0, onChange: jest.fn() })),
    useMotionValueEvent: jest.fn(),
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Lucide React mock
jest.mock('lucide-react', () => ({
    Menu: (props: any) => <svg {...props} data-testid="lucide-menu" />,
    X: (props: any) => <svg {...props} data-testid="lucide-x" />,
}));

describe('Navbar Component', () => {
    beforeEach(() => {
        (usePathname as jest.Mock).mockReturnValue('/');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with desktop links', () => {
        // Next.js Navigation mockları
        render(<Navbar />);

        expect(screen.getByText('FK.')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
        expect(screen.getByText('Projeler')).toBeInTheDocument();
        expect(screen.getByText('İletişim')).toBeInTheDocument();
    });

    it('toggles mobile menu when hamburger is clicked', () => {
        render(<Navbar />);

        // Desktop'ta mobileMenu kapalı (Lucide-react Menu iconuna aria-label eklemiştik varsayalım,
        // Veya className bazlı sorgu yapabiliriz class .hamburgerBtn)
        const hamburgerBtn = document.querySelector('.hamburgerBtn');
        expect(hamburgerBtn).toBeInTheDocument();

        // Tıklandığında mobile menu açılır mı kontrol et
        if (hamburgerBtn) {
            fireEvent.click(hamburgerBtn);
            const closeIcon = document.querySelector('.lucide-x'); // X iconu render olmalı
            expect(closeIcon).toBeInTheDocument();
        }
    });

    it('highlights the active link based on pathname', () => {
        (usePathname as jest.Mock).mockReturnValue('/blog');
        render(<Navbar />);

        const blogLink = screen.getByText('Blog');
        expect(blogLink.closest('a')).toHaveClass('active');
    });
});
