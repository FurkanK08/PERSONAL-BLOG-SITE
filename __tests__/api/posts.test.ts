/// <reference types="jest" />
import { GET } from '@/app/api/posts/route';
import { NextRequest } from 'next/server';

// Jest ile veritabanı bağlantımızı ve Mongoose objelerimizi Mock'luyoruz
jest.mock('@/lib/mongoose', () => jest.fn());
jest.mock('@/models/Post', () => ({
    Post: {
        find: jest.fn().mockImplementation(() => ({
            sort: jest.fn().mockResolvedValue([
                { _id: '1', title: 'Test Post 1', slug: 'test-post-1', date: new Date() },
                { _id: '2', title: 'Test Post 2', slug: 'test-post-2', date: new Date() }
            ])
        }))
    }
}));

describe('Posts API GET Endpoint', () => {
    it('should return 200 and a list of posts', async () => {
        // NextRequest mock
        const req = new NextRequest('http://localhost:3000/api/posts', {
            method: 'GET'
        });

        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(2);
        expect(data[0].title).toBe('Test Post 1');
    });
});
