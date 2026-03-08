import express from 'express'

const router = express.Router()

// 收入流
router.get('/revenue', (_req, res) => {
    res.json({
        revenueStreams: [
            {
                id: 1,
                name: '主职工作',
                type: 'salary',
                monthlyAmount: 25000,
                currency: 'CNY',
                stability: 'high',
                growthPotential: 'medium',
                description: '软件工程师职位薪资',
                company: 'ABC科技公司',
                lastUpdated: '2024-01-01'
            },
            {
                id: 2,
                name: '自媒体收入',
                type: 'content',
                monthlyAmount: 3500,
                currency: 'CNY',
                stability: 'medium',
                growthPotential: 'high',
                description: '技术博客和公众号收入',
                platforms: ['微信公众号', '知乎', 'B站'],
                lastUpdated: '2024-01-15'
            },
            {
                id: 3,
                name: '投资理财',
                type: 'investment',
                monthlyAmount: 1800,
                currency: 'CNY',
                stability: 'low',
                growthPotential: 'high',
                description: '股票和基金投资收益',
                investmentTypes: ['股票', '指数基金', '债券'],
                lastUpdated: '2024-01-20'
            },
            {
                id: 4,
                name: '外包项目',
                type: 'freelance',
                monthlyAmount: 8000,
                currency: 'CNY',
                stability: 'medium',
                growthPotential: 'medium',
                description: '接私活和外包项目收入',
                skills: ['React', 'Node.js', 'UI设计'],
                lastUpdated: '2024-01-10'
            }
        ],
        stats: {
            totalMonthly: 38300,
            sources: 4,
            primarySource: 'salary',
            diversificationScore: 75
        }
    })
})

// 商务合作
router.get('/partnerships', (_req, res) => {
    res.json({
        partnerships: [
            {
                id: 1,
                company: 'XYZ科技公司',
                type: '技术合作',
                status: 'active',
                startDate: '2023-06-01',
                endDate: '2024-06-01',
                value: 50000,
                currency: 'CNY',
                description: '前端技术咨询和培训合作',
                contactPerson: '张经理',
                lastInteraction: '2024-01-15'
            },
            {
                id: 2,
                company: '教育平台A',
                type: '内容创作',
                status: 'negotiation',
                startDate: null,
                endDate: null,
                value: 20000,
                currency: 'CNY',
                description: '在线课程制作合作',
                contactPerson: '李编辑',
                lastInteraction: '2024-01-18'
            }
        ],
        stats: {
            total: 2,
            active: 1,
            negotiation: 1,
            totalValue: 70000
        }
    })
})

// 职业发展
router.get('/career', (_req, res) => {
    res.json({
        opportunities: [
            {
                id: 1,
                position: '高级前端工程师',
                company: '互联网公司B',
                salary: 35000,
                currency: 'CNY',
                status: 'interviewed',
                applicationDate: '2024-01-10',
                interviewDate: '2024-01-16',
                recruiter: '王猎头',
                pros: ['薪资高', '技术栈匹配'],
                cons: ['通勤时间长', '加班多'],
                notes: '技术面表现良好，等待HR面'
            },
            {
                id: 2,
                position: '技术负责人',
                company: '创业公司C',
                salary: 28000,
                currency: 'CNY',
                status: 'offer',
                applicationDate: '2024-01-05',
                interviewDate: '2024-01-12',
                recruiter: '直接申请',
                pros: ['职位高', '股权期权'],
                cons: ['风险较高', '薪资略低'],
                notes: '已收到offer，需要在一周内回复'
            }
        ],
        interviews: [
            {
                id: 1,
                date: '2024-01-20',
                company: '科技公司D',
                position: '全栈工程师',
                status: 'scheduled',
                preparationNotes: '需要复习算法和系统设计'
            }
        ],
        stats: {
            totalOpportunities: 2,
            activeApplications: 1,
            interviewsScheduled: 1,
            offersReceived: 1
        }
    })
})

// 变现分析
router.get('/monetization', (_req, res) => {
    res.json({
        projects: [
            {
                id: 1,
                name: '技术博客',
                type: 'content',
                investment: 500,
                revenue: 3500,
                roi: 600,
                timeInvested: 120,
                hourlyRate: 29.17,
                status: 'profitable',
                startDate: '2023-01-01',
                platforms: ['微信公众号', '知乎'],
                conversionRate: 2.5
            },
            {
                id: 2,
                name: '在线课程',
                type: 'education',
                investment: 2000,
                revenue: 8000,
                roi: 300,
                timeInvested: 80,
                hourlyRate: 100,
                status: 'profitable',
                startDate: '2023-06-01',
                platforms: ['网易云课堂', '腾讯课堂'],
                conversionRate: 5.2
            }
        ],
        metrics: {
            totalInvestment: 2500,
            totalRevenue: 11500,
            totalROI: 360,
            averageHourlyRate: 64.58,
            averageConversionRate: 3.85
        }
    })
})

export default router