import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
    icon: ReactNode
    iconBg: string
    title: string
    description: string
}

export default function FeatureCard({ icon, iconBg, title, description }: FeatureCardProps) {
    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#E7ECF0]/20 dark:from-background dark:to-secondary-greenblue/20">
        <CardContent className="p-6">
            <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mb-4`}>{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-[#0E1E40] dark:text-text-secondary">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </CardContent>
        </Card>
    )
}

