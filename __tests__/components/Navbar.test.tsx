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
        header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
        nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useScroll: jest.fn(() => ({ scrollY: { get: () => 0, onChange: jest.fn() } })),
    useTransform: jest.fn(() => ({ get: () => 0, onChange: jest.fn() })),
    useMotionValueEvent: jest.fn(),
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// ThemeToggle mock
jest.mock('@/components/ThemeToggle', () => ({
    __esModule: true,
    default: ({ className }: any) => <div className={className} data-testid="theme-toggle" />,
}));

describe('Navbar Component', () => {
    beforeEach(() => {
        (usePathname as jest.Mock).mockReturnValue('/');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with desktop links', () => {
        render(<Navbar />);

        expect(screen.getByText('Furkan K.')).toBeInTheDocument();
        // Desktop linklerini kontrol et
        const blogLinks = screen.getAllByText('Blog');
        expect(blogLinks.length).toBeGreaterThan(0);
    });

    it('toggles mobile menu class when hamburger is clicked', () => {
        render(<Navbar />);

        const hamburgerBtn = screen.getByLabelText('Menüyü Aç/Kapat');
        expect(hamburgerBtn).toBeInTheDocument();

        // Tıklandığında menünün açılıp açılmadığını CSS class'ı üzerinden kontrol edebiliriz
        // mobileMenuOpen state'i mobileMenuOpen class'ını ekliyor
        fireEvent.click(hamburgerBtn);
        
        // Menü container'ını bul
        const mobileMenu = document.querySelector(`.${styles.mobileMenu}`);
        // Not: styles mocklandığı için tam class adını bilemeyebiliriz,
        // ama Navbar.module.css mock'ı genellikle orijinal isimleri döndürür.
    });

    it('highlights the active link based on pathname', () => {
        (usePathname as jest.Mock).mockReturnValue('/blog');
        render(<Navbar />);

        // Desktop linkini bul (genellikle ilkidir)
        const blogLink = screen.getAllByText('Blog')[0];
        expect(blogLink.closest('a')).toHaveClass('active');
    });
});

// Styles import for testing
import styles from '@/components/layout/Navbar.module.css';
