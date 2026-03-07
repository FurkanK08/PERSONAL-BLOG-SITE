export const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 dakika
    maxRequests: 5, // Her IP için 15 dakikada maksimum 5 başarısız deneme
    store: new Map<string, { count: number; resetTime: number }>(),

    check: function (ip: string) {
        const now = Date.now();
        const record = this.store.get(ip);

        // Kayıt yoksa yeni kayıt oluştur (count: 0, resetTime: now + windowMs)
        if (!record) {
            this.store.set(ip, { count: 1, resetTime: now + this.windowMs });
            return { success: true, remaining: this.maxRequests - 1 };
        }

        // Süre dolmuşsa sıfırla
        if (now > record.resetTime) {
            this.store.set(ip, { count: 1, resetTime: now + this.windowMs });
            return { success: true, remaining: this.maxRequests - 1 };
        }

        // Süre dolmamış ve limit aşılmışsa
        if (record.count >= this.maxRequests) {
            return { success: false, remaining: 0, resetTime: record.resetTime };
        }

        // Limit aşılmamışsa sayacı artır
        record.count += 1;
        return { success: true, remaining: this.maxRequests - record.count };
    },

    // Sadece başarısız girişlerde çalışması için özel fonksiyon
    fail: function (ip: string) {
        return this.check(ip);
    },

    // Başarılı girişte sıfırlama yapılabilir
    reset: function (ip: string) {
        this.store.delete(ip);
    }
};
