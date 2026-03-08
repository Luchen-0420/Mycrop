import express from 'express'

const router = express.Router()

// 造梦出行单
router.get('/itineraries', (_req, res) => {
    res.json({
        itineraries: [
            {
                id: 1,
                destination: '日本东京',
                startDate: '2024-04-01',
                endDate: '2024-04-07',
                status: 'planning',
                budget: 15000,
                currency: 'CNY',
                travelers: 2,
                type: 'leisure',
                flights: [
                    {
                        airline: 'ANA',
                        flightNumber: 'NH920',
                        departure: '2024-04-01 08:30',
                        arrival: '2024-04-01 12:30',
                        from: '上海浦东',
                        to: '东京成田'
                    }
                ],
                hotels: [
                    {
                        name: '东京湾希尔顿酒店',
                        checkIn: '2024-04-01',
                        checkOut: '2024-04-05',
                        price: 1200,
                        currency: 'CNY',
                        rating: 4.5
                    }
                ],
                dailySchedules: [
                    {
                        day: 1,
                        date: '2024-04-01',
                        activities: [
                            { time: '14:00', activity: '入住酒店', location: '东京湾希尔顿' },
                            { time: '16:00', activity: '银座购物', location: '银座' },
                            { time: '19:00', activity: '寿司晚餐', location: '筑地市场' }
                        ]
                    }
                ]
            },
            {
                id: 2,
                destination: '北京',
                startDate: '2024-03-15',
                endDate: '2024-03-17',
                status: 'completed',
                budget: 3000,
                currency: 'CNY',
                travelers: 1,
                type: 'business',
                flights: [],
                hotels: [
                    {
                        name: '北京国贸大酒店',
                        checkIn: '2024-03-15',
                        checkOut: '2024-03-17',
                        price: 800,
                        currency: 'CNY',
                        rating: 4.8
                    }
                ],
                dailySchedules: [
                    {
                        day: 1,
                        date: '2024-03-15',
                        activities: [
                            { time: '09:00', activity: '客户会议', location: '国贸中心' },
                            { time: '14:00', activity: '技术交流', location: '中关村' }
                        ]
                    }
                ]
            }
        ],
        stats: {
            total: 2,
            planning: 1,
            completed: 1,
            totalBudget: 18000
        }
    })
})

// 标准打包区
router.get('/packing-lists', (_req, res) => {
    res.json({
        templates: [
            {
                id: 1,
                name: '夏日海岛度假',
                category: 'leisure',
                climate: 'tropical',
                duration: '7天',
                items: [
                    { category: '衣物', item: '泳衣', quantity: 2, essential: true },
                    { category: '衣物', item: '防晒霜SPF50+', quantity: 1, essential: true },
                    { category: '衣物', item: '太阳帽', quantity: 1, essential: true },
                    { category: '衣物', item: '凉鞋', quantity: 1, essential: true },
                    { category: '电子设备', item: '防水手机套', quantity: 1, essential: false },
                    { category: '电子设备', item: '充电宝', quantity: 1, essential: true },
                    { category: '文件', item: '护照', quantity: 1, essential: true },
                    { category: '文件', item: '机票', quantity: 1, essential: true }
                ],
                lastUsed: '2023-08-15',
                usageCount: 3
            },
            {
                id: 2,
                name: '商务出差标准',
                category: 'business',
                climate: 'temperate',
                duration: '3天',
                items: [
                    { category: '衣物', item: '西装', quantity: 1, essential: true },
                    { category: '衣物', item: '商务衬衫', quantity: 3, essential: true },
                    { category: '衣物', item: '领带', quantity: 2, essential: true },
                    { category: '电子设备', item: '笔记本电脑', quantity: 1, essential: true },
                    { category: '电子设备', item: '充电器', quantity: 1, essential: true },
                    { category: '文件', item: '名片', quantity: 50, essential: true },
                    { category: '文件', item: '合同文件', quantity: 1, essential: true }
                ],
                lastUsed: '2024-01-20',
                usageCount: 8
            },
            {
                id: 3,
                name: '冬季滑雪之旅',
                category: 'leisure',
                climate: 'cold',
                duration: '5天',
                items: [
                    { category: '衣物', item: '滑雪服', quantity: 1, essential: true },
                    { category: '衣物', item: '保暖内衣', quantity: 2, essential: true },
                    { category: '装备', item: '滑雪镜', quantity: 1, essential: true },
                    { category: '装备', item: '手套', quantity: 1, essential: true },
                    { category: '防护用品', item: '防晒霜', quantity: 1, essential: true },
                    { category: '药品', item: '创可贴', quantity: 10, essential: false }
                ],
                lastUsed: '2023-12-20',
                usageCount: 2
            }
        ],
        stats: {
            total: 3,
            leisure: 2,
            business: 1,
            mostUsed: '商务出差标准'
        }
    })
})

// 差旅日记
router.get('/logs', (_req, res) => {
    res.json({
        logs: [
            {
                id: 1,
                destination: '北京',
                startDate: '2024-01-20',
                endDate: '2024-01-22',
                type: 'business',
                travelers: 1,
                diary: [
                    {
                        date: '2024-01-20',
                        mood: 'productive',
                        weather: 'sunny',
                        highlights: ['客户会议很成功', '品尝了北京烤鸭'],
                        photos: ['/api/placeholder/300/200'],
                        expenses: 1200
                    },
                    {
                        date: '2024-01-21',
                        mood: 'tired',
                        weather: 'cloudy',
                        highlights: ['参观了故宫', '地铁很拥挤'],
                        photos: ['/api/placeholder/300/200'],
                        expenses: 800
                    }
                ],
                totalExpenses: 2000,
                rating: 4,
                wouldRecommend: true
            }
        ],
        stats: {
            totalTrips: 1,
            totalCities: 1,
            totalExpenses: 2000,
            averageRating: 4
        }
    })
})

// 差旅费用报销
router.get('/expenses', (_req, res) => {
    res.json({
        expenses: [
            {
                id: 1,
                tripId: 1,
                destination: '北京',
                date: '2024-01-20',
                category: '交通',
                item: '高铁票',
                amount: 553,
                currency: 'CNY',
                status: 'submitted',
                receipt: '/api/receipts/1',
                description: '上海-北京往返高铁票',
                reimbursable: true
            },
            {
                id: 2,
                tripId: 1,
                destination: '北京',
                date: '2024-01-20',
                category: '住宿',
                item: '酒店',
                amount: 800,
                currency: 'CNY',
                status: 'approved',
                receipt: '/api/receipts/2',
                description: '北京国贸大酒店2晚',
                reimbursable: true
            },
            {
                id: 3,
                tripId: 1,
                destination: '北京',
                date: '2024-01-21',
                category: '餐饮',
                item: '商务午餐',
                amount: 320,
                currency: 'CNY',
                status: 'pending',
                receipt: '/api/receipts/3',
                description: '客户商务午餐',
                reimbursable: true
            }
        ],
        summary: {
            total: 1673,
            submitted: 553,
            approved: 800,
            pending: 320,
            rejected: 0
        }
    })
})

export default router