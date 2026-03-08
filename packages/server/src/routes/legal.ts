import express from 'express'
import multer from 'multer'
import * as pdfImport from 'pdf-parse'
const pdf = (pdfImport as any).default || pdfImport
import mammoth from 'mammoth'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// AI Contract Analysis
router.post('/contracts/analyze', upload.single('contract'), async (req: express.Request & { file?: Express.Multer.File }, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.')
    }

    let text = ''
    try {
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdf(req.file.buffer)
            text = data.text
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value } = await mammoth.extractRawText({ buffer: req.file.buffer })
            text = value
        } else {
            return res.status(400).send('Unsupported file type.')
        }

        // --- Mock LLM Analysis ---
        // In a real scenario, you would send `text` to an LLM API (e.g., OpenAI).
        // Here, we simulate the response.
        const extractedInfo = {
            title: text.includes('劳动合同') ? '劳动合同' : '租赁协议',
            party: text.match(/签约方：(.*?)\n/)?.[1] || '未能提取',
            startDate: text.match(/开始日期：(.*?)\n/)?.[1] || '',
            endDate: text.match(/结束日期：(.*?)\n/)?.[1] || '',
        }

        const riskAnalysis = [
            '风险点1: 违约金条款高于行业标准20%',
            '风险点2: “最终解释权归甲方所有”为无效霸王条款',
            '建议: 重新协商违约金比例，并删除最终解释权条款'
        ]

        res.json({ extractedInfo, riskAnalysis })

    } catch (error) {
        console.error("Error analyzing contract:", error)
        res.status(500).send('Failed to analyze contract.')
    }
})

// 合同档案
router.get('/contracts', (_req, res) => {
    res.json({
        contracts: [
            {
                id: 1,
                title: '劳动合同',
                type: 'employment',
                party: 'ABC科技公司',
                startDate: '2023-01-01',
                endDate: '2025-12-31',
                status: 'active',
                keyTerms: ['薪资保密', '竞业限制'],
                renewalReminder: '2025-11-01'
            },
            {
                id: 2,
                title: '房屋租赁合同',
                type: 'rental',
                party: '房东张先生',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                status: 'active',
                keyTerms: ['押金2个月', '不得养宠物'],
                renewalReminder: '2024-11-01'
            }
        ],
        stats: {
            total: 2,
            active: 2,
            expiringSoon: 1
        }
    })
})

// 保单管理
router.get('/insurances', (_req, res) => {
    res.json({
        insurances: [
            {
                id: 1,
                type: 'health',
                provider: '平安保险',
                policyNumber: 'PA123456789',
                premium: 3500,
                coverage: '重疾险 + 医疗险',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                renewalDate: '2024-12-01',
                status: 'active'
            },
            {
                id: 2,
                type: 'auto',
                provider: '人保财险',
                policyNumber: 'PICC987654321',
                premium: 2800,
                coverage: '交强险 + 商业险',
                startDate: '2024-03-15',
                endDate: '2025-03-14',
                renewalDate: '2025-02-14',
                status: 'active'
            }
        ],
        stats: {
            total: 2,
            totalPremium: 6300,
            expiringSoon: 1
        }
    })
})

// 维权纠纷
router.get('/disputes', (_req, res) => {
    res.json({
        disputes: [
            {
                id: 1,
                title: '网购商品质量问题',
                type: 'consumer',
                platform: '淘宝',
                amount: 299,
                status: 'resolved',
                startDate: '2024-01-15',
                resolutionDate: '2024-01-20',
                description: '购买的手机壳存在质量问题，已退货退款'
            },
            {
                id: 2,
                title: '物业服务费争议',
                type: 'property',
                platform: '小区物业',
                amount: 500,
                status: 'pending',
                startDate: '2024-02-01',
                resolutionDate: null,
                description: '对物业服务费收费标准存在异议，正在协商中'
            }
        ],
        stats: {
            total: 2,
            resolved: 1,
            pending: 1,
            totalAmount: 799
        }
    })
})

// 到期提醒
router.get('/reminders', (_req, res) => {
    res.json({
        reminders: [
            {
                id: 1,
                type: 'contract',
                title: '房屋租赁合同到期',
                dueDate: '2024-11-01',
                priority: 'high',
                description: '需要与房东协商续租或寻找新房源'
            },
            {
                id: 2,
                type: 'insurance',
                title: '健康保险续保',
                dueDate: '2024-12-01',
                priority: 'medium',
                description: '记得联系保险经纪人续保'
            },
            {
                id: 3,
                type: 'document',
                title: '护照更新',
                dueDate: '2025-06-15',
                priority: 'low',
                description: '护照将于2025年6月到期，需要提前办理新护照'
            }
        ],
        stats: {
            total: 3,
            highPriority: 1,
            overdue: 0
        }
    })
})

export default router