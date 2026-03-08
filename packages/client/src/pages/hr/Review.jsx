import { TrendingUp, AlertTriangle } from 'lucide-react'

export default function Review() {
    return (
        <div className="space-y-6">


            {/* Placeholder for future detailed Review Logic */}
            <div className="bg-corporate-800 rounded-xl p-8 border border-corporate-700 text-center">
                <div className="w-16 h-16 bg-corporate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-corporate-700">
                    <AlertTriangle size={32} className="text-corporate-warning" />
                </div>
                <h4 className="text-2xl font-bold mb-2">季度评估进行中</h4>
                <p className="text-corporate-text-secondary max-w-lg mx-auto mb-6">
                    系统目前尚未累积足够的数据来生成可靠的晋升判定报告。
                    请继续使用“技能中心”、“培训学院”和“员工关怀”模块沉淀数据。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-corporate-900 rounded-lg border border-corporate-700 border-t-corporate-primary border-t-2">
                        <div className="text-xs text-corporate-text-secondary mb-1">评估维度 1</div>
                        <div className="font-bold">技能成长斜率</div>
                        <div className="text-xs text-corporate-primary mt-2">待计算</div>
                    </div>
                    <div className="p-4 bg-corporate-900 rounded-lg border border-corporate-700 border-t-corporate-accent border-t-2">
                        <div className="text-xs text-corporate-text-secondary mb-1">评估维度 2</div>
                        <div className="font-bold">培训完成度</div>
                        <div className="text-xs text-corporate-accent mt-2">数据不足收集</div>
                    </div>
                    <div className="p-4 bg-corporate-900 rounded-lg border border-corporate-700 border-t-corporate-success border-t-2">
                        <div className="text-xs text-corporate-text-secondary mb-1">评估维度 3</div>
                        <div className="font-bold">情绪稳定系数</div>
                        <div className="text-xs text-corporate-success mt-2">需至少 30 天记录</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
