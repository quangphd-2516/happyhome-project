// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Existing user IDs
    const user1Id = '09d96443-fd24-4f31-b867-d4545481ecc4'; // Nguyễn Trọng Quang
    const user2Id = 'd881995c-132c-4a6e-8381-a18253caa4d8'; // Lê Dũng Tiến

    // 1. CREATE ADMIN USER
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123456', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@dwello.com' },
        update: {},
        create: {
            email: 'admin@dwello.com',
            password: adminPassword,
            fullName: 'Admin Dwello',
            phone: '+84123456789',
            avatar: 'https://i.pravatar.cc/150?img=50',
            role: 'ADMIN',
            isVerified: true,
            isBlocked: false,
            kycStatus: 'APPROVED',
        },
    });
    console.log('✅ Admin created:', admin.email);

    // 2. CREATE WALLETS for all users
    console.log('💰 Creating wallets...');
    await prisma.wallet.createMany({
        data: [
            { userId: user1Id, balance: 500000 },
            { userId: user2Id, balance: 300000 },
            { userId: admin.id, balance: 1000000 },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Wallets created');

    // 3. CREATE PROPERTIES
    console.log('🏠 Creating properties...');
    const properties = await Promise.all([
        prisma.property.create({
            data: {
                ownerId: admin.id,
                title: 'Luxury Villa in Beverly Hills',
                description: 'Stunning modern villa with panoramic views, infinity pool, and smart home technology. Features floor-to-ceiling windows, chef\'s kitchen, home theater, and wine cellar.',
                type: 'VILLA',
                status: 'PUBLISHED',
                address: '123 Luxury Avenue, Beverly Hills, California 90210',
                city: 'Beverly Hills',
                district: 'West Hollywood',
                ward: 'Beverly Hills Central',
                latitude: 34.0736,
                longitude: -118.4004,
                price: 2000000,
                area: 450,
                bedrooms: 4,
                bathrooms: 3,
                floors: 2,
                direction: 'South',
                hasLegalDoc: true,
                isFurnished: true,
                images: [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
                ],
                thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                isPremium: true,
                views: 2450,
                publishedAt: new Date(),
            },
        }),
        prisma.property.create({
            data: {
                ownerId: admin.id,
                title: 'Modern Penthouse - San Francisco',
                description: 'Luxurious penthouse in the heart of San Francisco with stunning city views. Features modern design, high-end appliances, and private rooftop terrace.',
                type: 'APARTMENT',
                status: 'PUBLISHED',
                address: '456 Market Street, San Francisco, CA 94102',
                city: 'San Francisco',
                district: 'Downtown',
                ward: 'Financial District',
                latitude: 37.7749,
                longitude: -122.4194,
                price: 1500000,
                area: 180,
                bedrooms: 2,
                bathrooms: 2,
                floors: 1,
                direction: 'East',
                hasLegalDoc: true,
                isFurnished: true,
                images: [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
                    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200',
                ],
                thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                isPremium: true,
                views: 1890,
                publishedAt: new Date(),
            },
        }),
        prisma.property.create({
            data: {
                ownerId: user1Id,
                title: 'Beachfront Estate - Malibu',
                description: 'Spectacular beachfront property with direct ocean access. Features private beach, infinity pool, guest house, and breathtaking sunset views.',
                type: 'VILLA',
                status: 'PUBLISHED',
                address: '789 Pacific Coast Highway, Malibu, CA 90265',
                city: 'Malibu',
                district: 'Malibu Beach',
                ward: 'Carbon Beach',
                latitude: 34.0259,
                longitude: -118.7798,
                price: 3000000,
                area: 550,
                bedrooms: 5,
                bathrooms: 4,
                floors: 2,
                direction: 'West',
                hasLegalDoc: true,
                isFurnished: false,
                images: [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
                ],
                thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
                isPremium: false,
                views: 3210,
                publishedAt: new Date(),
            },
        }),
        prisma.property.create({
            data: {
                ownerId: user2Id,
                title: 'Downtown Luxury Condo',
                description: 'Contemporary condo in prime downtown location. Walking distance to restaurants, shopping, and entertainment.',
                type: 'APARTMENT',
                status: 'PUBLISHED',
                address: '321 Downtown Plaza, Los Angeles, CA 90012',
                city: 'Los Angeles',
                district: 'Downtown LA',
                ward: 'Arts District',
                latitude: 34.0522,
                longitude: -118.2437,
                price: 850000,
                area: 120,
                bedrooms: 2,
                bathrooms: 2,
                floors: 1,
                direction: 'North',
                hasLegalDoc: true,
                isFurnished: true,
                images: [
                    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
                    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
                ],
                thumbnail: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
                isPremium: false,
                views: 1456,
                publishedAt: new Date(),
            },
        }),
        prisma.property.create({
            data: {
                ownerId: admin.id,
                title: 'Historic Victorian House',
                description: 'Beautifully restored Victorian home with original features. Large garden, modern updates while maintaining historic charm.',
                type: 'HOUSE',
                status: 'PUBLISHED',
                address: '555 Heritage Lane, San Diego, CA 92101',
                city: 'San Diego',
                district: 'Gaslamp Quarter',
                ward: 'Downtown',
                latitude: 32.7157,
                longitude: -117.1611,
                price: 1200000,
                area: 280,
                bedrooms: 4,
                bathrooms: 3,
                floors: 2,
                direction: 'South',
                hasLegalDoc: true,
                isFurnished: false,
                images: [
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
                ],
                thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
                isPremium: false,
                views: 987,
                publishedAt: new Date(),
            },
        }),
    ]);
    console.log(`✅ Created ${properties.length} properties`);

    // 4. CREATE AUCTIONS
    console.log('⚖️ Creating auctions...');

    // Calculate times
    const now = new Date();
    const ongoingStart = new Date(now.getTime() - 2 * 60 * 60 * 1000); // Started 2 hours ago
    const ongoingEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Ends in 2 hours
    const upcomingStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Starts in 24 hours
    const upcomingEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000); // Ends in 48 hours
    const completedStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Started 7 days ago
    const completedEnd = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // Ended 5 days ago

    const auctions = await Promise.all([
        // ONGOING Auction
        prisma.auction.create({
            data: {
                propertyId: properties[0].id,
                createdBy: admin.id,
                title: 'Luxury Villa Auction - Beverly Hills',
                description: 'Live auction for stunning Beverly Hills villa. Don\'t miss this opportunity!',
                startPrice: 2000000,
                bidStep: 50000,
                depositAmount: 200000,
                startTime: ongoingStart,
                endTime: ongoingEnd,
                status: 'ONGOING',
                currentPrice: 2500000,
            },
        }),
        // UPCOMING Auction
        prisma.auction.create({
            data: {
                propertyId: properties[1].id,
                createdBy: admin.id,
                title: 'Modern Penthouse - San Francisco',
                description: 'Upcoming auction for luxury penthouse in downtown SF.',
                startPrice: 1500000,
                bidStep: 25000,
                depositAmount: 150000,
                startTime: upcomingStart,
                endTime: upcomingEnd,
                status: 'UPCOMING',
                currentPrice: 1500000,
            },
        }),
        // COMPLETED Auction
        prisma.auction.create({
            data: {
                propertyId: properties[2].id,
                createdBy: admin.id,
                title: 'Beachfront Estate - Malibu',
                description: 'Completed auction for beachfront property.',
                startPrice: 3000000,
                bidStep: 100000,
                depositAmount: 300000,
                startTime: completedStart,
                endTime: completedEnd,
                status: 'COMPLETED',
                currentPrice: 4200000,
                winnerId: user1Id,
            },
        }),
        // Another UPCOMING
        prisma.auction.create({
            data: {
                propertyId: properties[3].id,
                createdBy: admin.id,
                title: 'Downtown Luxury Condo',
                description: 'Prime downtown location condo auction.',
                startPrice: 850000,
                bidStep: 20000,
                depositAmount: 85000,
                startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000),
                endTime: new Date(now.getTime() + 72 * 60 * 60 * 1000),
                status: 'UPCOMING',
                currentPrice: 850000,
            },
        }),
        // Another COMPLETED
        prisma.auction.create({
            data: {
                propertyId: properties[4].id,
                createdBy: admin.id,
                title: 'Historic Victorian House',
                description: 'Beautifully restored Victorian home auction.',
                startPrice: 1200000,
                bidStep: 30000,
                depositAmount: 120000,
                startTime: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
                endTime: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
                status: 'COMPLETED',
                currentPrice: 1350000,
                winnerId: user2Id,
            },
        }),
    ]);
    console.log(`✅ Created ${auctions.length} auctions`);

    // 5. CREATE AUCTION PARTICIPANTS
    console.log('👥 Creating auction participants...');
    await prisma.auctionParticipant.createMany({
        data: [
            // ONGOING auction participants
            { auctionId: auctions[0].id, userId: user1Id, depositPaid: true, depositTxId: 'tx_001' },
            { auctionId: auctions[0].id, userId: user2Id, depositPaid: true, depositTxId: 'tx_002' },
            // UPCOMING auction participants
            { auctionId: auctions[1].id, userId: user1Id, depositPaid: true, depositTxId: 'tx_003' },
            { auctionId: auctions[1].id, userId: user2Id, depositPaid: false },
            // COMPLETED auction participants
            { auctionId: auctions[2].id, userId: user1Id, depositPaid: true, depositTxId: 'tx_004', isRefunded: false },
            { auctionId: auctions[2].id, userId: user2Id, depositPaid: true, depositTxId: 'tx_005', isRefunded: true },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Auction participants created');

    // 6. CREATE BIDS
    console.log('💰 Creating bids...');
    await prisma.bid.createMany({
        data: [
            // ONGOING auction bids
            {
                auctionId: auctions[0].id,
                userId: user1Id,
                amount: 2500000,
                createdAt: new Date(now.getTime() - 5 * 60 * 1000)
            },
            {
                auctionId: auctions[0].id,
                userId: user2Id,
                amount: 2450000,
                createdAt: new Date(now.getTime() - 15 * 60 * 1000)
            },
            {
                auctionId: auctions[0].id,
                userId: user1Id,
                amount: 2400000,
                createdAt: new Date(now.getTime() - 30 * 60 * 1000)
            },
            // COMPLETED auction bids
            {
                auctionId: auctions[2].id,
                userId: user1Id,
                amount: 4200000,
                createdAt: completedEnd
            },
            {
                auctionId: auctions[2].id,
                userId: user2Id,
                amount: 4100000,
                createdAt: new Date(completedEnd.getTime() - 10 * 60 * 1000)
            },
            {
                auctionId: auctions[2].id,
                userId: user1Id,
                amount: 4000000,
                createdAt: new Date(completedEnd.getTime() - 30 * 60 * 1000)
            },
            {
                auctionId: auctions[2].id,
                userId: user2Id,
                amount: 3500000,
                createdAt: new Date(completedEnd.getTime() - 60 * 60 * 1000)
            },
            {
                auctionId: auctions[2].id,
                userId: user1Id,
                amount: 3200000,
                createdAt: new Date(completedEnd.getTime() - 90 * 60 * 1000)
            },
        ],
    });
    console.log('✅ Bids created');

    // 7. CREATE FAVORITES
    console.log('❤️ Creating favorites...');
    await prisma.favorite.createMany({
        data: [
            { userId: user1Id, propertyId: properties[1].id },
            { userId: user1Id, propertyId: properties[3].id },
            { userId: user2Id, propertyId: properties[0].id },
            { userId: user2Id, propertyId: properties[2].id },
            { userId: user2Id, propertyId: properties[4].id },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Favorites created');

    // 8. CREATE REVIEWS
    console.log('⭐ Creating reviews...');
    await prisma.review.createMany({
        data: [
            {
                propertyId: properties[0].id,
                userId: user1Id,
                rating: 5,
                comment: 'Amazing property! The location is perfect and the amenities are top-notch.',
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            },
            {
                propertyId: properties[0].id,
                userId: user2Id,
                rating: 4,
                comment: 'Great property with excellent facilities. Highly recommended!',
                createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            },
            {
                propertyId: properties[2].id,
                userId: user2Id,
                rating: 5,
                comment: 'Stunning beachfront location. Worth every penny!',
                createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
            },
            {
                propertyId: properties[3].id,
                userId: user1Id,
                rating: 4,
                comment: 'Perfect downtown location with great views.',
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Reviews created');

    // 9. CREATE NOTIFICATIONS
    console.log('🔔 Creating notifications...');
    await prisma.notification.createMany({
        data: [
            {
                userId: user1Id,
                title: 'New Bid on Your Auction',
                message: 'Someone placed a bid of $2,450,000 on Luxury Villa Auction',
                type: 'BID',
                link: `/auctions/${auctions[0].id}`,
                isRead: false,
                createdAt: new Date(now.getTime() - 15 * 60 * 1000),
            },
            {
                userId: user1Id,
                title: 'Auction Starting Soon',
                message: 'Modern Penthouse auction starts in 24 hours',
                type: 'AUCTION',
                link: `/auctions/${auctions[1].id}`,
                isRead: false,
                createdAt: new Date(now.getTime() - 60 * 60 * 1000),
            },
            {
                userId: user1Id,
                title: 'Congratulations! You Won',
                message: 'You won the Beachfront Estate auction at $4,200,000',
                type: 'AUCTION',
                link: `/auctions/${auctions[2].id}`,
                isRead: true,
                createdAt: completedEnd,
            },
            {
                userId: user2Id,
                title: 'Outbid Alert',
                message: 'You have been outbid on Luxury Villa Auction',
                type: 'BID',
                link: `/auctions/${auctions[0].id}`,
                isRead: false,
                createdAt: new Date(now.getTime() - 5 * 60 * 1000),
            },
            {
                userId: user2Id,
                title: 'Deposit Refund',
                message: 'Your deposit of $300,000 has been refunded',
                type: 'PAYMENT',
                link: '/wallet',
                isRead: true,
                createdAt: new Date(completedEnd.getTime() + 60 * 60 * 1000),
            },
        ],
    });
    console.log('✅ Notifications created');

    // 10. CREATE TRANSACTIONS
    console.log('💸 Creating transactions...');
    const wallets = await prisma.wallet.findMany();

    await prisma.transaction.createMany({
        data: [
            {
                walletId: wallets[0].id,
                type: 'AUCTION_DEPOSIT',
                amount: 200000,
                status: 'COMPLETED',
                paymentMethod: 'VNPAY',
                paymentRef: 'VNPAY_001',
                description: 'Deposit for Luxury Villa Auction',
                createdAt: ongoingStart,
            },
            {
                walletId: wallets[1].id,
                type: 'AUCTION_DEPOSIT',
                amount: 200000,
                status: 'COMPLETED',
                paymentMethod: 'MOMO',
                paymentRef: 'MOMO_001',
                description: 'Deposit for Luxury Villa Auction',
                createdAt: ongoingStart,
            },
            {
                walletId: wallets[0].id,
                type: 'PAYMENT',
                amount: 4200000,
                status: 'COMPLETED',
                paymentMethod: 'VNPAY',
                paymentRef: 'VNPAY_002',
                description: 'Payment for Beachfront Estate',
                createdAt: new Date(completedEnd.getTime() + 2 * 60 * 60 * 1000),
            },
            {
                walletId: wallets[1].id,
                type: 'AUCTION_REFUND',
                amount: 300000,
                status: 'COMPLETED',
                description: 'Refund for Beachfront Estate auction',
                createdAt: new Date(completedEnd.getTime() + 60 * 60 * 1000),
            },
            {
                walletId: wallets[0].id,
                type: 'DEPOSIT',
                amount: 100000,
                status: 'COMPLETED',
                paymentMethod: 'VNPAY',
                paymentRef: 'VNPAY_003',
                description: 'Wallet top-up',
                createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            },
        ],
    });
    console.log('✅ Transactions created');

    console.log('🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: 3 (2 existing + 1 admin)`);
    console.log(`- Properties: ${properties.length}`);
    console.log(`- Auctions: ${auctions.length} (1 ONGOING, 2 UPCOMING, 2 COMPLETED)`);
    console.log(`- Bids: 8`);
    console.log(`- Participants: 6`);
    console.log(`- Favorites: 5`);
    console.log(`- Reviews: 4`);
    console.log(`- Notifications: 5`);
    console.log(`- Transactions: 5`);
    console.log('\n🔑 Admin credentials:');
    console.log('Email: admin@dwello.com');
    console.log('Password: admin123456');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });