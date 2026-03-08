import express from 'express'

const router = express.Router()

// 项目工坊
router.get('/workshops', (_req, res) => {
    res.json({
        projects: [
            {
                id: 1,
                name: '个人博客系统',
                status: 'development',
                stage: 'MVP',
                startDate: '2024-01-01',
                expectedEndDate: '2024-03-01',
                techStack: ['React', 'Node.js', 'MongoDB'],
                progress: 65,
                description: '基于React的个人技术博客，支持Markdown编辑',
                githubUrl: 'https://github.com/username/blog',
                demoUrl: null
            },
            {
                id: 2,
                name: '任务管理小程序',
                status: 'planning',
                stage: 'Idea',
                startDate: null,
                expectedEndDate: '2024-06-01',
                techStack: ['微信小程序', '云开发'],
                progress: 10,
                description: '基于微信云开发的轻量级任务管理工具',
                githubUrl: null,
                demoUrl: null
            },
            {
                id: 3,
                name: '数据可视化工具',
                status: 'completed',
                stage: '上线',
                startDate: '2023-09-01',
                expectedEndDate: '2023-12-01',
                techStack: ['Python', 'Flask', 'D3.js'],
                progress: 100,
                description: '支持多种图表类型的数据可视化平台',
                githubUrl: 'https://github.com/username/dataviz',
                demoUrl: 'https://dataviz.example.com'
            }
        ],
        stats: {
            total: 3,
            inProgress: 1,
            completed: 1,
            planning: 1
        }
    })
})

// 创意池
router.get('/ideas', (_req, res) => {
    res.json({
        ideas: [
            {
                id: 1,
                title: 'AI驱动的读书笔记生成器',
                category: 'AI工具',
                description: '上传书籍照片，自动生成结构化读书笔记和思维导图',
                priority: 'high',
                status: 'pending',
                createdAt: '2024-01-15',
                tags: ['AI', '教育', '工具'],
                estimatedEffort: '3个月',
                marketPotential: 'medium'
            },
            {
                id: 2,
                title: '智能家居能耗监控系统',
                category: 'IoT',
                description: '实时监控家庭电器能耗，提供节能建议',
                priority: 'medium',
                status: 'pending',
                createdAt: '2024-01-20',
                tags: ['IoT', '环保', '硬件'],
                estimatedEffort: '6个月',
                marketPotential: 'high'
            },
            {
                id: 3,
                title: '个人知识管理系统',
                category: '工具',
                description: '基于Obsidian理念的本地化知识管理工具',
                priority: 'low',
                status: 'archived',
                createdAt: '2023-12-01',
                tags: ['知识管理', '工具'],
                estimatedEffort: '2个月',
                marketPotential: 'low'
            }
        ],
        stats: {
            total: 3,
            pending: 2,
            archived: 1
        }
    })
})

// 技术笔记
router.get('/notes', (_req, res) => {
    res.json({
        notes: [
            {
                id: 1,
                title: 'React性能优化最佳实践',
                category: 'Frontend',
                tags: ['React', '性能优化'],
                createdAt: '2024-01-10',
                updatedAt: '2024-01-15',
                summary: '总结了React应用性能优化的各种技巧和方法',
                importance: 'high',
                status: 'published'
            },
            {
                id: 2,
                title: '微服务架构设计原则',
                category: 'Architecture',
                tags: ['微服务', '架构设计'],
                createdAt: '2024-01-05',
                updatedAt: '2024-01-08',
                summary: '微服务架构的核心设计原则和最佳实践',
                importance: 'medium',
                status: 'draft'
            },
            {
                id: 3,
                title: 'TypeScript高级类型体操',
                category: 'TypeScript',
                tags: ['TypeScript', '类型系统'],
                createdAt: '2023-12-20',
                updatedAt: '2023-12-25',
                summary: '深入探讨TypeScript的高级类型特性和应用场景',
                importance: 'high',
                status: 'published'
            }
        ],
        categories: ['Frontend', 'Backend', 'Architecture', 'DevOps', 'TypeScript'],
        stats: {
            total: 3,
            published: 2,
            draft: 1
        }
    })
})

// 作品集
router.get('/portfolio', (_req, res) => {
    res.json({
        portfolio: [
            {
                id: 1,
                title: '企业级后台管理系统',
                type: 'Web应用',
                description: '基于React + TypeScript的企业级后台管理系统',
                imageUrl: '/api/placeholder/400/250',
                projectUrl: 'https://admin.example.com',
                githubUrl: 'https://github.com/username/admin-system',
                technologies: ['React', 'TypeScript', 'Ant Design', 'Node.js'],
                completionDate: '2023-12-01',
                featured: true
            },
            {
                id: 2,
                title: '移动端电商应用',
                type: '移动应用',
                description: '基于React Native的跨平台电商应用',
                imageUrl: '/api/placeholder/400/250',
                projectUrl: 'https://shop.example.com',
                githubUrl: 'https://github.com/username/mobile-shop',
                technologies: ['React Native', 'Redux', 'Firebase'],
                completionDate: '2023-08-15',
                featured: false
            }
        ],
        stats: {
            total: 2,
            featured: 1,
            webApps: 1,
            mobileApps: 1
        }
    })
})

export default router