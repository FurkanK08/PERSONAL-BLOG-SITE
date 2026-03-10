import { rateLimit } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
    beforeEach(() => {
        // Her testten önce store'u temizle
        rateLimit.store.clear();
    });

    it('should allow requests within limit', () => {
        const ip = '192.168.1.1';

        for (let i = 0; i < rateLimit.maxRequests; i++) {
            const result = rateLimit.check(ip);
            expect(result.success).toBe(true);
            expect(result.remaining).toBe(rateLimit.maxRequests - (i + 1));
        }
    });

    it('should block requests exceeding limit', () => {
        const ip = '192.168.1.2';

        for (let i = 0; i < rateLimit.maxRequests; i++) {
            rateLimit.check(ip);
        }

        const blockedResult = rateLimit.check(ip);
        expect(blockedResult.success).toBe(false);
        expect(blockedResult.remaining).toBe(0);
        expect(blockedResult.resetTime).toBeDefined();
    });

    it('should allow fail() to count requests', () => {
        const ip = '127.0.0.1';
        const result = rateLimit.fail(ip);
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(rateLimit.maxRequests - 1);
    });

    it('should reset rate limit for ip', () => {
        const ip = '127.0.0.2';
        rateLimit.fail(ip);
        rateLimit.fail(ip);

        rateLimit.reset(ip);

        const result = rateLimit.check(ip);
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(rateLimit.maxRequests - 1);
    });
});
