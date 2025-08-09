'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from 'lucide-react'

export default function Component() {
  const [isYearly, setIsYearly] = useState(false)

  // Pricing data
  const pricing = {
    pro: {
      monthly: 9,
      yearly: 7 // ~22% discount
    },
    business: {
      monthly: 19,
      yearly: 15 // ~21% discount
    },
    enterprise: {
      monthly: 39,
      yearly: 31 // ~21% discount
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="bg-green-600 hover:bg-green-700 text-white mb-8">
            Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Plans Made for<br />
            Teams of All Sizes
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
            From startups to enterprises, choose the right plan to keep projects on track.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${
                isYearly ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-600 text-white ml-2">
                Save up to 22%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            
          {/* Free Plan */}
          <Card className="bg-gray-900 border-gray-800 text-white relative">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-semibold">Free</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-400">Forever</span>
              </div>
              <CardDescription className="text-gray-400 text-base">
                For individuals or small teams just getting started.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <Button variant="outline" className="w-full h-12 bg-transparent border-gray-600 text-white hover:bg-gray-800">
                Sign Up Now
              </Button>
              <p className="text-center text-gray-400 text-sm">Always free</p>
              
              <div className="space-y-4">
                <p className="font-semibold">Free plan includes:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Up to 3 team members</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">2 active projects</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Basic task management</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Real-time collaboration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">7-day version history (Cloud backup)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan - Featured */}
          <Card className="relative overflow-hidden border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"></div>
            <div className="relative z-10">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-semibold text-white">Pro</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    ${isYearly ? pricing.pro.yearly : pricing.pro.monthly}
                  </span>
                  <span className="text-blue-100">/ user / month</span>
                </div>
                {isYearly && (
                  <div className="text-blue-100 text-sm">
                    <span className="line-through">${pricing.pro.monthly}</span> per month billed annually
                  </div>
                )}
                <CardDescription className="text-blue-100 text-base">
                  For growing teams who need better integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <Button className="w-full h-12 bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  Start Free Trial
                </Button>
                <p className="text-center text-blue-100 text-sm">
                  Billed {isYearly ? 'annually' : 'monthly'}
                </p>
                
                <div className="space-y-4">
                  <p className="font-semibold text-white">All free plan features, plus:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-100">Unlimited team members</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-100">Unlimited projects</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-100">Priority-based workflows</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-100">Advanced search filters</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-100">30-day version history</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Business Plan */}
          <Card className="bg-gray-900 border-gray-800 text-white relative">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-semibold">Business</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">
                  ${isYearly ? pricing.business.yearly : pricing.business.monthly}
                </span>
                <span className="text-gray-400">/ user / month</span>
              </div>
              {isYearly && (
                <div className="text-gray-400 text-sm">
                  <span className="line-through">${pricing.business.monthly}</span> per month billed annually
                </div>
              )}
              <CardDescription className="text-gray-400 text-base">
                For companies that need robust security.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <Button variant="outline" className="w-full h-12 bg-transparent border-gray-600 text-white hover:bg-gray-800">
                Start Free Trial
              </Button>
              <p className="text-center text-gray-400 text-sm">
                Billed {isYearly ? 'annually' : 'monthly'}
              </p>
              
              <div className="space-y-4">
                <p className="font-semibold">All pro plan features, plus:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Roles & permissions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Admin dashboard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Custom workflows</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">180-day version history</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-gray-900 border-gray-800 text-white relative">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-semibold">Enterprise</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">
                  ${isYearly ? pricing.enterprise.yearly : pricing.enterprise.monthly}
                </span>
                <span className="text-gray-400">/ user / month</span>
              </div>
              {isYearly && (
                <div className="text-gray-400 text-sm">
                  <span className="line-through">${pricing.enterprise.monthly}</span> per month billed annually
                </div>
              )}
              <CardDescription className="text-gray-400 text-base">
                For large organizations with advanced needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <Button variant="outline" className="w-full h-12 bg-transparent border-gray-600 text-white hover:bg-gray-800">
                Contact Sales
              </Button>
              <p className="text-center text-gray-400 text-sm">
                Billed {isYearly ? 'annually' : 'monthly'}
              </p>
              
              <div className="space-y-4">
                <p className="font-semibold">All business features, plus:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Advanced security controls</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">SSO integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">API access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">Unlimited version history</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
